import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Public CDN Draco decoder — the model is Draco-compressed.
const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'

// Door swing angles (degrees). These mirror the Blender hinge test:
// in three.js the vertical (hinge) axis is Y, with the same sign as Blender's Z.
const DOOR_DEG = {
  Door_Cab_L: -70,
  Door_Cab_R: 70,
  Door_Trailer_L: -80,
  Door_Trailer_R: 80,
}

const D2R = THREE.MathUtils.degToRad

// ---------------------------------------------------------------------------
// Small geometry helpers (shared by cargo + interiors). Every mesh defaults to
// casting/receiving shadows; callers override where it would just add noise.
// ---------------------------------------------------------------------------
const mat = (color, roughness, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness })

function addBox(parent, w, h, d, x, y, z, material, cast = false, receive = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
  m.position.set(x, y, z)
  m.castShadow = cast
  m.receiveShadow = receive
  parent.add(m)
  return m
}

// ---------------------------------------------------------------------------
// Cargo stack
// ---------------------------------------------------------------------------
// Per-colour material spec. `kind` drives the detailing pass: cardboard gets a
// packing-tape cross, plastic gets a moulded lid + side ribs (heavy-duty tote).
const CARGO_SPEC = {
  // Matte cardboard + heavy-duty plastic totes. Roughness kept high (≥0.8) so
  // nothing reads as glossy plastic-wrap; metalness near zero for matte plastic.
  brown: { color: '#caa15a', rough: 0.92, metal: 0.0, kind: 'card', accent: '#b89066' },
  navy: { color: '#16264a', rough: 0.8, metal: 0.08, kind: 'plastic', accent: '#0f1c38' },
  grey: { color: '#8a8a8a', rough: 0.8, metal: 0.08, kind: 'plastic', accent: '#5f5f5f' },
}
const TAPE_COLOR = '#b89f76'
const LABEL_COLOR = '#e9e4d6' // shipping-label paper on the cardboard boxes

// Box defs in the anchor-local frame: sx = sideways, fz = distance toward the
// trailer doors, by = height of THIS box's base above the floor (0 = on the
// floor, top-layer boxes rest on the one beneath). tilt = small yaw so the
// stack reads hand-loaded rather than robotic. fz fills the trailer's back half.
const CARGO_DEFS = [
  // bottom layer — sitting on the floor
  { w: 1.0, h: 0.8, d: 0.9, sx: -0.45, fz: 1.5, by: 0, c: 'brown', tilt: 2 },
  { w: 0.9, h: 0.8, d: 0.8, sx: 0.55, fz: 1.55, by: 0, c: 'navy', tilt: -1.5 },
  { w: 1.1, h: 0.9, d: 1.0, sx: -0.35, fz: 2.6, by: 0, c: 'brown', tilt: 1 },
  { w: 0.85, h: 0.7, d: 0.9, sx: 0.6, fz: 2.65, by: 0, c: 'grey', tilt: -2.5 },
  { w: 1.0, h: 0.85, d: 1.0, sx: 0.05, fz: 3.8, by: 0, c: 'brown', tilt: 1.5 },
  // top layer — resting on the box beneath (by = that box's height)
  { w: 0.8, h: 0.6, d: 0.8, sx: -0.4, fz: 1.5, by: 0.8, c: 'navy', tilt: -2 },
  { w: 0.75, h: 0.6, d: 0.75, sx: 0.5, fz: 2.6, by: 0.9, c: 'grey', tilt: 2.5 },
  { w: 0.9, h: 0.7, d: 0.85, sx: -0.05, fz: 3.8, by: 0.85, c: 'brown', tilt: -1 },
]

// ---------------------------------------------------------------------------
// Trailer cargo-hold dimensions, shared by the interior builder AND the cargo
// placement so the boxes sit exactly on the floor we actually build (instead of
// guessing against the GLB's original deck, which sits a touch lower and was the
// cause of the boxes clipping through the floor).
// ---------------------------------------------------------------------------
const TRAILER = {
  X: 1.18, // interior half-width
  FLOOR: 1.1, // floor-deck centre (world Y; Truck_Chassis is an identity node)
  CEIL: 3.4,
  Z_FRONT: -1.55, // bulkhead near the cab
  Z_BACK: -6.3, // just forward of the doors
  DECK_THICK: 0.04,
  SLAT_RISE: 0.025, // slats sit this far above the deck centre
  SLAT_THICK: 0.03,
}
// World Y of the top surface the cargo actually rests on (deck + slat thickness).
const TRAILER_FLOOR_TOP = TRAILER.FLOOR + TRAILER.SLAT_RISE + TRAILER.SLAT_THICK / 2

// Tiny seat gap so the box base kisses the slats without z-fighting.
const FLOOR_EPS = 0.004

