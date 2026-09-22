"use client";

import dynamic from "next/dynamic";
import styles from "./style.module.css";
import { Press_Start_2P } from "next/font/google";
const Planet = dynamic(() => import("../components/Planet"), { ssr: false });
const ParticleField = dynamic(() => import("../components/ParticleField"), {
  ssr: false,
});

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

const sectionStyle = {
  minHeight: "250vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  color: "white",
  position: "relative",
  zIndex: 1,
};

const sectionStyleDebug = {
  minHeight: "1000vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  color: "red",
  position: "relative",
  zIndex: 1,
};

// Planets are spread across the whole scroll range (appearStart/appearEnd
// are fractions of total page scroll, 0-1) so a different one is in view
// as you move through each section. parallaxSpeed < 1 makes them drift
// slower than the page scrolls, giving a sense of depth behind the content.
const PLANETS = [
  {
    size: 190,
    top: "10vh",
    right: "8vw",
    color:
      "radial-gradient(circle at 32% 28%, #ffdca8 0%, #ff8a4c 55%, #a3400f 100%)",
    glow: "rgba(255, 140, 70, 0.5)",
    ringColor: "rgba(255, 210, 160, 0.4)",
    parallaxSpeed: 0.08,
    delay: 0,
    appearStart: 0.0,
    appearEnd: 0.22,
  },
  {
    size: 85,
    top: "60vh",
    left: "6vw",
    color:
      "radial-gradient(circle at 35% 30%, #d7f0ff 0%, #6fa8dc 55%, #2c4f75 100%)",
    glow: "rgba(120, 180, 255, 0.5)",
    parallaxSpeed: 0.16,
    delay: 1.4,
    appearStart: 0.16,
    appearEnd: 0.42,
  },
  {
    size: 230,
    top: "15vh",
    right: "-60px",
    color:
      "radial-gradient(circle at 30% 25%, #f1d9ff 0%, #b57bde 55%, #5b2f82 100%)",
    glow: "rgba(190, 120, 255, 0.45)",
    ringColor: "rgba(225, 190, 255, 0.35)",
    parallaxSpeed: 0.05,
    delay: 2.6,
    appearStart: 0.38,
    appearEnd: 0.68,
  },
  {
    size: 65,
    top: "65vh",
    left: "10vw",
    color:
      "radial-gradient(circle at 35% 30%, #e4fff0 0%, #6fd99a 55%, #1f6b46 100%)",
    glow: "rgba(140, 255, 180, 0.4)",
    parallaxSpeed: 0.2,
    delay: 0.7,
    appearStart: 0.62,
    appearEnd: 0.95,
  },
];

