'use client'

import { useEffect, useRef } from 'react'
import styles from './ParticleField.module.css'

const PARTICLE_COUNT = 600
const BASE_SPEED = 0.1
const MAX_SPEED = 1.2
const PARTICLE_SIZE = 1.4
const SCROLL_DECAY = 0.9
const VISIBILITY_DECAY = 0.85
const BASELINE_FRACTION = 0.3
const MAX_PULL = 0.9
const HOVER_RADIUS = 140
const HOVER_STRENGTH = 26
const MOUSE_LERP = 0.15
const SHAPE_POINT_COUNT = 340
const SHAPE_OUTLINE_RATIO = 0.65
const SHAPE_JITTER = 5
const SHAPE_FILL_RATIO = 0.85
const SHAPE_PULL_MULTIPLIER = 2.2
const SHAPE_MAX_PULL = 0.97
const SHAPE_PARTICLE_SIZE = 1.8

// ── Liftoff / disperse tuning ────────────────────────────────
const LAUNCH_RANGE_VH = 0.55     // fraction of viewport height the liftoff plays out over
const LAUNCH_RISE = 320          // px the shape's target position rises during full liftoff
const LAUNCH_PULL_LOOSEN = 0.75  // how much max pull drops at full launch (0-1, higher = more scatter)
const LAUNCH_SCATTER = 70        // px of extra random per-particle kick at full launch
const LAUNCH_SCATTER_DROP = 40   // px downward bias added to scatter, for a trailing-exhaust feel

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

// ── Shape system ──────────────────────────────────────────────
// Shapes are defined as polygons in normalized 0-1 space. Points are
// generated two ways and combined: outline points (walked evenly along
// the perimeter, so thin parts like a nose tip get coverage) plus
// interior fill points (random rejection sampling, for volume). Each
// point is also tagged with a color via a per-shape colorFn, based on
// its position — e.g. a rocket's nose, hull, windows, fins, and engine
// each get a distinct tint.

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

function defaultColorFn() {
  return '255, 255, 255'
}

function generateShapePoints(vertices, totalCount, colorFn = defaultColorFn, outlineRatio = SHAPE_OUTLINE_RATIO) {
  const outlineCount = Math.round(totalCount * outlineRatio)
  const fillCount = totalCount - outlineCount
  const outlinePoints = generateOutlinePoints(vertices, outlineCount)
  const fillPoints = generateFilledShapePoints(vertices, fillCount)
  const allPoints = [...outlinePoints, ...fillPoints]

  return allPoints.map(p => ({
    ...p,
    color: colorFn(p.x, p.y),
  }))
}

const ROCKET_VERTICES = [
  { x: 0.50, y: 0.02 }, // nose tip
  { x: 0.58, y: 0.10 },
  { x: 0.63, y: 0.22 },
  { x: 0.64, y: 0.36 },
  { x: 0.64, y: 0.58 },
  { x: 0.86, y: 0.90 }, // right fin tip
  { x: 0.86, y: 0.96 },
  { x: 0.64, y: 0.80 },
  { x: 0.58, y: 0.86 },
  { x: 0.50, y: 0.90 }, // engine base center
  { x: 0.42, y: 0.86 },
  { x: 0.36, y: 0.80 },
  { x: 0.14, y: 0.96 },
  { x: 0.14, y: 0.90 }, // left fin tip
  { x: 0.36, y: 0.58 },
  { x: 0.36, y: 0.36 },
  { x: 0.37, y: 0.22 },
  { x: 0.42, y: 0.10 },
]

function rocketColorFn(x, y) {
  const dxCenter = Math.abs(x - 0.5)

  if (y > 0.87) return '255, 176, 84'
  if (y > 0.60 && dxCenter > 0.22) return '255, 122, 98'
  if (y > 0.28 && y < 0.46 && dxCenter < 0.08) return '140, 224, 255'
  if (y < 0.14) return '255, 244, 224'
  return '206, 214, 255'
}