// Builds one detailed cargo box (centred at its group origin) into `parent`.
function addCargoBox(parent, def, materials) {
  const spec = CARGO_SPEC[def.c]
  const g = new THREE.Group()

  const body = new THREE.Mesh(new THREE.BoxGeometry(def.w, def.h, def.d), materials.body[def.c])
  body.castShadow = true
  body.receiveShadow = true
  g.add(body)

  const top = def.h / 2
  if (spec.kind === 'card') {
    // Packing-tape cross sealing the top flaps.
    addBox(g, def.w * 0.17, 0.03, def.d * 1.004, 0, top, 0, materials.tape, false, false)
    addBox(g, def.w * 1.004, 0.028, def.d * 0.17, 0, top - 0.004, 0, materials.tape, false, false)
    // Faint seam where the two top flaps meet, running along the depth.
    addBox(g, 0.012, 0.012, def.d * 0.96, 0, top + 0.006, 0, materials.accent[def.c], false, false)
    // Stuck-on shipping label on the front face + its dark address bar.
    addBox(g, def.w * 0.34, def.h * 0.34, 0.008, def.w * 0.18, def.h * 0.04, def.d / 2, materials.label, false, false)
    addBox(g, def.w * 0.26, def.h * 0.05, 0.006, def.w * 0.18, def.h * 0.12, def.d / 2 + 0.004, materials.accent[def.c], false, false)
  } else {
    // Moulded lid lip that overhangs the body + a slightly inset recessed top.
    addBox(g, def.w * 1.04, 0.09, def.d * 1.04, 0, top - 0.02, 0, materials.accent[def.c], false, false)
    addBox(g, def.w * 0.86, 0.05, def.d * 0.86, 0, top + 0.02, 0, materials.body[def.c], false, false)
    // Two vertical ribs on the front face for the heavy-duty container look.
    addBox(g, 0.045, def.h * 0.74, 0.025, def.w * 0.28, 0, def.d / 2, materials.accent[def.c], false, false)
    addBox(g, 0.045, def.h * 0.74, 0.025, -def.w * 0.28, 0, def.d / 2, materials.accent[def.c], false, false)
  }
  parent.add(g)
  return g
}

/**
 * Builds a grouped cargo stack and parents it to Cargo_Anchor (inside the trailer),
 * so it rides with the truck. The "toward the doors" direction is derived from the
 * actual trailer-door node positions, so the stack always fills the door end.
 */
function buildCargoStack(nodes, scene) {
  const anchor = nodes.Cargo_Anchor || scene.getObjectByName('Cargo_Anchor')
  if (!anchor) return null

  scene.updateMatrixWorld(true)
  const aw = anchor.getWorldPosition(new THREE.Vector3())
  const dl = (nodes.Door_Trailer_L || scene.getObjectByName('Door_Trailer_L')).getWorldPosition(new THREE.Vector3())
  const dr = (nodes.Door_Trailer_R || scene.getObjectByName('Door_Trailer_R')).getWorldPosition(new THREE.Vector3())

  const back = dl.clone().add(dr).multiplyScalar(0.5).sub(aw)
  back.y = 0
  back.normalize() // horizontal direction from anchor toward the doors
  const up = new THREE.Vector3(0, 1, 0)
  const side = new THREE.Vector3().crossVectors(up, back).normalize()

  // The anchor inherits the truck's world rotation (the scene is flipped 180° so
  // the truck faces −Z). Convert these WORLD directions into the anchor's LOCAL
  // frame before using them as local box positions — otherwise the stack lands
  // at the wrong (cab) end of the trailer and the hold reads as empty.
  const invQ = anchor.getWorldQuaternion(new THREE.Quaternion()).invert()
  const backL = back.clone().applyQuaternion(invQ)
  const sideL = side.clone().applyQuaternion(invQ)
  const upL = up.clone().applyQuaternion(invQ)

  // Shared materials so the eight boxes don't spin up redundant programs.
  const materials = {
    body: {},
    accent: {},
    tape: mat(TAPE_COLOR, 0.85),
    label: mat(LABEL_COLOR, 0.9),
  }
  for (const [k, s] of Object.entries(CARGO_SPEC)) {
    materials.body[k] = mat(s.color, s.rough, s.metal)
    materials.accent[k] = mat(s.accent, Math.min(s.rough + 0.05, 1), s.metal)
  }

  const group = new THREE.Group()
  group.name = 'Cargo_Stack'

  // How far the floor-top surface sits above the anchor, in anchor-local Y.
  // The anchor is an identity-rotation node, so its local up maps straight to
  // world up: lifting boxes by this much lands their base flat on the slats
  // instead of sinking through the deck.
  const baseLift = TRAILER_FLOOR_TOP - aw.y + FLOOR_EPS

  for (const def of CARGO_DEFS) {
    const box = addCargoBox(group, def, materials)
    // Base flat on the floor: centre Y = floor-top + this box's stacked base + half height.
    box.position
      .copy(new THREE.Vector3())
      .addScaledVector(sideL, def.sx)
      .addScaledVector(upL, baseLift + def.by + def.h / 2)
      .addScaledVector(backL, def.fz)
    box.rotation.y = D2R(def.tilt) // slight hand-loaded yaw
  }

  anchor.add(group) // parent to the truck so it moves with it

  // Soft warm interior light so the boxes read instead of going pitch black once
  // the trailer roof blocks the key directional light. Parented to Cargo_Anchor,
  // nudged up + back toward the doors (local frame) to wash over the stack.
  const light = new THREE.PointLight('#ffd9a0', 1.5, 4, 2)
  light.name = 'Cargo_InteriorLight'
  light.position.copy(new THREE.Vector3()).addScaledVector(upL, 1.6).addScaledVector(backL, 2.2)
  light.castShadow = false
  anchor.add(light)

  return { group, light }
}

