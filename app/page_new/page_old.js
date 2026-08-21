import styles from './style.module.css';
import Image from 'next/image';
import jupiterImage from '../../public/Images/jupiter.png';
import moonImage from '../../public/Images/moon.jpg';

const moons = [
  { size: 500, duration: 4, delay: 0, },
  { size: 600, duration: 7, delay: -2, tilt: 30 },
  { size: 700, duration: 11, delay: -5, tilt: 75 },
  { size: 800, duration: 15, delay: -1, tilt: 45 },
  { size: 600, duration: 17, delay: -2, tilt: 30 },
  { size: 700, duration: 19, delay: -5, tilt: 75 },
  { size: 800, duration: 21, delay: -1, tilt: 45 },
];

export default function AnimatedBackground() {
  return (
    <div className={styles.scrollWrapper}>
      <div className={styles.stickyBackground}>
        <div className={styles.planet}>
          <Image src={jupiterImage} alt="Planet" width={1000} height={1000} />

          {moons.map((moon, i) => (
            <div
              key={i}
              className={styles.orbitRing}
              style={{
                width: moon.size,
                height: moon.size,
                marginLeft: -moon.size / 2,
                marginTop: -moon.size / 2,
                animationDuration: `${moon.duration}s`,
                animationDelay: `${moon.delay}s`,
              }}
            >
              <Image
                src={moonImage}
                alt="Moon"
                width={50}
                height={50}
                className={styles.moonImg}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


