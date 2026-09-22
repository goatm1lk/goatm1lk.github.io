// // components/Planet.js
// 'use client'

// import { useEffect, useRef } from 'react'
// import styles from './Planet.module.css'

// const START_OFFSET_VW = 60     // planet starts this far right of center
// const END_OFFSET_VW = -60      // ends this far left of center
// const SCROLL_LERP = 0.08       // smoothing — matches FOCUS_LERP feel in ParticleField
// const FADE_IN_RANGE = 0.15     // fraction of progress spent fading in
// const FADE_OUT_RANGE = 0.15    // fraction of progress spent fading out

// function clamp(v, min, max) {
//   return Math.min(max, Math.max(min, v))
// }

// let sections = Array.from(document.querySelectorAll('[data-particle-focus]'))
// let targetSelector = document.querySelector('[data-particle-focus="left"]')
// export default function Planet() {

//   console.log('Planet component rendering')
//   const planetRef = useRef(null)

//   useEffect(() => {
//     console.log('1. effect ran')
//     const el = planetRef.current
//     console.log('2. el is', el)
//     if (!el) return

//     let rafId
//     let targetSection = document.querySelector(targetSelector)
//     let smoothedProgress = 0

//     const resize = () => {
//       targetSection = document.querySelector(targetSelector)
//     }
//     window.addEventListener('resize', resize)

//     const tick = () => {
//       if (targetSection) {
//         const rect = targetSection.getBoundingClientRect()
//         const vh = window.innerHeight
//         const total = rect.height + vh
//         const traveled = vh - rect.top
//         const rawProgress = clamp(traveled / total, 0, 1)
//         smoothedProgress += (rawProgress - smoothedProgress) * SCROLL_LERP

//         console.log({ rectTop: rect.top, rawProgress, smoothedProgress }) // TEMP
//       }
//       const x = START_OFFSET_VW + (END_OFFSET_VW - START_OFFSET_VW) * smoothedProgress

//       let opacity = 1
//       if (smoothedProgress < FADE_IN_RANGE) {
//         opacity = smoothedProgress / FADE_IN_RANGE
//       } else if (smoothedProgress > 1 - FADE_OUT_RANGE) {
//         opacity = (1 - smoothedProgress) / FADE_OUT_RANGE
//       }
//       opacity = clamp(opacity, 0, 1)

//       el.style.transform = `translate3d(${x}vw, 0, 0)`
//       el.style.opacity = opacity

//       rafId = requestAnimationFrame(tick)
//     }

//     tick()

//     return () => {
//       cancelAnimationFrame(rafId)
//       window.removeEventListener('resize', resize)
//     }
//   }, [targetSelector])

//   return (
//     <div className={styles.wrapper} aria-hidden="true">
//       <div ref={planetRef} className={styles.planet} />
//     </div>
//   )
// }