// ---------------------------------------------------------------------------
// Trailer interior — ribbed metal cargo-hold walls, floor slats, roof bows.
// Parented to Truck_Chassis (identity transform), so coordinates are world-space.
// Inset just inside the existing body shell (x ±1.25, y 1.042..3.542, z -6.39..).
// ---------------------------------------------------------------------------
function buildTrailerInterior(nodes, scene) {
  const root = nodes.Truck_Chassis || scene.getObjectByName('Truck_Chassis')
  if (!root) return null

  const { X, FLOOR, CEIL, Z_FRONT, Z_BACK } = TRAILER
  const midY = (FLOOR + CEIL) / 2
  const midZ = (Z_FRONT + Z_BACK) / 2
  const len = Z_FRONT - Z_BACK // along +z
  const height = CEIL - FLOOR

  const wallMat = mat('#9aa3b0', 0.55, 0.5)
  const ribMat = mat('#bcc5d2', 0.5, 0.55)
  const frameMat = mat('#5c6470', 0.5, 0.6)
  const floorMat = mat('#6b7280', 0.5, 0.55)
  const slatMat = mat('#878f9c', 0.45, 0.55)

  const g = new THREE.Group()
  g.name = 'Trailer_Interior'

  // Side walls + vertical ribs (run floor→ceiling, repeated down the length).
  for (const sgn of [1, -1]) {
    addBox(g, 0.04, height, len, sgn * X, midY, midZ, wallMat)
    const ribs = 9
    for (let i = 0; i < ribs; i++) {
      const z = Z_BACK + 0.4 + (i / (ribs - 1)) * (len - 0.8)
      addBox(g, 0.06, height - 0.12, 0.09, sgn * (X - 0.05), midY, z, ribMat)
    }
  }

  // Front bulkhead (the wall you see straight ahead through the open doors).
  addBox(g, X * 2 + 0.04, height, 0.04, 0, midY, Z_FRONT, wallMat)
  for (let i = 0; i < 5; i++) {
    const x = -X + 0.3 + (i / 4) * (2 * X - 0.6)
    addBox(g, 0.08, height - 0.12, 0.06, x, midY, Z_FRONT + 0.05, ribMat)
  }

  // Roof panel + transverse roof bows.
  addBox(g, X * 2 + 0.08, 0.04, len, 0, CEIL, midZ, wallMat, false, false)
  for (let i = 0; i < 6; i++) {
    const z = Z_BACK + 0.3 + (i / 5) * (len - 0.6)
    addBox(g, X * 2, 0.07, 0.09, 0, CEIL - 0.05, z, frameMat, false, false)
  }

  // Floor deck + longitudinal slats (receive cargo shadows). Slat top surface
  // == TRAILER_FLOOR_TOP, which is exactly where the cargo bases land.
  addBox(g, X * 2 + 0.06, TRAILER.DECK_THICK, len, 0, FLOOR, midZ, floorMat, false, true)
  const slats = 9
  for (let i = 0; i < slats; i++) {
    const x = -X + 0.2 + (i / (slats - 1)) * (2 * X - 0.4)
    addBox(g, 0.09, TRAILER.SLAT_THICK, len - 0.1, x, FLOOR + TRAILER.SLAT_RISE, midZ, slatMat, false, true)
  }

  root.add(g)
  return g
}

