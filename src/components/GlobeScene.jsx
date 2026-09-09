import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// ---------------------------------------------------------------------------
// Realistic textured Earth + glowing India outline + a guided truck "tour":
// the camera zooms onto Lucknow with the truck, then FOLLOWS the truck along a
// surface trail to Noida → Delhi → Amritsar (final stop). City-name captions
// (rendered as a DOM overlay in ScrollScene) fade in as the truck arrives at
// each stop. Everything is built imperatively into one THREE.Group and driven
// each frame from the shared scroll `anim` object.
// ---------------------------------------------------------------------------

const GLOBE_R = 10
const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'

// Earth daymap: bundled locally, with a three.js-CDN fallback if missing.
const TEX = {
  day: ['/textures/earth_daymap.jpg', 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'],
}

// lat/lng → world position on a sphere of `r`.
function latLngToVec3(lat, lng, r) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

// --- Tour stops -------------------------------------------------------------
// Positions are exaggerated apart along the real NW diagonal (Lucknow south-east
// → Amritsar up in Punjab) so the journey + captions are legible. `arrive`/
// `depart` are journey-progress (0..1) breakpoints: the truck DWELLS at the stop
// between them and DRIVES to the next stop in the gap. Exported so the caption
// overlay (ScrollScene) and the path share one schedule.
export const CITIES = [
  { name: 'LUCKNOW', role: 'head', label: 'Head Office', lat: 26.85, lng: 80.94, arrive: 0.06, depart: 0.13 },
  { name: 'NOIDA', role: 'branch', label: 'Branch', lat: 28.3, lng: 78.5, arrive: 0.34, depart: 0.44 },
  { name: 'DELHI', role: 'branch', label: 'Branch', lat: 29.5, lng: 76.7, arrive: 0.64, depart: 0.73 },
  { name: 'AMRITSAR', role: 'soon', label: 'Upcoming Soon', lat: 31.5, lng: 75.3, arrive: 0.93, depart: 1.0 },
]
const ROLE_COLORS = {
  head: { main: '#ff8a1a' },
  branch: { main: '#ff7a1a' },
  soon: { main: '#8fb6ff' },
}

// --- Simplified India border (lat,lng), traced clockwise from the NW. --------
const INDIA_BORDER = [
  [34.2, 73.8], [32.3, 75.5], [30.4, 79.0], [28.6, 81.3], [27.2, 85.5],
  [26.7, 88.1], [27.1, 88.8], [27.0, 92.0], [27.8, 95.5], [28.1, 97.0],
  [25.5, 95.2], [24.2, 94.2], [23.0, 93.4], [22.0, 92.6], [23.2, 91.2],
  [24.5, 91.8], [25.2, 90.0], [26.0, 89.8], [25.3, 88.2], [23.5, 88.8],
  [21.7, 87.5], [20.3, 86.7], [17.7, 83.3], [15.9, 80.5], [13.1, 80.3],
  [11.1, 79.8], [9.3, 79.3], [8.1, 77.5], [8.9, 76.6], [11.0, 75.5],
  [13.0, 74.7], [15.3, 73.9], [17.7, 73.2], [19.0, 72.8], [20.7, 70.9],
  [22.3, 69.0], [23.0, 68.2], [24.3, 68.7], [25.4, 70.6], [27.7, 71.0],
  [29.0, 73.0], [30.5, 74.5], [32.0, 75.0],
]

const backOut = (x) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  const k = Math.min(Math.max(x, 0), 1) - 1
  return 1 + c3 * k * k * k + c1 * k * k
}
const clamp01 = (x) => Math.min(Math.max(x, 0), 1)
const smooth = (t) => t * t * (3 - 2 * t)

const NAVY = new THREE.Color('#0a1a3a')
const SPACE = new THREE.Color('#000010')

// --- Follow-camera offsets (world space, applied relative to the truck). -----
const FOLLOW_LIFT = 2.3 // above the truck (world +Y)
const FOLLOW_FRONT = 4.2 // toward the viewer (world +Z, the India-facing side)
const FOLLOW_LOOK_UP = 0.5 // aim a touch above the truck

