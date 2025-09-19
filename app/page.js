"use client";
import Image from "next/image";
import ProjectDisplay from "./components/projectDisplay";
import { useRef, useEffect, useState } from "react";
import GallerySlideshow from "./components/GallerySlideshow";
export default function Home() {
  function handleDivClick(url) {
    window.open(url);
  }
  const intro = useRef(null);
  const projects1 = useRef(null);
  const projects2 = useRef(null);
  const aboutMe = useRef(null);
  const contact = useRef(null);
  const scrollToSection = async (reference) => {
    await reference.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      </style>
      <div className="grid grid-flow-row min-w-[1920px] min-h-[1080px] justify-items-center gap-[100px] bg-opacity-50 bg-gray-900 font-lexend border-4">
        <div
          id="header"
          className="grid grid-flow-col grid-cols-3 justify-items-center w-full m-5 p-5 bg-opacity-50 bg-gray-700 place-items-center place-content-center"
        >
          <p
            className="press-start-2p-regular cursor-pointer group inline-block text-white relative"
            onClick={() => scrollToSection(intro)}
          >
            Introduction
            <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          </p>

          <p
            className="press-start-2p-regular cursor-pointer group inline-block text-white relative"
            onClick={() => scrollToSection(aboutMe)}
          >
            About Me!
            <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          </p>
          <p
            className="press-start-2p-regular cursor-pointer group inline-block text-white relative"
            onClick={() => scrollToSection(contact)}
          >
            Contacts
            <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          </p>
        </div>
        <div
          className="grid grid-flow-col w-full justify-items-center bg-opacity-50 bg-gray-900  border-gray-700 border-2 p-10"
          ref={intro}
        >
          <div className="grid grid-flow-row w-full justify-items-center bg-opacity-50 bg-gray-900 ">
            <div
              id="Introduction"
              className="justify-items-left m-5 p-5 bg-opacity-50 bg-gray-900"
            >
              <div className="justify-items-left m-5 p-5 bg-opacity-50 bg-gray-700 max-w-[80%] rounded-xl">
                <h1 className="text-4xl">Kyle Sharpless</h1>
                <h2 className="max-w-[100%] text-xl m-5 p-5">
                  Welcome, and thanks for visiting! This site was built with
                  Next.js as a space to introduce myself and highlight the web
                  applications I’ve developed. If you’d like to connect,
                  collaborate, or share ideas, feel free to reach out through
                  the socials below.
                </h2>
              </div>
              <div className="justify-items-center m-5 p-5 bg-opacity-50 bg-gray-900 max-w-[80%] place-content-center place-items-center">
                <div className="w-[85%] justify-items-center grid grid-flow-col p-5 bg-opacity-50 bg-gray-500 rounded-xl place-items-center">
                  <a
                    href="https://github.com/goatm1lk"
                    className="group inline-block text-white relative"
                  >
                    GitHub
                    <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  </a>
                  <a
                    href="https://linkedin.com/in/kylesharpless"
                    className="group inline-block text-white relative"
                  >
                    LinkedIn
                    <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  </a>
                  <a
                    href="mailto:sharpless.kale@gmail.com"
                    className="group inline-block text-white relative"
                  >
                    Email
                    <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="place-content-center text-center border-4 border-gray-500 w-[90%] p-5 m-5 bg-gray-500 bg-opacity-25 justify-items-center">
            <Image
              src="/Images/200.gif"
              alt="null"
              width={500}
              height={500}
            ></Image>
          </div> */}
          <div className="bg-gray-600 bg-opacity-50 w-full border-2 border-gray-400 grid place-content-center justify-items-stretch">
            <GallerySlideshow />
          </div>
        </div>

        <div
          id="content-work-showcase"
          className="grid grid-flow-row justify-items-center border-2 border-gray-600 bg-gray-600 bg-opacity-50 w-[99%]"
          ref={projects1}
        >
          {/* <div className="grid grid-flow-row grid-cols-2 w-full justify-items-center bg-gray-700 bg-opacity-50 min-h-[950px] place-content-center">
            <ProjectDisplay
              projectName={"Quilla.fun"}
              projectImageURL={"/Images/QuillaShowcase.gif"}
              onClick={() => handleDivClick("https://x.com/?mx=2")}
            ></ProjectDisplay>
            <ProjectDisplay
              projectName={"Crypto Swap Widget"}
              projectImageURL={"/Images/SwapWidget2.png"}
            ></ProjectDisplay>
          </div>
          <div
            ref={projects2}
            className="grid grid-flow-row grid-cols-2 w-full justify-items-center bg-gray-700 bg-opacity-50 min-h-[950px] place-content-center "
          >
            <ProjectDisplay
              projectName={"Gmail Cleaner Chrome Extension"}
              projectImageURL={"/Images/GmailCleaner.png"}
            ></ProjectDisplay>
            <ProjectDisplay
              projectName={"FedEx Rate and Ship Application"}
              projectImageURL={"/Images/LabelShowcase.png"}
            ></ProjectDisplay>
          </div> */}
        </div>
        {/* 🐢 Turtle Walk Animation */}
        <div className="w-full h-[250px] overflow-hidden relative bg-[url(/Images/turtleback.png)]">
          <div className="animate-turtle-walk h-[140px]">
            <Image
              src="/Images/short-walking-turtle.gif"
              alt="Walking Turtle"
              width={220}
              height={10}
              className="absolute animate-turtle-walk"
              unoptimized
            />
          </div>
        </div>
        <div
          id="aboutme"
          className="m-5 p-5 bg-opacity-50 bg-gray-700 grid grid-flow-col justify-content-center h-full border-gray-500 border-2 place-content-center justify-items-center"
          ref={aboutMe}
        >
          <div className="grid grid-flow-col bg-[url(/Images/binarycode.gif)] bg-opacity-50 ">
            <div className="grid grid-flow-row max-w-[70%] bg-gray-700 bg-opacity-90">
              <h1 className="grid text-3xl m-2 p-2 text-center place-content-center bg-gray-900 h-[50%] justify-items-center press-start-2p-regular">
                <p>About Me</p>
              </h1>
              <h2 className="text-center text-slate-300 text-2xl bg-gray-900 bg-opacity-50 h-[90%] m-5 p-5 place-content-center">
                Hello! My name is Kyle Sharpless, and I’m a Computer Science
                student with a strong passion for technology and
                problem-solving. I currently work full-time at TELUS Digital,
                where I specialize in API and Server Support. Outside of work, I
                enjoy building personal projects that automate tasks and deepen
                my understanding of web development. I am currently pursuing
                certifications with CompTIA, Cisco, and Microsoft to further
                strengthen my expertise in application deployment and production
                security. My ongoing goal is to continually expand my technical
                abilities and stay at the forefront of the evolving tech
                landscape.
                <div className="grid grid-flow-row max-w-[100%] bg-gray-700 bg-opacity-50">
                  <h3 className="text-center text-slate-300 text-2xl bg-gray-900 bg-opacity-50 h-[85%]  place-content-center font-bold">
                    Certifications
                  </h3>
                  <div className="grid grid-flow-row border-2 justify-items-center p-2">
                    <div className="relative w-[300px] h-[280px]">
                      <Image
                        src="/Images/Network+-png.png"
                        alt="null"
                        fill
                        className="object-fill"
                      />
                    </div>
                    <h1>Credential ID: COMP001022466880</h1>
                  </div>
                </div>
              </h2>
            </div>

            <div className="bg-gray-700 bg-opacity-50 ">
              <div className="grid grid-flow-row border-4 border-gray-500">
                <div className="grid grid-flow-col">
                  <Image
                    src="/Images/CoffeeShop1.JPG"
                    alt="Loading... Insert Loading GIF here."
                    height={197}
                    width={350}
                    className="min-w-[350px] min-h-[465px]  border-4 border-gray-700"
                  />
                  <Image
                    src="/Images/WeddingGuestPhoto.jpg"
                    alt="Loading... Insert Loading GIF here."
                    height={300}
                    width={300}
                    className="min-w-[350px] min-h-[467px]  border-4 border-gray-700"
                  />
                </div>
                <div className="grid grid-flow-col">
                  <Image
                    src="/Images/Desert.jpg"
                    alt="Loading... Insert Loading GIF here."
                    height={300}
                    width={300}
                    className="min-w-[350px] min-h-[467px]  border-4 border-gray-700"
                  />
                  <Image
                    src="/Images/WeddingPhoto3FullCrop2.jpg"
                    alt="Loading... Insert Loading GIF here. "
                    height={300}
                    width={300}
                    className="min-w-[350px] max-h-[467px]  border-4 border-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="w-full justify-items-center m-5 max-h-[400px] grid border-2 border-gray-500 bg-gray-700 bg-opacity-50"
          ref={contact}
        >
          <h1 className="text-4xl top-6 relative press-start-2p-regular">
            Contact me if you are Interested!
          </h1>
          <div className="w-full grid justify-items-center  m-5 p-5">
            <div
              id="contact-footer"
              className="grid grid-flow-col w-full justify-items-center m-5 p-5 bg-gray-600 bg-opacity-50 border-2 border-gray-600 "
            >
              <div
                className="bg-[url('/Images/GitHub.jpg')] bg-cover cursor-pointer min-h-[200px] min-w-[200px] border-2 border-gray-500 hover:shadow-xl hover:shadow-black"
                onClick={() => handleDivClick("https://github.com/goatm1lk")}
              ></div>
              <div
                className="bg-[url('/Images/LinkedIn.png')] bg-cover cursor-pointer min-h-[200px] min-w-[200px] border-2 border-gray-500 hover:shadow-xl hover:shadow-black"
                onClick={() =>
                  handleDivClick("https://linkedin.com/in/kylesharpless")
                }
              ></div>
              <div
                className="bg-[url('/Images/gmail.png')] bg-cover cursor-pointer min-h-[200px] min-w-[200px] border-2 border-gray-500 hover:shadow-xl hover:shadow-black"
                onClick={() =>
                  handleDivClick("mailto:sharpless.kale@gmail.com")
                }
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