// ---------------------------------------------------------------------------
// Cab shell — replaces the original solid dark-blue cab + opaque windshield with
// an open low-poly cage: clean corner pillars, a solid lower body / rear wall,
// open side-window cutouts, and a separate see-through glass windshield so the
// modelled interior is visible from the front and sides.
// Parented to Truck_Chassis (identity), so coordinates are world-space. Derived
// from the original Truck_Cab bounds (local x±1.15 y0.85..3.25 z4.3..5.99) plus
// the node offset (0, -0.0079, 0.41).
// ---------------------------------------------------------------------------
function buildCabShell(nodes, scene) {
  const root = nodes.Truck_Chassis || scene.getObjectByName('Truck_Chassis')
  if (!root) return null

  // Hide the solid shell + opaque dark windshield so the cutouts read through.
  const hidden = []
  for (const nm of ['Truck_Cab', 'Windshield']) {
    const o = nodes[nm] || scene.getObjectByName(nm)
    if (o && o.visible) {
      o.visible = false
      hidden.push(o)
    }
  }

  const bodyMat = mat('#1d2954', 0.4, 0.6) // matches the truck 'bodycolour'
  const glassMat = new THREE.MeshStandardMaterial({
    color: '#ffffff', transparent: true, opacity: 0.25,
    roughness: 0.1, metalness: 0, side: THREE.DoubleSide, depthWrite: false,
  })

  const HX = 1.15 // half-width
  const ZF = 6.4 // front (windshield end)
  const ZB = 4.71 // back (toward the trailer)
  const YB = 0.842 // cab bottom / floor
  const YT = 3.242 // roof top
  const YS = 1.62 // window sill (top of the solid lower body)
  const WB = 1.855 // windshield glass bottom
  const cZ = (ZF + ZB) / 2
  const depth = ZF - ZB
  const P = 0.14 // pillar / frame thickness

  const g = new THREE.Group()
  g.name = 'Cab_Shell'
  const add = (w, h, d, x, y, z) => addBox(g, w, h, d, x, y, z, bodyMat, true, true)

  // Roof slab + thin floor pan.
  add(HX * 2, 0.2, depth, 0, YT - 0.1, cZ)
  add(HX * 2, 0.1, depth, 0, YB + 0.05, cZ)

  // Solid lower body: front cowl (under windshield) + full-height rear wall.
  add(HX * 2, WB - YB, P, 0, (WB + YB) / 2, ZF - P / 2)
  add(HX * 2, YT - YB, P, 0, (YT + YB) / 2, ZB + P / 2)

  // Side sills + corner pillars (A-pillars front, B-pillars rear) framing the
  // open side windows and supporting the roof.
  for (const s of [1, -1]) {
    add(P, YS - YB, depth, s * (HX - P / 2), (YS + YB) / 2, cZ)
    add(P, YT - YS, P, s * (HX - P / 2), (YT + YS) / 2, ZF - P / 2) // A-pillar
    add(P, YT - YS, P, s * (HX - P / 2), (YT + YS) / 2, ZB + P / 2) // B-pillar
  }

  // Windshield top header tying the two A-pillars together over the glass.
  add(HX * 2 - 2 * P, P, P, 0, YT - 0.12, ZF - P / 2)

  // Separate thin, fully-vertical, semi-transparent glass windshield. Sized to
  // the front frame opening (x ±1.01 inner pillars, y WB..header-bottom) and
  // seated in the frame plane (z = ZF - P/2) so it sits flush edge-to-edge with
  // no slant or gaps.
  const winTop = YT - 0.12 - P / 2 // underside of the windshield header
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(HX * 2 - 2 * P + 0.04, winTop - WB, 0.03),
    glassMat,
  )
  glass.position.set(0, (WB + winTop) / 2, ZF - P / 2)
  glass.renderOrder = 2
  glass.castShadow = false
  glass.receiveShadow = false
  g.add(glass)

  root.add(g)
  return { group: g, hidden }
}