// Load a texture into `material[prop]`, falling back to a CDN URL on error.
function loadTexInto(material, prop, [localUrl, cdnUrl], { srgb = false } = {}) {
  const loader = new THREE.TextureLoader()
  const apply = (tex) => {
    if (srgb) tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    material[prop] = tex
    material.needsUpdate = true
  }
  loader.load(localUrl, apply, undefined, () => {
    if (cdnUrl && cdnUrl !== localUrl) loader.load(cdnUrl, apply)
  })
}

// Unit direction along the tour at journey `j` (dwell at stops, slerp between).
function tourDir(j, dirs, out) {
  for (let k = 0; k < CITIES.length; k++) {
    const c = CITIES[k]
    if (j <= c.depart) {
      if (k === 0 || j >= c.arrive) return out.copy(dirs[k]) // dwelling at stop k
      const prev = CITIES[k - 1]
      const t = (j - prev.depart) / (c.arrive - prev.depart)
      return out.copy(dirs[k - 1]).lerp(dirs[k], smooth(clamp01(t))).normalize()
    }
  }
  return out.copy(dirs[dirs.length - 1])
}

// Caption opacity for a stop: fade in just before arrival, hold through the
// dwell, fade out shortly after departure (Amritsar holds to the end).
export function captionAlpha(j, c) {
  const FI = 0.05
  const FO = 0.05
  const up = clamp01((j - (c.arrive - FI)) / FI)
  const down = c.depart >= 0.999 ? 1 : clamp01((c.depart + FO - j) / FO)
  return Math.min(up, down)
}

function buildGlobe() {
  const group = new THREE.Group()
  group.name = 'Globe'
  group.scale.setScalar(0.1)
  group.visible = false

  // --- Earth body: clean high-res map on a smooth matte sphere. envMapIntensity
  // 0 stops the city Environment (used by the truck) from reflecting onto oceans.
  const earthMat = new THREE.MeshStandardMaterial({
    color: '#ffffff', roughness: 1, metalness: 0.0, envMapIntensity: 0,
    transparent: true, opacity: 0,
  })
  loadTexInto(earthMat, 'map', TEX.day, { srgb: true })
  const earth = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R, 128, 128), earthMat)
  earth.renderOrder = 0
  group.add(earth)

  // --- Atmosphere rim glow (back-side sphere) -------------------------------
  const atmoMat = new THREE.MeshBasicMaterial({
    color: '#5aa0ff', transparent: true, opacity: 0, side: THREE.BackSide, depthWrite: false,
  })
  group.add(new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R + 0.55, 48, 48), atmoMat))

  // --- Glowing India outline (border line + a faded halo) -------------------
  const outlineMat = new THREE.LineBasicMaterial({
    color: '#ff9a3a', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
  })
  const outline = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(INDIA_BORDER.map(([la, ln]) => latLngToVec3(la, ln, GLOBE_R + 0.04))),
    outlineMat,
  )
  outline.renderOrder = 3
  group.add(outline)
  const outlineGlowMat = new THREE.LineBasicMaterial({
    color: '#ffd08a', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
  })
  const halo = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(INDIA_BORDER.map(([la, ln]) => latLngToVec3(la, ln, GLOBE_R + 0.09))),
    outlineGlowMat,
  )
  halo.renderOrder = 2
  group.add(halo)

  // --- City markers: a small glowing knob + short pin + ground ring ---------
  const cityDirs = CITIES.map((c) => latLngToVec3(c.lat, c.lng, 1).normalize())
  const Yax = new THREE.Vector3(0, 1, 0)
  const markers = []
  CITIES.forEach((c, i) => {
    const dir = cityDirs[i]
    const colors = ROLE_COLORS[c.role]
    const g = new THREE.Group()
    g.position.copy(dir).multiplyScalar(GLOBE_R)
    g.quaternion.setFromUnitVectors(Yax, dir) // local +Y = surface normal
    g.scale.setScalar(0.0001)
    const markMat = new THREE.MeshStandardMaterial({
      color: colors.main, emissive: colors.main, emissiveIntensity: 1.8, roughness: 0.5,
    })
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), markMat)
    pin.position.y = 0.25
    g.add(pin)
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), markMat)
    knob.position.y = 0.5
    g.add(knob)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.28, 28),
      new THREE.MeshBasicMaterial({ color: colors.main, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false }),
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.02
    g.add(ring)
    group.add(g)
    markers.push({ g, markMat, role: c.role })
  })

  // --- Dotted surface trail along the whole tour (revealed via draw range) --
  const N = 220
  const trailPts = new Float32Array(N * 3)
  const tmp = new THREE.Vector3()
  for (let i = 0; i < N; i++) {
    tourDir(i / (N - 1), cityDirs, tmp).multiplyScalar(GLOBE_R + 0.06)
    trailPts[i * 3] = tmp.x
    trailPts[i * 3 + 1] = tmp.y
    trailPts[i * 3 + 2] = tmp.z
  }
  const trailGeo = new THREE.BufferGeometry()
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPts, 3))
  trailGeo.setDrawRange(0, 0)
  const trailMat = new THREE.LineDashedMaterial({
    color: '#ffb066', dashSize: 0.16, gapSize: 0.12,
    transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
  })
  const trail = new THREE.Line(trailGeo, trailMat)
  trail.computeLineDistances()
  trail.renderOrder = 4
  group.add(trail)

  // India (≈20°N, 78°E) → +Z for the camera lock.
  const india = latLngToVec3(20, 78, GLOBE_R)
  const lockY = Math.atan2(-india.x, india.z)

  group.userData.api = {
    group, earthMat, atmoMat, outlineMat, outlineGlowMat,
    markers, trail, trailMat, trailN: N, cityDirs,
    truckPivot: null, lockY, spin: 0, jMax: 0, lastForward: new THREE.Vector3(0, 0, 1),
  }
  return group
}

