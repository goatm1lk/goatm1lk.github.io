'use client'

import { useEffect, useState } from 'react'
import styles from './Planet.module.css'

interface PlanetProps {
  size: number
  top?: string
  left?: string
  right?: string
  color: string
  glow: string
  ringColor?: string
  parallaxSpeed?: number
  delay?: number
}

export default function Planet({
  size, top, left, right,
  color, glow, ringColor,
  parallaxSpeed = 0.15,
  delay = 0,
}: PlanetProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * parallaxSpeed)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [parallaxSpeed])

  return (
    <div
      className={styles.planet}
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        background: color,
        boxShadow: `0 0 40px 12px ${glow}, inset -18px -14px 35px rgba(0,0,0,0.55)`,
        animationDelay: `${delay}s`,
        transform: `translateY(${offset}px)`,
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
  )
}