// ---------------------------------------------------------------------------
// Driver cab interior — dashboard, steering wheel + stalks, centre radio,
// twin seats. Parented to Truck_Chassis (world-space). No human/character meshes.
// Cabin volume roughly: x ±0.85, y 0.95..2.0, z 4.75 (back) .. 5.9 (windshield).
// ---------------------------------------------------------------------------
function buildCabInterior(nodes, scene) {
  const root = nodes.Truck_Chassis || scene.getObjectByName('Truck_Chassis')
  if (!root) return null

  const dashMat = mat('#23262e', 0.6, 0.2)
  const seatMat = mat('#26324f', 0.9, 0.0)
  const seatTrim = mat('#161d2e', 0.85, 0.0)
  const wheelMat = mat('#15171c', 0.5, 0.3)
  const metalTrim = mat('#aab2c0', 0.4, 0.7)
  const consoleMat = mat('#1b1e25', 0.6, 0.15)
  const screenMat = new THREE.MeshStandardMaterial({
    color: '#0a1a3a', emissive: '#1c64ff', emissiveIntensity: 0.6, roughness: 0.3,
  })
  // Contrasting radio button/dial accents.
  const btnRed = mat('#d9402b', 0.5, 0.1)
  const btnAmber = mat('#e8a02d', 0.5, 0.1)
  const btnGreen = mat('#2ec27e', 0.5, 0.1)

  const FY = 0.942 // cab floor-pan top — seats/console rest on this
  const DX = 0.5 // driver/passenger lateral offset

  const g = new THREE.Group()
  g.name = 'Cab_Interior'

  // --- Truck seats (driver +x, passenger -x) -------------------------------
  // Solid low-poly seats: a pedestal planted on the cab floor, a thick squab
  // with side bolsters, an upright bolstered backrest and a headrest.
  const addSeat = (sx) => {
    addBox(g, 0.34, 0.2, 0.34, sx, FY + 0.1, 5.05, seatTrim) // pedestal on the floor
    addBox(g, 0.52, 0.18, 0.52, sx, FY + 0.29, 5.05, seatMat) // seat squab
    for (const b of [1, -1]) {
      addBox(g, 0.09, 0.22, 0.52, sx + b * 0.255, FY + 0.32, 5.05, seatMat) // squab bolsters
    }
    const back = addBox(g, 0.5, 0.74, 0.18, sx, FY + 0.76, 4.84, seatMat) // backrest
    back.rotation.x = -0.1 // slight recline
    for (const b of [1, -1]) {
      const bol = addBox(g, 0.09, 0.74, 0.2, sx + b * 0.245, FY + 0.76, 4.85, seatMat) // back bolsters
      bol.rotation.x = -0.1
    }
    addBox(g, 0.26, 0.18, 0.18, sx, FY + 1.2, 4.82, seatTrim) // headrest
  }
  addSeat(DX)
  addSeat(-DX)

  // Low centre console box between the two seats.
  addBox(g, 0.36, 0.34, 0.7, 0, FY + 0.17, 5.25, consoleMat)

  // --- Dashboard ------------------------------------------------------------
  // Blocky low-poly dash butting against the front cowl (front face ≈ z 6.255,
  // the cowl inner face) so it reads as one structure under the windshield.
  // Back face (toward the driver) ≈ z 5.805.
  addBox(g, 2.0, 0.55, 0.45, 0, 1.45, 6.03, dashMat) // main dash block
  addBox(g, 2.0, 0.07, 0.5, 0, 1.74, 5.92, dashMat) // hooded top lip

  // Instrument cluster recessed in the dash face ahead of the driver.
  addBox(g, 0.5, 0.22, 0.06, DX, 1.55, 5.81, metalTrim, false, false) // bezel
  for (const gx of [DX - 0.12, DX + 0.12]) {
    const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.025, 18), screenMat)
    gauge.rotation.x = Math.PI / 2 // face the driver
    gauge.position.set(gx, 1.55, 5.78)
    g.add(gauge)
  }

  // --- Steering column @ ~45° + ring wheel ---------------------------------
  // Column roots into the dash and rises back toward the driver at 45°.
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.5, 12), dashMat)
  column.position.set(DX, 1.5, 5.74)
  column.rotation.x = -D2R(45)
  g.add(column)

  // Ring-shaped steering wheel, tilted to the same 45° driving angle.
  const wheel = new THREE.Group()
  wheel.add(new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 12, 28), wheelMat))
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 14), wheelMat)
  hub.rotation.x = Math.PI / 2
  wheel.add(hub)
  for (const a of [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.17, 0.026), wheelMat)
    spoke.position.set(Math.cos(a) * 0.1, Math.sin(a) * 0.1, 0)
    spoke.rotation.z = a - Math.PI / 2
    wheel.add(spoke)
  }
  wheel.position.set(DX, 1.66, 5.58)
  wheel.rotation.x = D2R(45)
  g.add(wheel)

  // Horizontal indicator/wiper stalks off the sides of the column.
  for (const sgn of [1, -1]) {
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.2, 8), metalTrim)
    stalk.rotation.z = Math.PI / 2 // horizontal, along X
    stalk.position.set(DX + sgn * 0.12, 1.6, 5.66)
    g.add(stalk)
  }

  // --- Centre-stack radio embedded in the dash centre console --------------
  addBox(g, 0.42, 0.3, 0.1, 0, 1.4, 5.84, consoleMat) // head-unit housing
  addBox(g, 0.34, 0.09, 0.02, 0, 1.5, 5.79, screenMat, false, false) // display
  const btnCols = [btnRed, btnAmber, btnGreen, btnAmber, btnRed]
  for (let i = 0; i < 5; i++) {
    addBox(g, 0.032, 0.032, 0.02, -0.1 + i * 0.05, 1.4, 5.79, btnCols[i], false, false) // buttons
  }
  for (const dx of [-0.15, 0.15]) {
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 14), metalTrim)
    dial.rotation.x = Math.PI / 2
    dial.position.set(dx, 1.43, 5.79)
    g.add(dial)
  }

  root.add(g)
  return g
}

