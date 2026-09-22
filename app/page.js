"use client";
import Image from "next/image";
import ContactForm from "./components_old/ContactForm";
import { useRef, useEffect, useState } from "react";
import GallerySlideshow from "./components_old/GallerySlideshow";
export default function Home() {
  // function handleDivClick(url) {
  //   window.open(url);
  // }
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

      <div className="grid grid-flow-row h-full justify-items-center gap-[100px] bg-opacity-50 bg-gray-900 font-lexend rounded-xl  p-5 w-full">
       
        <div
          className="grid grid-flow-col w-full justify-items-center bg-opacity-50 bg-gray-900  border-gray-700 border-2 p-10"
          ref={intro}
        >
          <div className="grid grid-flow-row w-full justify-items-center bg-opacity-50 bg-gray-900 ">
            <div
              id="Introduction"
              className="justify-items-left m-5 p-5 bg-opacity-50 bg-gray-900"
            >
              <div className="justify-items-left m-5 p-5 bg-opacity-50 bg-gray-700 rounded-xl">
                <h1 className="text-4xl">Kyle Sharpless</h1>
                <h2 className="text-xl m-5 p-5 place-content-center">
                  Welcome, and thanks for visiting! This site was built with
                  Next.js as a space to introduce myself and highlight the web
                  applications I’ve developed. If you’d like to connect,
                  collaborate, or share ideas, feel free to reach out through
                  the socials below.
                </h2>
              </div>
              <div className="justify-items-center m-5 p-5 bg-opacity-50 bg-gray-900 place-content-center place-items-center">
                <div className="gap-5 justify-items-center grid grid-flow-col p-5 bg-opacity-50 bg-gray-500 rounded-xl place-items-center">
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
          <div className="bg-gray-600 bg-opacity-50 border-2 border-gray-400 grid place-content-center justify-items-stretch">
            {/* <GallerySlideshow /> */}
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
        <div className="w-full h-[100%] overflow-hidden relative bg-[url(/Images/turtleback.png)]">
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
          className="grid grid-flow-row h-full w-full justify-items-center grid border-2 border-gray-500 bg-gray-700 bg-opacity-50 gap-4 p-5"
          ref={contact}
        >
          <h1 className="text-4xl top-6 grid press-start-2p-regular">
            Contact me if you are Interested!
          </h1>
          {/* <div className="flex flex-row h-full">
              <ContactForm/>
          </div> */}
            
        </div>
      </div>
    </>
    
  );
}
