'use client'

import { useEffect, useRef } from 'react'
import styles from './ParticleField.module.css'

const PARTICLE_COUNT = 700
const BASE_SPEED = 0.1
const MAX_SPEED = 1.2
const PARTICLE_SIZE = 1.4
const SCROLL_DECAY = 0.9              // restored — 0.1 made scroll-driven drift twitchy/clanky
const VISIBILITY_DECAY = 0.85
const BASELINE_FRACTION = 0.3
const MAX_PULL = 0.9
const HOVER_RADIUS = 140
const HOVER_STRENGTH = 26
const MOUSE_LERP = 0.15
const SHAPE_POINT_COUNT = 480
const SHAPE_OUTLINE_RATIO = 0.9
const SHAPE_JITTER = 0
const SHAPE_FILL_RATIO = 0.85
const SHAPE_PULL_MULTIPLIER = 6
const SHAPE_MAX_PULL = 0.97
const SHAPE_PARTICLE_SIZE = 1.8

// ── Liftoff / disperse tuning ────────────────────────────────
const LAUNCH_RANGE_VH = 1.0      // rocket section is 600vh tall — spread the liftoff across most of it
const LAUNCH_RISE = 1000         // px the shape's target position rises during full liftoff
const LAUNCH_SCATTER = 400       // (currently unused — reuse if you want particle-level scatter again)
const LAUNCH_SCATTER_DROP = 40   // (currently unused)

// ── Camera shake (ignition rumble) ───────────────────────────
const CAMERA_SHAKE_MAX = 5              // px, peak shake at ignition
const CAMERA_SHAKE_VERTICAL_FACTOR = 0.5 // vertical shake is subtler than horizontal

// ── Ignition smoke burst (one-shot, at the moment liftoff begins) ──
const IGNITION_SMOKE_COUNT = 55
const IGNITION_SMOKE_LIFE = 150

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

// The purpose of this function is to return a color based on a position on the rocketship.
// The color is determined by the coordinates of the point within the rocket's local (0-1) space.
function colorFn(x, y) {
  const wdx = x - 0.5
  const wdy = y - 0.14
  if (wdx * wdx + wdy * wdy < 0.0018) return "150, 215, 255" // cockpit window
  if (y > 0.86) return "255, 176, 84"                        // engine base / nozzle glow
  if (y > 0.58 && (x < 0.40 || x > 0.60)) return "214, 64, 64" // fin accent
  return "255, 255, 255"                                     // hull
}

// ── Shape system ──────────────────────────────────────────────
function isPointInPolygon(x, y, vertices) {
  let inside = false
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x, yi = vertices[i].y
    const xj = vertices[j].x, yj = vertices[j].y
    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

function generateFilledShapePoints(vertices, count) {
  const points = []
  let attempts = 0
  const maxAttempts = count * 300

  while (points.length < count && attempts < maxAttempts) {
    attempts++
    const x = Math.random()
    const y = Math.random()
    if (isPointInPolygon(x, y, vertices)) {
      points.push({ x, y })
    }
  }
  return points
}

function generateOutlinePoints(vertices, count) {
  const segments = []
  let total = 0
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i]
    const b = vertices[(i + 1) % vertices.length]
    const len = Math.hypot(b.x - a.x, b.y - a.y)
    segments.push({ a, b, len })
    total += len
  }

  const points = []
  const step = total / count
  let segIndex = 0
  let distanceCovered = 0

  for (let i = 0; i < count; i++) {
    const targetDist = i * step
    while (
      segIndex < segments.length - 1 &&
      distanceCovered + segments[segIndex].len < targetDist
    ) {
      distanceCovered += segments[segIndex].len
      segIndex++
    }
    const seg = segments[segIndex]
    const t = seg.len === 0 ? 0 : (targetDist - distanceCovered) / seg.len
    points.push({
      x: seg.a.x + (seg.b.x - seg.a.x) * t,
      y: seg.a.y + (seg.b.y - seg.a.y) * t,
    })
  }
  return points
}