// ---------------------------------------------------------------------------
// Exhaust smoke — a WORLD-SPACE spawn/lifetime particle system (NOT parented to
// the truck), so puffs are emitted at the moving exhaust position and then left
// behind to trail as the truck drives away. 40-sphere pool, recycled.
// ---------------------------------------------------------------------------
const WHEEL_NODES = ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR', 'Wheel_Drive_L', 'Wheel_Drive_R']
const WHEEL_RADIUS = 0.51 // from the wheel bbox (Ø ≈ 1.02)
const SMOKE_LIFE = 2.0 // seconds per particle
const SMOKE_EMIT = new THREE.Vector3() // scratch for the per-frame emit point

function buildSmoke() {
  const group = new THREE.Group()
  group.name = 'Exhaust_Smoke'
  const geo = new THREE.SphereGeometry(0.2, 10, 8)
  const particles = []
  const N = 40
  for (let i = 0; i < N; i++) {
    const m = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        color: '#aaaaaa', roughness: 1, metalness: 0,
        transparent: true, opacity: 0, depthWrite: false,
      }),
    )
    m.visible = false
    m.castShadow = false
    m.receiveShadow = false
    group.add(m)
    particles.push({ mesh: m, mat: m.material, alive: false, age: 0, vx: 0, vy: 0, vz: 0 })
  }
  return { group, geo, particles, acc: 0 }
}

// Ages/moves live particles and spawns `rate` new ones per frame from `emit`
// (a WORLD position). Particles drift up (+Y) and backward (+Z) in world space.
function updateSmoke(sys, dt, emit, rate) {
  if (!sys) return
  for (const p of sys.particles) {
    if (!p.alive) continue
    p.age += dt
    if (p.age >= SMOKE_LIFE) {
      p.alive = false
      p.mesh.visible = false
      continue
    }
    const k = p.age / SMOKE_LIFE
    p.mesh.position.x += p.vx * dt
    p.mesh.position.y += p.vy * dt
    p.mesh.position.z += p.vz * dt
    p.mat.opacity = 0.6 * (1 - k) // 0.6 → 0
    p.mesh.scale.setScalar(1.0 + k * 1.6) // expands (~0.2 → ~0.52 world radius)
  }
  if (rate <= 0) return
  sys.acc += rate
  for (const p of sys.particles) {
    if (sys.acc < 1) break
    if (p.alive) continue
    sys.acc -= 1
    p.alive = true
    p.age = 0
    p.mesh.visible = true
    p.mesh.position.set(
      emit.x + (Math.random() * 2 - 1) * 0.1,
      emit.y + (Math.random() * 2 - 1) * 0.1,
      emit.z + (Math.random() * 2 - 1) * 0.1,
    )
    p.vx = (Math.random() * 2 - 1) * 0.15
    p.vy = 0.8 + Math.random() * 0.3 // up
    p.vz = 0.5 + Math.random() * 0.3 // backward (truck drives −Z)
    p.mesh.scale.setScalar(1.0)
    p.mat.opacity = 0.6
  }
  if (sys.acc > 4) sys.acc = 4 // clamp backlog when the pool is saturated
}

// Wraps each wheel in a pivot group placed at the wheel's geometric centre, then
// reparents the wheel under it (preserving its world transform). Spinning the
// PIVOT's local X then rotates the wheel about its own axle — NOT around the
// chassis origin (which is what made earlier builds orbit the wheels in big
// circles, since the wheel meshes' vertices are baked far from their node
// origin). Returns reverters for clean teardown.
function attachWheelPivots(nodes, scene) {
  const c = new THREE.Vector3()
  const reverters = []
  for (const name of WHEEL_NODES) {
    const w = nodes[name] || scene.getObjectByName(name)
    if (!w || !w.geometry || !w.parent) continue
    const parent = w.parent
    w.updateMatrix()
    w.geometry.computeBoundingBox()
    w.geometry.boundingBox.getCenter(c).applyMatrix4(w.matrix) // centre → parent space
    const pivot = new THREE.Group()
    pivot.name = `${name}_Pivot`
    pivot.position.copy(c)
    parent.add(pivot)
    pivot.attach(w) // keep world transform, reparent under the pivot
    reverters.push({ pivot, wheel: w, parent })
  }
  return reverters
}

