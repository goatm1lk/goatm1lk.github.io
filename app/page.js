"use client";
import Image from "next/image";
import ProjectDisplay from "./components/projectDisplay";
import { useRef, useEffect, useState } from "react";
import GalleySlideshow from "./components/GallerySlideshow";
export default function Home() {
  function handleDivClick(url) {
    console.log("Div was clicked", url);
    window.open(url);
  }
  const intro = useRef(null);
  const projects1 = useRef(null);
  const projects2 = useRef(null);
  const aboutMe = useRef(null);
  const contact = useRef(null);
  const scrollToSection = async (reference) => {
    console.log(reference);
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
      <div className="grid grid-flow-row w-full justify-items-center gap-[100px] bg-opacity-50 bg-gray-900 font-lexend ">
        <div
          id="header"
          className="grid grid-flow-col grid-cols-4 justify-items-center w-full m-5 p-5 bg-opacity-50 bg-gray-700"
        >
          <p
            className="press-start-2p-regular cursor-pointer"
            onClick={() => scrollToSection(intro)}
          >
            Introduction
          </p>
          <p
            className="press-start-2p-regular cursor-pointer"
            onClick={() => scrollToSection(projects1)}
          >
            Projects
          </p>
          <p
            className="press-start-2p-regular cursor-pointer"
            onClick={() => scrollToSection(aboutMe)}
          >
            About Me!
          </p>
          <p
            className="press-start-2p-regular cursor-pointer"
            onClick={() => scrollToSection(contact)}
          >
            Contacts
          </p>
        </div>
        <div className="grid grid-flow-col w-full justify-items-center bg-opacity-50 bg-gray-900  border-gray-700 border-2">
          <div className="grid grid-flow-row w-full justify-items-center bg-opacity-50 bg-gray-900 ">
            <div
              id="Introduction"
              className="justify-items-left m-5 p-5 bg-opacity-50 bg-gray-900"
              ref={intro}
            >
              <div
                ref={intro}
                className="justify-items-left m-5 p-5 bg-opacity-50 bg-gray-700 max-w-[50%]"
              >
                <h1 className="text-4xl">Kyle Sharpless</h1>
                <h2 className="max-w-[100%] text-3xl m-5 p-5">
                  Welcome! Thanks for stopping by. This site was built using
                  Next.js, and it's here to introduce myself and showcase the
                  web applications I've developed over the years. Explore my
                  projects and discover how I've applied my skills to solve
                  real-world problems. If you’d like to connect or share ideas,
                  feel free to reach out via my social links below!
                </h2>
              </div>
              <div className="justify-items-center m-5 p-5 bg-opacity-50 bg-gray-900 max-w-[50%]">
                <div className="w-[85%] justify-items-center grid grid-flow-col p-5 bg-opacity-50 bg-gray-500">
                  <a href="https://x.com/?mx=2">X</a>
                  <a href="https://github.com/goatm1lk">GitHub</a>
                  <a href="https://linkedin.com/in/kylesharpless">LinkedIn</a>
                  <a href="mailto:sharpless.kale@gmail.com">Email</a>
                </div>
              </div>
            </div>
          </div>

          <div className="place-content-center text-center border-4 border-gray-500 w-[90%] p-5 m-5 bg-gray-500 bg-opacity-25 justify-items-center">
            <Image
              src="/Images/200.gif"
              alt="null"
              width={500}
              height={500}
            ></Image>
          </div>
        </div>

        <div
          id="content-work-showcase"
          className="grid grid-flow-row justify-items-center w-[99%] mt-5 gap-[20px] p-5 border-2 border-gray-600 bg-gray-600 bg-opacity-50"
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
          <div className="bg-gray-600 bg-opacity-50 w-full border-2 border-gray-400 max-h-[1000px]">
            <GalleySlideshow></GalleySlideshow>
          </div>
        </div>
        <div
          id="aboutme"
          className="m-5 p-5 bg-opacity-50 bg-gray-700 grid grid-flow-col justify-content-center h-full border-gray-500 border-2"
          ref={aboutMe}
        >
          <div className="grid grid-flow-col bg-gray-900 bg-opacity-50">
            <div className="grid grid-flow-row max-w-[70%] bg-gray-700 bg-opacity-50">
              <h1 className="grid text-3xl m-2 p-2 text-center place-content-center bg-gray-900 h-[50%] justify-items-center press-start-2p-regular">
                <p>About Me</p>
              </h1>
              <h2 className="text-center text-slate-300 text-3xl bg-gray-900 bg-opacity-50 h-[85%] m-5 p-5 place-content-center">
                Hello! My name is Kyle Sharpless, and I am a Computer Science
                student with a passion for technology and problem-solving. I
                work full-time at TELUS Digital as a Subject Matter Expert,
                where I specialize in API and server support for
                logistics-related services. Outside of work, I enjoy working on
                personal projects that help automate tasks or deepen my
                understanding of web development concepts. I am also pursuing
                certifications in CompTIA, Cisco, and Azure to enhance my
                knowledge of application deployment and security in production
                environments. My goal is to continuously expand my skill set and
                stay on the cutting edge of the tech industry.
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
                    objectFit="cover"

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
                    objectFit="cover"
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
              className="grid grid-flow-col w-full justify-items-center m-5 p-5 bg-gray-600 bg-opacity-50 border-2 border-gray-600"
            >
              <div
                className="bg-[url('/Images/X.jpg')] bg-cover cursor-pointer min-h-[200px] min-w-[200px] border-2 border-gray-500"
                onClick={() => handleDivClick("https://x.com/?mx=2")}
              ></div>
              <div
                className="bg-[url('/Images/GitHub.jpg')] bg-cover cursor-pointer min-h-[200px] min-w-[200px] border-2 border-gray-500"
                onClick={() => handleDivClick("https://github.com/goatm1lk")}
              ></div>
              <div
                className="bg-[url('/Images/LinkedIn.png')] bg-cover cursor-pointer min-h-[200px] min-w-[200px] border-2 border-gray-500"
                onClick={() =>
                  handleDivClick("https://linkedin.com/in/kylesharpless")
                }
              ></div>
              <div
                className="bg-[url('/Images/gmail.png')] bg-cover cursor-pointer min-h-[200px] min-w-[200px] border-2 border-gray-500"
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