function generateShapePoints(vertices, totalCount) {
  const outlineCount = Math.round(totalCount * SHAPE_OUTLINE_RATIO)
  const fillCount = totalCount - outlineCount
  const outlinePoints = generateOutlinePoints(vertices, outlineCount)
  const fillPoints = generateFilledShapePoints(vertices, fillCount)
  const allPoints = [...outlinePoints, ...fillPoints]

  return allPoints.map(p => ({
    ...p,
    color: colorFn(p.x, p.y),
  }))
}

// ── Rocket silhouette ────────────────────────────────────────
// Defined as a right-side profile from nose tip to engine-base centerline,
// then mirrored to build the full symmetric polygon. Easier to tune than
// hand-listing all 18 points, and guarantees the two sides actually match.
const ROCKET_RIGHT_PROFILE = [
  { x: 0.500, y: 0.030 }, // nose tip (centerline)
  { x: 0.560, y: 0.080 }, // nose curve
  { x: 0.595, y: 0.150 }, // nose shoulder
  { x: 0.612, y: 0.230 }, // where nose meets body
  { x: 0.612, y: 0.620 }, // body, straight down to fin root
  { x: 0.800, y: 0.800 }, // fin outer tip, swept back
  { x: 0.780, y: 0.900 }, // fin bottom outer corner
  { x: 0.612, y: 0.840 }, // fin trailing edge, back to body
  { x: 0.580, y: 0.900 }, // taper into engine shoulder
  { x: 0.500, y: 0.925 }, // engine base (centerline)
]

function mirrorRocketVertices(rightProfile) {
  const mirroredLeft = rightProfile
    .slice(1, -1)          // drop the two centerline points to avoid duplicates
    .reverse()
    .map(p => ({ x: 1 - p.x, y: p.y }))
  return [...rightProfile, ...mirroredLeft]
}

const ROCKET_VERTICES = mirrorRocketVertices(ROCKET_RIGHT_PROFILE)

const SHAPES = {
  rocket: generateShapePoints(ROCKET_VERTICES, SHAPE_POINT_COUNT),
}

function getActiveSection(sections, viewportHeight) {
  if (!sections.length) return null

  return sections.reduce(
    (closest, section) => {
      const rect = section.getBoundingClientRect()
      const sectionCenter = rect.top + rect.height / 2
      const distance = Math.abs(sectionCenter - viewportHeight / 2)

      if (distance < closest.distance) {
        return { distance, section }
      }

      return closest
    },
    { distance: Number.POSITIVE_INFINITY, section: null }
  ).section
}