// Scratch vectors reused each frame (avoid per-frame allocation).
const _dir = new THREE.Vector3()
const _ahead = new THREE.Vector3()
const _behind = new THREE.Vector3()
const _n = new THREE.Vector3()
const _f = new THREE.Vector3()
const _s = new THREE.Vector3()
const _m = new THREE.Matrix4()
const _pw = new THREE.Vector3()

function updateGlobe(api, anim, t, dt) {
  if (!api) return
  const op = anim.globeOpacity ?? 0
  const group = api.group
  if (!group) return
  group.visible = op > 0.004 || (anim.globeScale ?? 0) > 0.5
  group.scale.setScalar(Math.max(0.0001, anim.globeScale ?? 0.1))

  // India-specific layers reveal only once the camera has locked onto India.
  const lock = anim.indiaLock ?? 0
  const indiaReveal = clamp01((lock - 0.45) / 0.35)

  api.earthMat.opacity = op
  api.atmoMat.opacity = 0.16 * op
  api.outlineMat.opacity = op * indiaReveal
  api.outlineGlowMat.opacity = 0.45 * op * indiaReveal

  // Auto-rotate, slowing to a hard lock on India as lock → 1.
  api.spin += 0.05 * dt * (1 - lock)
  let target = api.lockY
  while (target - api.spin > Math.PI) target -= 2 * Math.PI
  while (target - api.spin < -Math.PI) target += 2 * Math.PI
  const breathing = Math.sin(t * 0.5) * (0.5 * Math.PI / 180) * lock
  group.rotation.y = THREE.MathUtils.lerp(api.spin, target, lock) + breathing

  const j = clamp01(anim.journey ?? 0)
  api.jMax = Math.max(api.jMax, j)

  // City markers pop in with the India zoom; the "upcoming" marker pulses.
  const ms = backOut(indiaReveal)
  for (const m of api.markers) {
    m.g.scale.setScalar(Math.max(0.0001, ms))
    if (m.role === 'soon') m.markMat.emissiveIntensity = 0.9 + 1.0 * (0.5 + 0.5 * Math.sin(t * 2.5))
  }

  // Trail reveals up to the live tour position (hidden off the India view).
  api.trailMat.opacity = 0.9 * op * indiaReveal
  api.trail.geometry.setDrawRange(0, Math.max(0, Math.floor(j * api.trailN)))

  // Truck pose along the tour, oriented tangent to the surface.
  tourDir(j, api.cityDirs, _dir)
  const truck = api.truckPivot
  if (truck) {
    truck.visible = lock > 0.5
    truck.position.copy(_dir).multiplyScalar(GLOBE_R)
    tourDir(Math.min(j + 0.01, 1), api.cityDirs, _ahead)
    tourDir(Math.max(j - 0.01, 0), api.cityDirs, _behind)
    _n.copy(_dir) // surface normal (up)
    _f.copy(_ahead).sub(_behind) // travel direction (forward)
    _f.addScaledVector(_n, -_f.dot(_n)) // project onto the tangent plane
    if (_f.lengthSq() < 1e-8) {
      // Stopped (dwell): keep the last heading instead of snapping.
      _f.copy(api.lastForward).addScaledVector(_n, -_f.dot(_n))
      if (_f.lengthSq() < 1e-8) _f.set(0, 0, 1)
    }
    _f.normalize()
    api.lastForward.copy(_f)
    _s.crossVectors(_n, _f).normalize() // right
    _m.makeBasis(_s, _n, _f) // local +X→right, +Y→up, +Z→forward
    truck.quaternion.setFromRotationMatrix(_m)
  }

  // Follow camera: write the truck's WORLD pose + offsets for the Rig to blend
  // toward (followAmount ramps 0→1 right as the tour begins, zooming onto Lucknow).
  const gscale = group.scale.x
  _pw.copy(_dir).multiplyScalar(GLOBE_R * gscale).applyQuaternion(group.quaternion)
  anim.followX = _pw.x
  anim.followY = _pw.y + FOLLOW_LIFT
  anim.followZ = _pw.z + FOLLOW_FRONT
  anim.followLX = _pw.x
  anim.followLY = _pw.y + FOLLOW_LOOK_UP
  anim.followLZ = _pw.z
  anim.followAmount = clamp01(j / 0.05)
}

