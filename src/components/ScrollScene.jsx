import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TruckViewer from '../TruckViewer.jsx'
import GlobeScene, { CITIES, captionAlpha } from './GlobeScene.jsx'
import HeroOverlays from '../overlays/HeroOverlays.jsx'
import GlobeOverlays from '../overlays/GlobeOverlays.jsx'
import useLowPower from '../hooks/useLowPower.js'

gsap.registerPlugin(ScrollTrigger)

function Loader() {
  return (
    <Html center>
      <div className="loader">Loading truck…</div>
    </Html>
  )
}

// Shared camera. Position is the scrubbed keyframe; the look target blends between
// the truck (stages 1–5) and the globe target (stages 6–8) via anim.lookBlend.
// During the India tour (stage 9–10) GlobeScene writes a follow target which we
// blend toward by anim.followAmount, so the camera tracks the moving truck.
function Rig({ anim }) {
  const camP = useMemo(() => new THREE.Vector3(), [])
  const lookT = useMemo(() => new THREE.Vector3(), [])
  const globeT = useMemo(() => new THREE.Vector3(), [])
  const followP = useMemo(() => new THREE.Vector3(), [])
  const followL = useMemo(() => new THREE.Vector3(), [])
  const viewDirection = useMemo(() => new THREE.Vector3(), [])
  const viewRight = useMemo(() => new THREE.Vector3(), [])
  const viewUp = useMemo(() => new THREE.Vector3(), [])
  useFrame((state) => {
    camP.set(anim.camX, anim.camY, anim.camZ)
    lookT.set(0, 2 + (anim.truckY ?? 0), anim.truckZ)
    globeT.set(anim.lookX, anim.lookY, anim.lookZ)
    lookT.lerp(globeT, anim.lookBlend ?? 0)
    const fa = anim.followAmount ?? 0
    if (fa > 0.0001) {
      followP.set(anim.followX, anim.followY, anim.followZ)
      followL.set(anim.followLX, anim.followLY, anim.followLZ)
      camP.lerp(followP, fa)
      lookT.lerp(followL, fa)
    }
    // Frame the truck vertically below the portrait copy, then blend into the
    // globe framing as the camera leaves the truck sequence.
    const aspect = state.size.width / state.size.height
    if (state.size.width <= 1024 && aspect < 1) {
      const globeBlend = anim.lookBlend ?? 0
      camP.x *= THREE.MathUtils.lerp(0.4, 1, globeBlend)
      camP.y += 6 * (1 - globeBlend)
      viewDirection.copy(camP).sub(lookT)
      const cameraDistance = viewDirection.length()
      viewDirection.normalize()
      viewRight.set(0, 1, 0).cross(viewDirection).normalize()
      viewUp.crossVectors(viewDirection, viewRight)

      // Project the truck's bounds onto the camera axes. Opening the doors
      // increases its width and length, so the cargo view also fits the frame.
      const halfWidth = 1.6 + 1.2 * anim.open
      const halfLength = 6.65 + 1.8 * anim.open
      const projectedWidth = Math.abs(viewRight.x) * halfWidth + Math.abs(viewRight.z) * halfLength
      const projectedHeight = Math.abs(viewUp.x) * halfWidth + Math.abs(viewUp.y) * 2.1 + Math.abs(viewUp.z) * halfLength
      const projectedDepth = Math.abs(viewDirection.x) * halfWidth + Math.abs(viewDirection.y) * 2.1 + Math.abs(viewDirection.z) * halfLength
      const sceneTop = Math.min(state.size.height * 0.58, 340 + (state.size.width - 390) * 0.25)
      const sceneHeight = state.size.height - sceneTop - 28
      const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(state.camera.fov / 2))
      const truckDistance = Math.max(
        projectedWidth / (tanHalfFov * aspect * 0.88),
        projectedHeight / (tanHalfFov * sceneHeight / state.size.height),
      ) + projectedDepth
      const globeFit = Math.max(1, (860 / state.size.height) ** 2)
      const globeDistance = cameraDistance * Math.max(1, 1.15 * globeFit / aspect)
      const distance = THREE.MathUtils.lerp(truckDistance, globeDistance, globeBlend)
      camP.copy(lookT).addScaledVector(viewDirection, distance)
      const copyOffset = distance * tanHalfFov * (sceneTop - 28) / state.size.height
      camP.addScaledVector(viewUp, copyOffset * (1 - globeBlend))
      lookT.addScaledVector(viewUp, copyOffset * (1 - globeBlend))
      camP.y += distance * 0.015 * globeBlend
      lookT.y += distance * 0.015 * globeBlend
    } else if (state.size.width <= 1024) {
      camP.sub(lookT).multiplyScalar(1.4).add(lookT)
    }
    state.camera.position.copy(camP)
    state.camera.lookAt(lookT)
  })
  return null
}