// ---------------------------------------------------------------------------
/**
 * Loads the truck, injects the cargo stack + interiors once, and drives the
 * scroll-coupled animation each frame.
 *
 * `anim` (optional) is a STABLE mutable object that the ScrollScene timeline
 * mutates in place — passing it as a prop never re-renders React, we just read
 * its live fields in useFrame:
 *   { open: 0..1, headlight: 0..8, interior: 1..N, truckZ: 0..-N, exhaust: 0..1 }
 * `open` (boolean) is kept as a standalone fallback when no `anim` is supplied.
 *
 * The truck is rotated 180° about Y at build time so its front (headlights) faces
 * world −Z, matching the ScrollScene camera spec.
 */
export default function TruckViewer({ anim, open = false, ...props }) {
  const { scene, nodes, materials } = useGLTF('/models/truck.glb', DRACO_DECODER_PATH)
  const rootScene = useThree((s) => s.scene) // world-space parent for the smoke
  const openRef = useRef(0)
  const interiorLightRef = useRef(null) // { light, base }
  const headlightRef = useRef(null) // { mat, glows: [PointLight] }
  const smokeRef = useRef(null) // world-space particle system
  const exhaustLocalRef = useRef(new THREE.Vector3(-1.06, 3.34, 4.6)) // emit point (scene-local)
  const wheelsRef = useRef([]) // wheel pivots for rolling
  const prevZRef = useRef(0) // last truck z, to derive wheel spin
  const fadeMatsRef = useRef([]) // { mat, baseOpacity, wasTransparent } for the truck fade
  const prevFadeRef = useRef(1) // last applied truckOpacity

  // Build + attach the cargo stack, its light, and the cab/trailer interiors once.
  useEffect(() => {
    if (!nodes) return
    // Face the truck front (headlights) toward world −Z so the ScrollScene
    // camera coordinates (front approach at −Z, rear at +Z) line up.
    scene.rotation.y = Math.PI
    const created = []
    const cargo = buildCargoStack(nodes, scene)
    if (cargo) {
      created.push(cargo.group, cargo.light)
      interiorLightRef.current = { light: cargo.light, base: cargo.light.intensity }
    }
    const trailer = buildTrailerInterior(nodes, scene)
    if (trailer) created.push(trailer)
    const cabShell = buildCabShell(nodes, scene)
    if (cabShell) created.push(cabShell.group)
    const cab = buildCabInterior(nodes, scene)
    if (cab) created.push(cab)

    // Headlights: ramp the emissive lens material + two forward glow lamps that
    // light up at scroll ~40% (driven from anim.headlight).
    const hlMat = materials?.headlight_emit
    if (hlMat) {
      hlMat.emissive = hlMat.emissive ?? new THREE.Color('#fff2d9')
      hlMat.emissiveIntensity = 1
      const hlRoot = nodes.Truck_Chassis || scene.getObjectByName('Truck_Chassis')
      const glows = []
      for (const sx of [0.715, -0.715]) {
        const pl = new THREE.PointLight('#fff8e0', 0, 20, 2) // distance 20
        pl.position.set(sx, 1.17, 6.55) // just ahead of the lamp lenses (local +Z)
        pl.castShadow = false
        ;(hlRoot || scene).add(pl)
        created.push(pl)
        glows.push(pl)
      }
      headlightRef.current = { mat: hlMat, glows }
    }

    // Wheel pivots (spin in place).
    const wheelPivots = attachWheelPivots(nodes, scene)
    wheelsRef.current = wheelPivots
    prevZRef.current = scene.position.z

    // Exhaust emit point (top of the Exhaust_Stack, in scene-local coords).
    const exNode = nodes.Exhaust_Stack || scene.getObjectByName('Exhaust_Stack')
    if (exNode?.geometry) {
      exNode.updateMatrix()
      exNode.geometry.computeBoundingBox()
      const bb = exNode.geometry.boundingBox
      exhaustLocalRef.current
        .set((bb.min.x + bb.max.x) / 2, bb.max.y - 0.1, (bb.min.z + bb.max.z) / 2)
        .applyMatrix4(exNode.matrix)
    }

    // World-space smoke: parented to the R3F root (NOT the truck), so puffs stay
    // put in world space and trail behind as the truck drives off.
    const smoke = buildSmoke()
    rootScene.add(smoke.group)
    smokeRef.current = smoke

    // Collect every truck material once for the stage-6 fade-out (records each
    // material's base opacity / transparent flag so we can restore it).
    const matSet = new Set()
    scene.traverse((o) => {
      if (!o.material) return
      const list = Array.isArray(o.material) ? o.material : [o.material]
      for (const m of list) matSet.add(m)
    })
    fadeMatsRef.current = [...matSet].map((m) => ({
      mat: m,
      baseOpacity: m.opacity,
      wasTransparent: m.transparent,
    }))
    prevFadeRef.current = 1

    return () => {
      for (const obj of created) {
        obj.parent?.remove(obj)
        obj.traverse?.((o) => {
          o.geometry?.dispose?.()
          o.material?.dispose?.()
        })
        obj.dispose?.()
      }
      // Restore the original cab meshes we hid for the cutout cage.
      for (const o of cabShell?.hidden ?? []) o.visible = true
      // Revert wheel pivots: reparent each wheel back, then drop the pivot.
      for (const { pivot, wheel, parent } of wheelPivots) {
        parent.attach(wheel)
        pivot.parent?.remove(pivot)
      }
      scene.position.set(0, 0, 0) // reset the (cached) scene transform
      scene.rotation.set(0, 0, 0)
      // Tear down the world-space smoke.
      if (smoke.group.parent) smoke.group.parent.remove(smoke.group)
      smoke.geo.dispose()
      for (const p of smoke.particles) p.mat.dispose()
      // Restore truck materials + visibility (undo any fade).
      for (const f of fadeMatsRef.current) {
        f.mat.opacity = f.baseOpacity
        f.mat.transparent = f.wasTransparent
      }
      scene.visible = true
      fadeMatsRef.current = []
      interiorLightRef.current = null
      headlightRef.current = null
      smokeRef.current = null
      wheelsRef.current = []
    }
  }, [nodes, scene, materials, rootScene])

  // Drive the per-frame animation: door swing, headlight glow, interior pulse.
  useFrame((state, dt) => {
    // Doors — damp toward the scroll-driven (or fallback boolean) target.
    const target = anim ? anim.open : open ? 1 : 0
    openRef.current = THREE.MathUtils.damp(openRef.current, target, 5, dt)
    const a = openRef.current
    for (const [name, deg] of Object.entries(DOOR_DEG)) {
      const node = nodes?.[name]
      if (node) node.rotation.y = D2R(deg) * a
    }

    if (!anim) return

    // Headlights: lens emissive ramps 0→8; the two glow PointLights ramp 0→6 at
    // a fixed 20-unit reach, washing bright light toward the front-approach POV.
    const hl = headlightRef.current
    if (hl) {
      hl.mat.emissiveIntensity = anim.headlight
      const intensity = (anim.headlight / 8) * 6 // headlight 0..8 → 0..6
      for (const pl of hl.glows) pl.intensity = intensity
    }

    // Interior light pulses brighter as the trailer doors open.
    const il = interiorLightRef.current
    if (il) il.light.intensity = il.base * anim.interior

    // Engine bob: time-based idle/gear-engagement oscillation, amplitude scaled
    // by the scroll-driven anim.bobAmp (0 outside the departure → no bob).
    const bob = Math.sin(state.clock.elapsedTime * 4) * (anim.bobAmp ?? 0)
    scene.position.y = bob
    anim.truckY = bob // so the camera lookAt can track it

    // Truck departure: move the whole scene along world Z. Roll each wheel about
    // its own axle by the travelled delta (Δz / radius) — pivot.rotation.x only,
    // never around the chassis origin. Delta-based ⇒ spin is naturally synced to
    // velocity and ramps in/out smoothly with the eased truckZ.
    const tz = anim.truckZ ?? 0
    scene.position.z = tz
    const dz = tz - prevZRef.current
    prevZRef.current = tz
    if (dz !== 0) {
      const spin = dz / WHEEL_RADIUS
      for (const { pivot } of wheelsRef.current) pivot.rotation.x += spin
    }

    // World-space exhaust smoke. Emit point = the moving Exhaust_Stack top,
    // transformed by the truck's current pose (scene is rotated 180° about Y,
    // then translated by its position), computed directly to stay world-correct.
    const exL = exhaustLocalRef.current
    SMOKE_EMIT.set(-exL.x, exL.y + scene.position.y, -exL.z + scene.position.z)
    updateSmoke(smokeRef.current, dt, SMOKE_EMIT, anim.smokeRate ?? 0)

    // Stage 6: fade the whole truck out as the camera lifts away. Only touches
    // materials when the value actually changes (no effect during stages 1–5).
    const fade = anim.truckOpacity ?? 1
    if (fade !== prevFadeRef.current) {
      prevFadeRef.current = fade
      const fading = fade < 0.999
      for (const f of fadeMatsRef.current) {
        f.mat.transparent = fading || f.wasTransparent
        f.mat.opacity = f.baseOpacity * fade
      }
      scene.visible = fade > 0.002
    }
  })

  return <primitive object={scene} {...props} />
}

// Warm the cache / decoder so it's ready before first paint.
useGLTF.preload('/models/truck.glb', DRACO_DECODER_PATH)