export default function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    let rafId
    let lastScrollY = window.scrollY
    let scrollY = window.scrollY
    let scrollVel = 0
    let rawVel = 0
    let pageHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
    let sections = Array.from(document.querySelectorAll('[data-particle-focus]'))
    let rocketSection = document.querySelector('[data-particle-focus="rocket"]')
    let smoothedVisibility = 0
    let smoothedBandLeft = 0
    let smoothedBandWidth = 0
    let smoothedRectTop = 0
    let smoothedRectHeight = 0
    let focusInitialized = false

    let targetMouseX = -9999
    let targetMouseY = -9999
    let mouseX = -9999
    let mouseY = -9999
    let mouseActive = false

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      pageHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      sections = Array.from(document.querySelectorAll('[data-particle-focus]'))
      rocketSection = document.querySelector('[data-particle-focus="rocket"]')
    }
    resize()
    window.addEventListener('resize', resize)

    const onScroll = () => {
      rawVel = window.scrollY - lastScrollY
      lastScrollY = window.scrollY
      scrollY = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const onMouseMove = (e) => {
      targetMouseX = e.clientX
      targetMouseY = e.clientY
      mouseActive = true
    }
    const onMouseLeave = () => {
      mouseActive = false
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave, { passive: true })

    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2
      const isBaseline = Math.random() < BASELINE_FRACTION

      return {
        baseX: isBaseline
          ? Math.random() * W
          : W * 0.75 + Math.random() * W * 0.35,
        baseY: Math.random() * H,
        angle,
        phase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.0009 + 0.0001,
        alignStrength: Math.random() * 0.35 + 0.65,
        isBaseline,
      }
    })

    let exhaustParticles = []
    const EXHAUST_SPAWN_RATE = 50
    const EXHAUST_LIFE = 32
    const EXHAUST_SPEED = 10
    const EXHAUST_SPREAD = 25
    const EXHAUST_COOL_POINT = 0.45 // fraction of life where flame starts turning to smoke

    let ignitionSmoke = []
    let ignitionTriggered = false

    let explosionParticles = []
    let launchCompleteAtY = null
    const EXPLOSION_RANGE_VH = 1.25
    const EXPLOSION_SPAWN_RATE = 3
    const EXPLOSION_LIFE = 100
    const EXPLOSION_SPEED_MIN = 1.5
    const EXPLOSION_SPEED_MAX = 5
    const EXPLOSION_GRAVITY = 0.04

    const gridCols = Math.ceil(Math.sqrt(PARTICLE_COUNT))

    let frame = 0

    const draw = () => {
      frame++
      scrollVel = scrollVel * SCROLL_DECAY + rawVel * (1 - SCROLL_DECAY)
      rawVel = 0

      mouseX += (targetMouseX - mouseX) * MOUSE_LERP
      mouseY += (targetMouseY - mouseY) * MOUSE_LERP

      const progress = clamp(scrollY / pageHeight, 0, 1)
      const speed = BASE_SPEED + Math.min(Math.abs(scrollVel) * 0.6, MAX_SPEED - BASE_SPEED)

      // ── Resolve which section/focus is active FIRST ──────────────
      // (this must happen before activeShapePoints/isShapeMode are
      // computed — that ordering bug was the root cause of the rocket
      // never actually launching/exploding correctly)
      const activeSection = getActiveSection(sections, H)
      const rocketRect = rocketSection ? rocketSection.getBoundingClientRect() : null
      const rocketOnScreen = rocketRect && rocketRect.bottom > 0 && rocketRect.top < H

      let rect = null
      let rawVisibility = 0
      let activeFocusValue = 'center'

      if (rocketOnScreen) {
        rect = rocketRect
        activeFocusValue = 'rocket'
        const visibleHeight = Math.min(rocketRect.bottom, H) - Math.max(rocketRect.top, 0)
        rawVisibility = clamp(visibleHeight / Math.min(rocketRect.height, H), 0, 1)
      } else if (activeSection) {
        rect = activeSection.getBoundingClientRect()
        const visibleHeight = Math.min(rect.bottom, H) - Math.max(rect.top, 0)
        rawVisibility = clamp(visibleHeight / Math.min(rect.height, H), 0, 1)
        activeFocusValue = activeSection.dataset.particleFocus || 'center'
      }

      // Now safe to resolve — activeFocusValue is final for this frame.
      const activeShapePoints = SHAPES[activeFocusValue] || null
      const isShapeMode = Boolean(activeShapePoints)
      let fillTargetsReady = false

      // Liftoff progress: 0 near the top of the rocket section, ramps
      // to 1 as the user scrolls LAUNCH_RANGE_VH viewport-heights down
      // into it. Recalculated fresh every frame from scroll position
      // alone — scrolling back up smoothly re-assembles the shape.
      let launchProgress = 0
      if (rocketRect) {
        const scrolledPastTop = -rocketRect.top
        const launchRange = H * LAUNCH_RANGE_VH
        launchProgress = clamp(scrolledPastTop / launchRange, 0, 1)
      }

      if (isShapeMode && launchProgress >= 1 && launchCompleteAtY === null) {
        launchCompleteAtY = scrollY
      } else if (launchCompleteAtY !== null && scrollY < launchCompleteAtY - H * 0.5) {
        launchCompleteAtY = null
      }

      const explosionRange = H * EXPLOSION_RANGE_VH
      const explosionActive =
        launchCompleteAtY !== null && (scrollY - launchCompleteAtY) < explosionRange

      // Reset the one-shot ignition burst once the rocket has fully
      // reassembled at the pad (scrolled back above liftoff range).
      if (launchProgress <= 0) {
        ignitionTriggered = false
      }

      // Camera rumble: sharp right at ignition, tapering off as the
      // rocket clears the pad and settles into a smooth ascent.
      const shakeMag = (isShapeMode && launchProgress > 0 && launchProgress < 1)
        ? CAMERA_SHAKE_MAX * Math.max(0.22, 1 - launchProgress * 1.6)
        : 0
      const shakeX = shakeMag ? (Math.random() - 0.5) * 2 * shakeMag : 0
      const shakeY = shakeMag ? (Math.random() - 0.5) * 2 * shakeMag * CAMERA_SHAKE_VERTICAL_FACTOR : 0

      if (rect) {
        let boxLeft, boxWidth, boxTop, boxHeight

        if (isShapeMode) {
          boxHeight = Math.min(H, rect.width) * SHAPE_FILL_RATIO
          boxWidth = boxHeight * 0.7
          boxLeft = rect.left + (rect.width - boxWidth) / 2
          boxTop = (H - boxHeight) / 2
        } else {
          boxWidth = rect.width * 0.55
          boxLeft = rect.left + (rect.width - boxWidth) / 2
          if (activeFocusValue === 'left') {
            boxLeft = rect.left
          } else if (activeFocusValue === 'right') {
            boxLeft = rect.left + rect.width - boxWidth
          }
          boxTop = rect.top
          boxHeight = rect.height
        }

        if (!focusInitialized) {
          smoothedBandLeft = boxLeft
          smoothedBandWidth = boxWidth
          smoothedRectTop = boxTop
          smoothedRectHeight = boxHeight
          focusInitialized = true
        } else {
          const FOCUS_LERP = 0.045
          smoothedBandLeft += (boxLeft - smoothedBandLeft) * FOCUS_LERP
          smoothedBandWidth += (boxWidth - smoothedBandWidth) * FOCUS_LERP
          smoothedRectTop += (boxTop - smoothedRectTop) * FOCUS_LERP
          smoothedRectHeight += (boxHeight - smoothedRectHeight) * FOCUS_LERP
        }

        fillTargetsReady = true
      }

      smoothedVisibility =
        smoothedVisibility * VISIBILITY_DECAY + rawVisibility * (1 - VISIBILITY_DECAY)

      // Background is painted at true (unshaken) coordinates so the
      // rumble never reveals gaps at the canvas edges.
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#02030a'
      ctx.fillRect(0, 0, W, H)

      ctx.save()
      ctx.translate(shakeX, shakeY)

      particles.forEach((p, i) => {
        const pulse = 0.45 + Math.sin(frame * p.drift * 40 + p.phase) * 0.18
        let opacity = clamp(pulse + progress * 0.28, 0.15, 1)
        let colorRGB = '255, 255, 255'

        p.angle += Math.sin(frame * p.drift + p.phase) * 0.01
        const vx = Math.cos(p.angle)
        const vy = Math.sin(p.angle)
        p.baseX += vx * speed * 0.14
        p.baseY += vy * speed * 0.14

        if (p.baseX < -20) p.baseX = W + 20
        if (p.baseX > W + 20) p.baseX = -20
        if (p.baseY < -20) p.baseY = H + 20
        if (p.baseY > H + 20) p.baseY = -20

        const jitterX = Math.sin(frame * 0.0015 + p.phase) * 10 * p.drift
        const jitterY = Math.cos(frame * 0.0012 + p.phase) * 8 * p.drift

        let rocketX = p.baseX + jitterX
        let rocketY = p.baseY + jitterY

        if (fillTargetsReady && smoothedVisibility > 0.001 && !p.isBaseline) {
          let fillX, fillY

          if (isShapeMode) {
            const shapePoint = activeShapePoints[i % activeShapePoints.length]
            fillX = smoothedBandLeft + shapePoint.x * smoothedBandWidth +
              Math.sin(p.phase) * SHAPE_JITTER
            fillY = smoothedRectTop + shapePoint.y * smoothedRectHeight +
              Math.cos(p.phase) * SHAPE_JITTER

            fillY -= launchProgress * LAUNCH_RISE

            const pull = clamp(smoothedVisibility * SHAPE_PULL_MULTIPLIER, 0, SHAPE_MAX_PULL)
            const colorBlend = clamp(pull / SHAPE_MAX_PULL, 0, 1)

            const [zr, zg, zb] = shapePoint.color.split(',').map(Number)
            const r = Math.round(255 + (zr - 255) * colorBlend)
            const g = Math.round(255 + (zg - 255) * colorBlend)
            const b = Math.round(255 + (zb - 255) * colorBlend)
            colorRGB = `${r}, ${g}, ${b}`

            rocketX = p.baseX + (fillX - p.baseX) * pull + jitterX
            rocketY = p.baseY + (fillY - p.baseY) * pull + jitterY
          } else {
            const col = i % gridCols
            const row = Math.floor(i / gridCols)
            fillX = smoothedBandLeft + (col / gridCols) * smoothedBandWidth + Math.sin(p.phase) * 20
            fillY = smoothedRectTop + (row / gridCols) * smoothedRectHeight + Math.cos(p.phase) * 20

            const pull = clamp(p.alignStrength * smoothedVisibility * 1.15, 0, MAX_PULL)
            rocketX = p.baseX + (fillX - p.baseX) * pull + jitterX
            rocketY = p.baseY + (fillY - p.baseY) * pull + jitterY
          }
        }

        if (mouseActive) {
          const dx = rocketX - mouseX
          const dy = rocketY - mouseY
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < HOVER_RADIUS && dist > 0.01) {
            const falloff = 1 - dist / HOVER_RADIUS
            const force = falloff * falloff * HOVER_STRENGTH
            rocketX += (dx / dist) * force
            rocketY += (dy / dist) * force
            opacity = clamp(opacity + falloff * 0.3, 0.15, 1)
          }
        }

        const renderSize = isShapeMode && fillTargetsReady && smoothedVisibility > 0.001 && !p.isBaseline
          ? SHAPE_PARTICLE_SIZE
          : PARTICLE_SIZE

        ctx.beginPath()
        ctx.arc(rocketX, rocketY, renderSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${colorRGB}, ${opacity})`
        ctx.fill()
      })

      // ── Exhaust trail — runs ONCE per frame, not per particle ──
      if (isShapeMode && launchProgress > 0 && fillTargetsReady) {
        const engineX = smoothedBandLeft + 0.50 * smoothedBandWidth
        const engineY = smoothedRectTop + 0.90 * smoothedRectHeight - launchProgress * LAUNCH_RISE

        // One-shot ignition puff, fired the instant liftoff starts.
        if (!ignitionTriggered) {
          ignitionTriggered = true
          for (let i = 0; i < IGNITION_SMOKE_COUNT; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = 0.4 + Math.random() * 1.6
            ignitionSmoke.push({
              x: engineX + (Math.random() - 0.5) * 50,
              y: engineY + (Math.random() - 0.5) * 10,
              vx: Math.cos(angle) * speed,
              vy: -Math.abs(Math.sin(angle)) * speed * 0.4 - 0.15,
              life: IGNITION_SMOKE_LIFE,
              maxLife: IGNITION_SMOKE_LIFE,
              size: 9 + Math.random() * 16,
            })
          }
        }

        // Plume widens the higher (further into liftoff) the rocket gets.
        const dynamicSpread = EXHAUST_SPREAD * (1 + launchProgress * 1.4)

        for (let s = 0; s < EXHAUST_SPAWN_RATE; s++) {
          exhaustParticles.push({
            x: engineX + (Math.random() - 0.5) * 14,
            y: engineY,
            vx: (Math.random() - 0.5) * dynamicSpread,
            vy: EXHAUST_SPEED + Math.random() * EXHAUST_SPEED,
            life: EXHAUST_LIFE,
            maxLife: EXHAUST_LIFE,
          })
        }
      }

      // Ignition smoke — soft, slow-drifting gray puffs from the launch pad.
      ignitionSmoke = ignitionSmoke.filter(sp => {
        sp.x += sp.vx
        sp.y += sp.vy
        sp.vy *= 0.985
        sp.vx *= 0.985
        sp.life--
        if (sp.life <= 0) return false
        const t = sp.life / sp.maxLife
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, sp.size * (1.6 - t * 0.6), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 200, 205, ${t * 0.35})`
        ctx.fill()
        return true
      })

      // Exhaust flame — white-hot core cooling through orange into smoke.
      exhaustParticles = exhaustParticles.filter(ep => {
        ep.x += ep.vx
        ep.y += ep.vy
        ep.life--
        if (ep.life <= 0) return false
        const t = ep.life / ep.maxLife

        let r, g, b, a
        if (t > 1 - EXHAUST_COOL_POINT) {
          // fresh: white-hot core fading to bright orange
          const localT = (t - (1 - EXHAUST_COOL_POINT)) / EXHAUST_COOL_POINT
          r = 255
          g = Math.round(140 + localT * 115)
          b = Math.round(40 + localT * 180)
          a = 0.9
        } else {
          // aging: orange flame cooling into gray smoke
          const localT = t / (1 - EXHAUST_COOL_POINT)
          r = Math.round(255 * localT + 100 * (1 - localT))
          g = Math.round(150 * localT + 100 * (1 - localT))
          b = Math.round(50 * localT + 105 * (1 - localT))
          a = 0.15 + localT * 0.55
        }

        const radius = PARTICLE_SIZE * (0.6 + (1 - t) * 1.6)
        ctx.beginPath()
        ctx.arc(ep.x, ep.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
        ctx.fill()
        return true
      })

      // ── Explosion sprinkle at top of screen once fully launched ──
      if (explosionActive) {
        for (let s = 0; s < EXPLOSION_SPAWN_RATE; s++) {
          const angle = Math.random() * Math.PI - Math.PI / 2
          const speed = EXPLOSION_SPEED_MIN + Math.random() * (EXPLOSION_SPEED_MAX - EXPLOSION_SPEED_MIN)
          explosionParticles.push({
            x: W * 0.5 + (Math.random() - 0.5) * W * 0.4,
            y: -10,
            vx: Math.cos(angle) * speed,
            vy: Math.abs(Math.sin(angle)) * speed * 0.5,
            life: EXPLOSION_LIFE,
            maxLife: EXPLOSION_LIFE,
          })
        }
      }

      explosionParticles = explosionParticles.filter(sp => {
        sp.vy += EXPLOSION_GRAVITY
        sp.x += sp.vx
        sp.y += sp.vy
        sp.life--
        if (sp.life <= 0 || sp.y > H + 20) return false
        const t = sp.life / sp.maxLife
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, PARTICLE_SIZE * (0.5 + t * 0.9), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, ${170 + Math.round(t * 60)}, ${60 + Math.round(t * 100)}, ${t})`
        ctx.fill()
        return true
      })

      ctx.restore()

      rafId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} />
}