// City-name captions: a DOM overlay (crisp, screen-anchored) that fades each
// stop's name in as the truck arrives — branch/head on the side, the "Upcoming
// Soon" stop at the bottom. Driven straight off the live scroll value in a rAF
// loop (anim is a mutable ref, so this avoids React re-renders).
function CityCaptions({ anim }) {
  const refs = useRef([])
  useEffect(() => {
    let raf
    const loop = () => {
      const j = anim.journey ?? 0
      const active = (anim.indiaLock ?? 0) > 0.55
      for (let i = 0; i < CITIES.length; i++) {
        const el = refs.current[i]
        if (el) el.style.opacity = (active ? captionAlpha(j, CITIES[i]) : 0).toFixed(3)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [anim])
  return (
    <div className="overlay">
      {CITIES.map((c, i) => (
        <div
          key={c.name}
          ref={(el) => (refs.current[i] = el)}
          className={`city-caption ${c.role === 'soon' ? 'bottom' : 'side'} role-${c.role}`}
        >
          <div className="cc-name">{c.name}</div>
          <div className="cc-role">{c.label}</div>
        </div>
      ))}
    </div>
  )
}

// Builds the truck choreography (stages 1–5) EXACTLY as before, on its own
// timeline (normalized 0→1). It's later compressed into the first 40% of scroll.
function buildTruckTimeline(anim) {
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  // CAMERA — 5 keyframes
  tl.to(anim, { camX: 0, camY: 3, camZ: -14, duration: 0.25 }, 0.0)
    .to(anim, { camX: 16, camY: 4, camZ: 0, duration: 0.25 }, 0.25)
    .to(anim, { camX: 0, camY: 3.5, camZ: 13, duration: 0.25 }, 0.5)
    .to(anim, { camX: 18, camY: 4, camZ: 0, duration: 0.05 }, 0.75)

  // HEADLIGHTS ramp 0→8 on the front approach
  tl.to(anim, { headlight: 8, ease: 'power2.out', duration: 0.25 }, 0.0)

  // DOORS open 60→75%, close 75→80%
  tl.to(anim, { open: 1, ease: 'power1.inOut', duration: 0.15 }, 0.6)
    .to(anim, { interior: 1.9, ease: 'sine.inOut', duration: 0.15 }, 0.6)
    .to(anim, { open: 0, ease: 'power1.inOut', duration: 0.05 }, 0.75)
    .to(anim, { interior: 1, ease: 'sine.inOut', duration: 0.05 }, 0.75)

  // STAGE 5 departure — a gentle, steady roll-away (shorter distance + softer
  // ease over a wider scroll window, so it no longer shoots off too fast).
  tl.to(anim, { bobAmp: 0.05, duration: 0.02 }, 0.75)
    .to(anim, { smokeRate: 1, duration: 0.02 }, 0.75)
  tl.to(anim, { truckZ: -3, ease: 'power1.in', duration: 0.08 }, 0.8)
    .to(anim, { bobAmp: 0.09, duration: 0.04 }, 0.8)
    .to(anim, { smokeRate: 2, duration: 0.04 }, 0.8)
  tl.to(anim, { truckZ: -18, ease: 'power1.in', duration: 0.12 }, 0.88)
    .to(anim, { bobAmp: 0.03, duration: 0.06 }, 0.88)

  return tl
}

// Builds the globe sequence (stages 6–10) on its own timeline. Local positions
// 0→0.6 map to scroll 40→100% once added at master position 0.4.
function buildGlobeTimeline(anim) {
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  // STAGE 6 (40→50%) — camera lifts to bird's-eye; truck fades; bg → space.
  tl.to(anim, { camX: 0, camY: 60, camZ: 0, duration: 0.1 }, 0.0)
    .to(anim, { lookBlend: 1, duration: 0.1 }, 0.0)
    .to(anim, { bgFade: 1, duration: 0.1 }, 0.0)
    .to(anim, { truckOpacity: 0, duration: 0.08 }, 0.0)
    .to(anim, { bobAmp: 0, smokeRate: 0, duration: 0.05 }, 0.0)

  // STAGE 7 (50→60%) — globe materializes; camera pulls to [0,0,25].
  tl.to(anim, { camX: 0, camY: 0, camZ: 25, duration: 0.1 }, 0.1)
    .to(anim, { globeScale: 1, ease: 'power3.out', duration: 0.1 }, 0.1)
    .to(anim, { globeOpacity: 1, duration: 0.08 }, 0.1)

  // STAGE 8 (60→75%) — zoom onto North India and lock rotation. Pulled back a bit
  // so the cities/labels sit compact with generous empty margin on the sides for
  // ~3-4 lines of copy to be added later.
  tl.to(anim, { camX: 0, camY: 5.8, camZ: 19.5, duration: 0.15 }, 0.2)
    .to(anim, { lookX: 0, lookY: 4.5, lookZ: 8.5, duration: 0.15 }, 0.2)
    .to(anim, { indiaLock: 1, duration: 0.15 }, 0.2)

  // STAGE 9–10 (75→100%) — the guided tour: camera follows the truck along the
  // surface trail Lucknow → Noida → Delhi → Amritsar (stop), dwelling at each
  // stop while its name caption fades in. Linear scrub so it tracks the scroll.
  tl.to(anim, { journey: 1, ease: 'none', duration: 0.25 }, 0.35)

  return tl
}

export default function ScrollScene() {
  const lowPower = useLowPower()
  const anim = useRef({
    // Camera (stage 1 idle: front-left hero)
    camX: -12,
    camY: 6,
    camZ: -15,
    // Camera look target (globe stages) + blend from the truck-tracking target
    lookX: 0,
    lookY: 0,
    lookZ: 0,
    lookBlend: 0,
    // Truck state
    headlight: 0,
    open: 0,
    interior: 1,
    truckZ: 0,
    truckY: 0,
    bobAmp: 0,
    smokeRate: 0,
    truckOpacity: 1,
    // Globe state
    bgFade: 0,
    globeScale: 0.1,
    globeOpacity: 0,
    indiaLock: 0,
    journey: 0,
    // Follow camera (written by GlobeScene during the India tour, blended in Rig)
    followX: 0,
    followY: 0,
    followZ: 0,
    followLX: 0,
    followLY: 0,
    followLZ: 0,
    followAmount: 0,
  }).current

  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const truckTL = buildTruckTimeline(anim)
      truckTL.totalDuration(0.4) // compress the truck scroll into the first 40%
      const globeTL = buildGlobeTimeline(anim) // duration 0.6 → the last 60%

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      })
      master.add(truckTL, 0)
      master.add(globeTL, 0.4)
    }, rootRef)

    ScrollTrigger.refresh()
    // Mobile browsers can suppress ScrollTrigger's resize refresh. Observe the
    // actual scroll track so rotation keeps the timeline and overlays in sync.
    const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh())
    resizeObserver.observe(rootRef.current)
    return () => {
      resizeObserver.disconnect()
      ctx.revert()
    }
  }, [anim])

  return (
    <div ref={rootRef} className="scroll-root">
      <div className="canvas-wrap">
        <Canvas
          shadows
          dpr={lowPower ? 1 : [1, 1.5]}
          style={{ touchAction: 'pan-y' }}
          camera={{ position: [-12, 6, -15], fov: 45, near: 0.1, far: 300 }}
        >
          <color attach="background" args={['#0a1a3a']} />
          <ambientLight intensity={0.45} />
          <directionalLight
            position={[12, 18, 10]}
            intensity={2.2}
            castShadow
            shadow-mapSize={lowPower ? [1024, 1024] : [2048, 2048]}
          />
          <directionalLight position={[-10, 8, -12]} intensity={0.6} color="#9db4ff" />
          <hemisphereLight args={['#bcd0ff', '#0a1a3a', 0.4]} />

          <Suspense fallback={<Loader />}>
            <Environment preset="city" />
            <TruckViewer anim={anim} />
          </Suspense>

          {/* Globe lives in the same persistent Canvas; hidden until stage 7. */}
          <GlobeScene anim={anim} />

          {/* Scroll fully owns the camera — no OrbitControls on purpose. */}
          <Rig anim={anim} />
        </Canvas>
      </div>

      {/* City-name captions fade in over the canvas as the truck reaches each stop. */}
      <CityCaptions anim={anim} />

      {/* Scroll-synced text overlays (read scroll progress; never touch the anim ref). */}
      <HeroOverlays />
      <GlobeOverlays />
    </div>
  )
}
