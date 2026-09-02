'use client'

import dynamic from 'next/dynamic'
import styles from './style.module.css'
import { Press_Start_2P } from 'next/font/google'
const Planet = dynamic(() => import('../components/Planet'), { ssr: false })
const ParticleField = dynamic(() => import('../components/ParticleField'), { ssr: false })

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
})

const sectionStyle = {
  minHeight: '250vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  color: 'white',
  position: 'relative',
  zIndex: 1,
}

const sectionStyleDebug = {
  minHeight: '1000vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  color: 'red',
  position: 'relative',
  zIndex: 1,
}

export default function Home() {
  return (

    <div style={{ minHeight: '800vh', background: 'linear-gradient(135deg, #02030a 0%, #0f172a 100%)' }}>

      <ParticleField />



      <main style={{ position: 'relative', zIndex: 1 }}>
        <section data-particle-focus="rocket" style={sectionStyle}>
          <div style={{ position: 'sticky', top: '40vh' }}>


            <header className={`w-screen text-center text-white bg-gray-900 bg-opacity-10 backdrop-blur-md p-4 rounded-lg shadow-lg`}>
              <div id="header" className="grid grid-cols-3 items-center text-center">
                <span className={styles.wrapper}>
                  <span className={styles.glow} />
                  <span className={styles.text}>Introduction</span>
                </span>


                <span className={styles.wrapper}>
                  <span className={styles.glow} />
                  <span className={styles.text}>About Me!</span>
                </span>


                <span className={styles.wrapper}>
                  <span className={styles.glow} />
                  <span className={styles.text}>Contacts</span>
                </span>

              </div>
            </header>
          </div>


        </section>
        <section data-particle-focus="left" style={{ ...sectionStyle, justifyContent: 'flex-start' }}>
          <div style={{ maxWidth: '560px', background: 'rgba(15, 23, 42, 0.76)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.12)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Left side focus</h2>
            <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
              The stars pull toward the left edge here so the content area feels more open on the right.
            </p>
          </div>
        </section>

        <section data-particle-focus="right" style={{ ...sectionStyle, justifyContent: 'flex-end' }}>
          <div style={{ maxWidth: '560px', background: 'rgba(15, 23, 42, 0.76)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.12)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Right side focus</h2>
            <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
              This section shifts the field toward the right side so the composition changes as you scroll.
            </p>
          </div>
        </section>

        <section data-particle-focus="left" style={{ ...sectionStyle, justifyContent: 'flex-start' }}>
          <div style={{ maxWidth: '560px', background: 'rgba(15, 23, 42, 0.76)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.12)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Left again</h2>
            <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
              You can repeat the same focus on multiple sections to create a consistent rhythm.
            </p>
          </div>
        </section>

        <section data-particle-focus="center" style={{ ...sectionStyle, justifyContent: 'center' }}>
          <div style={{ maxWidth: '560px', background: 'rgba(15, 23, 42, 0.76)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.12)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Centered focus</h2>
            <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
              A centered section can act as a reset point between the stronger left and right layouts.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