const SHAPES = {
  rocket: generateShapePoints(ROCKET_VERTICES, SHAPE_POINT_COUNT, rocketColorFn),
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

      const activeSection = getActiveSection(sections, H)
      let rect = null
      let rawVisibility = 0
      let activeFocusValue = 'center'

      if (activeSection) {
        rect = activeSection.getBoundingClientRect()
        const visibleHeight = Math.min(rect.bottom, H) - Math.max(rect.top, 0)
        rawVisibility = clamp(visibleHeight / Math.min(rect.height, H), 0, 1)
        activeFocusValue = activeSection.dataset.particleFocus || 'center'
      }

      const activeShapePoints = SHAPES[activeFocusValue] || null
      const isShapeMode = Boolean(activeShapePoints)
      let fillTargetsReady = false

      // Liftoff progress: 0 while the section is approaching/centered,
      // ramps to 1 as you keep scrolling and its center rises above the
      // viewport's center. Recalculated fresh every frame from scroll
      // position alone, so scrolling back up smoothly re-assembles the
      // shape — no separate animation state to track.
      let launchProgress = 0
      if (rect && isShapeMode) {
        const sectionCenterY = rect.top + rect.height / 2
        const viewportCenterY = H / 2
        const risenAboveCenter = viewportCenterY - sectionCenterY
        const launchRange = H * LAUNCH_RANGE_VH
        launchProgress = clamp(risenAboveCenter / launchRange, 0, 1)
      }

      if (rect) {
        let boxLeft, boxWidth, boxTop, boxHeight

        if (isShapeMode) {
          boxHeight = Math.min(rect.height, rect.width) * SHAPE_FILL_RATIO
          boxWidth = boxHeight * 0.7
          boxLeft = rect.left + (rect.width - boxWidth) / 2
          boxTop = rect.top + (rect.height - boxHeight) / 2
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

      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#02030a'
      ctx.fillRect(0, 0, W, H)

      particles.forEach((p, i) => {
        const pulse = 0.45 + Math.sin(frame * p.drift * 40 + p.phase) * 0.18
        let opacity = clamp(pulse + progress * 0.28, 0.15, 1)
        let colorRGB = '255, 255, 255' // default star color

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

        let x = p.baseX + jitterX
        let y = p.baseY + jitterY

        if (fillTargetsReady && smoothedVisibility > 0.001 && !p.isBaseline) {
          let fillX, fillY

          if (isShapeMode) {
            const shapePoint = activeShapePoints[i % activeShapePoints.length]
            fillX = smoothedBandLeft + shapePoint.x * smoothedBandWidth +
              Math.sin(p.phase) * SHAPE_JITTER
            fillY = smoothedRectTop + shapePoint.y * smoothedRectHeight +
              Math.cos(p.phase) * SHAPE_JITTER

            // Liftoff: the target position rises as launchProgress climbs,
            // so the whole shape appears to fly upward off-screen.
            fillY -= launchProgress * LAUNCH_RISE

            // As launchProgress increases, max pull loosens — particles
            // can no longer fully keep up with the rising target, so they
            // lag behind it. That lag alone reads as a dispersing trail.
            const loosenedMaxPull = SHAPE_MAX_PULL * (1 - launchProgress * LAUNCH_PULL_LOOSEN)
            const pull = clamp(smoothedVisibility * SHAPE_PULL_MULTIPLIER, 0, loosenedMaxPull)

            // Color blend also fades back toward white as particles
            // disperse from formation, so they read as "just stars" again.
            const colorBlend = clamp((pull / SHAPE_MAX_PULL) * (1 - launchProgress * 0.6), 0, 1)

            const [zr, zg, zb] = shapePoint.color.split(',').map(Number)
            const r = Math.round(255 + (zr - 255) * colorBlend)
            const g = Math.round(255 + (zg - 255) * colorBlend)
            const b = Math.round(255 + (zb - 255) * colorBlend)
            colorRGB = `${r}, ${g}, ${b}`

            x = p.baseX + (fillX - p.baseX) * pull + jitterX
            y = p.baseY + (fillY - p.baseY) * pull + jitterY

            // Extra per-particle scatter kick during liftoff, using the
            // particle's own phase for varied, organic-looking spread
            // rather than every particle scattering in lockstep. A slight
            // downward bias gives a trailing-exhaust feel as the shape
            // climbs away from the scattering particles.
            if (launchProgress > 0) {
              const scatterX = Math.cos(p.phase * 3.1) * LAUNCH_SCATTER * launchProgress
              const scatterY = Math.sin(p.phase * 2.7) * LAUNCH_SCATTER * 0.6 * launchProgress +
                launchProgress * LAUNCH_SCATTER_DROP
              x += scatterX
              y += scatterY
            }
          } else {
            const col = i % gridCols
            const row = Math.floor(i / gridCols)
            fillX = smoothedBandLeft + (col / gridCols) * smoothedBandWidth + Math.sin(p.phase) * 20
            fillY = smoothedRectTop + (row / gridCols) * smoothedRectHeight + Math.cos(p.phase) * 20

            const pull = clamp(p.alignStrength * smoothedVisibility * 1.15, 0, MAX_PULL)
            x = p.baseX + (fillX - p.baseX) * pull + jitterX
            y = p.baseY + (fillY - p.baseY) * pull + jitterY
          }
        }

        if (mouseActive) {
          const dx = x - mouseX
          const dy = y - mouseY
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < HOVER_RADIUS && dist > 0.01) {
            const falloff = 1 - dist / HOVER_RADIUS
            const force = falloff * falloff * HOVER_STRENGTH
            x += (dx / dist) * force
            y += (dy / dist) * force
            opacity = clamp(opacity + falloff * 0.3, 0.15, 1)
          }
        }

        const renderSize = isShapeMode && fillTargetsReady && smoothedVisibility > 0.001 && !p.isBaseline
          ? SHAPE_PARTICLE_SIZE
          : PARTICLE_SIZE

        ctx.beginPath()
        ctx.arc(x, y, renderSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${colorRGB}, ${opacity})`
        ctx.fill()
      })

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