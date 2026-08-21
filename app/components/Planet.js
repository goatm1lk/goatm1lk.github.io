'use client'

import { useEffect, useState } from 'react'
import styles from './Planet.module.css'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export default function Planet({
  size, top, left, right,
  color, glow, ringColor,
  parallaxSpeed = 0.15,
  delay = 0,
  appearStart = 0.4, // fraction of total page scroll (0-1) where it starts fading in
  appearEnd = 0.6,   // fraction of total page scroll (0-1) where it starts fading out
  fadeMargin = 0.08, // how much scroll range the fade in/out takes, before/after the window
}) {
  const [offset, setOffset] = useState(0)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    let pageHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)

    const recalcPageHeight = () => {
      pageHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
    }
    window.addEventListener('resize', recalcPageHeight)

    const onScroll = () => {
      const scrollY = window.scrollY
      setOffset(scrollY * parallaxSpeed)

      const progress = clamp(scrollY / pageHeight, 0, 1)

      const fadeInStart = appearStart - fadeMargin
      const fadeOutEnd = appearEnd + fadeMargin

      let nextOpacity = 0
      if (progress < fadeInStart || progress > fadeOutEnd) {
        nextOpacity = 0
      } else if (progress < appearStart) {
        // Fading in
        nextOpacity = (progress - fadeInStart) / (appearStart - fadeInStart)
      } else if (progress <= appearEnd) {
        // Fully visible
        nextOpacity = 1
      } else {
        // Fading out
        nextOpacity = 1 - (progress - appearEnd) / (fadeOutEnd - appearEnd)
      }

      setOpacity(clamp(nextOpacity, 0, 1))
    }

    onScroll() // set initial state on mount, in case page loads mid-scroll
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', recalcPageHeight)
    }
  }, [parallaxSpeed, appearStart, appearEnd, fadeMargin])

  return (
    <div
      className={styles.planetWrapper}
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        transform: `translateY(${offset}px)`,
        opacity,
        transition: 'opacity 0.3s ease-out',
        pointerEvents: opacity < 0.05 ? 'none' : 'auto',
      }}
    >
      <div
        className={styles.planet}
        style={{
          background: color,
          boxShadow: `0 0 40px 12px ${glow}, inset -18px -14px 35px rgba(0,0,0,0.55)`,
          animationDelay: `${delay}s`,
        }}
      >
        {ringColor && (
          <div
            className={styles.ring}
            style={{
              borderColor: ringColor,
              width: size * 2.2,
              left: -size * 0.6,
              top: size * 0.38,
            }}
          />
        )}
        <div className={styles.shine} />
      </div>
    </div>
  )
}