export default function Home() {
  return (
    <div
      style={{
        minHeight: "800vh",
        background: "linear-gradient(135deg, #02030a 0%, #0f172a 100%)",
      }}
    >
      <ParticleField />

      {/* {PLANETS.map((planet, i) => (
        <Planet key={i} {...planet} />
      ))} */}

      <main style={{ position: "relative", zIndex: 1 }}>
        <section data-particle-focus="rocket" style={sectionStyle}>
          <div style={{ position: "sticky", top: "40vh" }}>
            <header
              className={`w-screen text-center text-white bg-gray-900 bg-opacity-10 backdrop-blur-md p-4 rounded-lg shadow-lg`}
            >
              <div
                id="header"
                className="grid grid-cols-3 items-center text-center"
              >
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
        <section
          data-particle-focus="center"
          style={{
            ...sectionStyle,
            justifyContent: "center",
            minHeight: "150vh",
          }}
        >
          Smooth out animation
        </section>

        <section
          data-particle-focus="left"
          style={{ ...sectionStyle, justifyContent: "flex-start" }}
        >
          <div
            id="aboutme"
            style={{
              maxWidth: "1060px",
              background: "rgba(15, 23, 42, 0.76)",
              padding: "2rem",
              borderRadius: "1rem",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            // ref={aboutMe}
          >
            <div>
              <div>
                <h1
                  className="text-center text-4xl bold mb-4"
                  style={{
                    maxWidth: "1060px",
                    background: "rgba(15, 23, 42, 0.76)",
                    padding: "2rem",
                    borderRadius: "1rem",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <p>About Me</p>
                </h1>
                <h2
                  style={{
                    maxWidth: "1060px",
                    background: "rgba(15, 23, 42, 0.76)",
                    padding: "2rem",
                    borderRadius: "1rem",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                ></h2>

                <h3 className="text-center text-xl ">
                  Hello! My name is Kyle Sharpless, and I’m a Computer Science
                  student with a strong passion for technology and
                  problem-solving. I currently work full-time at TELUS Digital,
                  where I specialize in API and Server Support. Outside of work,
                  I enjoy building personal projects that automate tasks and
                  deepen my understanding of web development. I am currently
                  pursuing certifications with CompTIA, Cisco, and Microsoft to
                  further strengthen my expertise in application deployment and
                  production security. My ongoing goal is to continually expand
                  my technical abilities and stay at the forefront of the
                  evolving tech landscape.
                </h3>
                {/* <div >
                    <h3 >
                      Certifications
                    </h3>
                    <div >
                      <div >
                        <Image
                          src="/Images/Network+-png.png"
                          alt="null"
                          width={320}
                          height={240}

                        />
                      </div>

                    </div>
                  </div> */}
              </div>

              <div>
                <div>
                  <div>
                    {/* SUCCESS: Relative container with responsive height */}
                    {/* <div className="relative w-full h-96 ">
                    <Image
                      src="../public/Images/CoffeeShop1.JPG"
                      alt="Coffee Shop"
                      fixed
                      priority
                      className="border-4 border-gray-700 object-cover"
                    />
                  </div>
                  <div className="relative w-full h-96">
                    <Image
                      src="/Images/Desert.jpg"
                      alt="Loading... Insert Loading GIF here."
                      fill
                      className="border-4 border-gray-700 object-cover"
                    />
                  </div>
                  <div className="relative w-full h-96">
                    <Image
                      src="/Images/WeddingPhoto3FullCrop2.jpg"
                      alt="Loading... Insert Loading GIF here. "
                      fill
                      className=" border-4 border-gray-700"
                    />
                  </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div >
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Left side focus</h2>
            <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
              The stars pull toward the left edge here so the content area feels more open on the right.
            </p>
          </div> */}
        </section>

        <section
          data-particle-focus="right"
          style={{ ...sectionStyle, justifyContent: "flex-end" }}
        >
          <div
            style={{
              maxWidth: "1060px",
              background: "rgba(15, 23, 42, 0.76)",
              padding: "2rem",
              borderRadius: "1rem",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            Project Slideshow
            {/* <GallerySlideshow /> */}
          </div>
        </section>

        <section
          data-particle-focus="left"
          style={{ ...sectionStyle, justifyContent: "flex-start" }}
        >
          <div
            style={{
              maxWidth: "1060px",
              background: "rgba(15, 23, 42, 0.76)",
              padding: "2rem",
              borderRadius: "1rem",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              Left again
            </h2>
            <p style={{ lineHeight: 1.7, color: "rgba(255,255,255,0.8)" }}>
              Some sort of animation/ game I made.
            </p>
          </div>
        </section>

        <section
          data-particle-focus="center"
          style={{ ...sectionStyle, justifyContent: "center" }}
        >
          <div
            style={{
              maxWidth: "1060px",
              background: "rgba(15, 23, 42, 0.76)",
              padding: "2rem",
              borderRadius: "1rem",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              Lets get in touch!
            </h2>
            <p style={{ lineHeight: 1.7, color: "rgba(255,255,255,0.8)" }}>
              <h1 className="text-4xl top-6 grid press-start-2p-regular">
                Contact me if you are Interested!
              </h1>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