// Clone the hero truck.glb, shrink it, and add it to the globe group. Cloning
// the materials decouples it from the stage-6 fade that drives the hero truck's
// (shared) materials to opacity 0.
function addGlobeTruck(group, gltfScene) {
  const inner = gltfScene.clone(true)
  inner.rotation.set(0, 0, 0)
  inner.position.set(0, 0, 0)
  inner.scale.setScalar(1)
  inner.traverse((o) => {
    if (!o.material) return
    const list = Array.isArray(o.material) ? o.material : [o.material]
    const cloned = list.map((m) => {
      const c = m.clone()
      c.transparent = false
      c.opacity = 1
      c.depthWrite = true
      return c
    })
    o.material = Array.isArray(o.material) ? cloned : cloned[0]
    o.visible = true
  })

  // Scale so the truck reads clearly under the follow cam, then seat it on the surface.
  const box = new THREE.Box3().setFromObject(inner)
  const size = box.getSize(new THREE.Vector3())
  const longest = Math.max(size.x, size.y, size.z) || 1
  inner.scale.setScalar(0.55 / longest)
  box.setFromObject(inner)
  inner.position.y = -box.min.y // wheels kiss the local y=0 (surface) plane

  const pivot = new THREE.Group()
  pivot.name = 'Globe_Truck'
  pivot.visible = false
  pivot.add(inner)
  group.add(pivot)
  group.userData.api.truckPivot = pivot
  return pivot
}

export default function GlobeScene({ anim }) {
  const group = useMemo(() => buildGlobe(), [])
  const { scene } = useThree()

  // Load the truck imperatively (no Suspense) and clone it onto the globe.
  useEffect(() => {
    let alive = true
    const draco = new DRACOLoader()
    draco.setDecoderPath(DRACO_DECODER_PATH)
    const loader = new GLTFLoader()
    loader.setDRACOLoader(draco)
    loader.load('/models/truck.glb', (gltf) => {
      if (alive) addGlobeTruck(group, gltf.scene)
    })
    return () => {
      alive = false
      draco.dispose()
      const pivot = group.userData.api.truckPivot
      if (pivot) {
        pivot.parent?.remove(pivot)
        pivot.traverse((o) => {
          o.geometry?.dispose?.()
          const list = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []
          for (const m of list) m.dispose?.()
        })
      }
    }
  }, [group])

  useFrame((state, dt) => {
    updateGlobe(group.userData.api, anim, state.clock.elapsedTime, dt)
    // Background fades from brand navy → space black as the camera lifts.
    if (scene.background?.isColor) scene.background.copy(NAVY).lerp(SPACE, anim.bgFade ?? 0)
  })

  return <primitive object={group} />
}
