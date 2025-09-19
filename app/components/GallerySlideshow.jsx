"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
const GalleySlideshow = () => {
  const DotsNavigation = ({ total, currentIndex, onDotClick }) => {
    return (
      <div className="mt-[20px] justify-content-center grid grid-flow-col justify-items-center  place-content-center place-items-center">
        {Array.from({ length: total }).map((_, index) => (
          <span
            key={index}
            onClick={() => onDotClick(index)} // Clickable dots
            style={{
              width: "15px",
              height: "15px",
              margin: "5px",
              borderRadius: "50%",
              backgroundColor: index === currentIndex ? "green" : "black", // Highlight current dot
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </div>
    );
  };
  const images = [
    {
      image: "/Images/GmailCleaner.png",
      text: "A custom-built browser extension designed to streamline inbox management by bulk-deleting subscription and promotional emails efficiently.",
      color: "text-gray-600",
    },
    {
      image: "/Images/FedExRateAndShip.png",
      text: "A FedEx Rate and Ship integration leveraging FedEx APIs. Supports domestic and international shipping with advanced options including Saturday delivery, hold-at-location, return shipments, email label generation, and FedEx One Rate services.",
      color: "text-gray-600",
    },
    {
      image: "/Images/QuillaShowcase.png",
      text: "A freelance project: a responsive website developed for a startup cryptocurrency venture, focusing on brand presence and usability.",
      color: "text-gray-600",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalDuration, resetIntervalDuration] = useState(5000);
  const intervalIdRef = useRef(null);

  const resetTimer = () => {
    resetIntervalDuration(5000);
  };
  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    resetTimer();
  };

  const goToPreviousImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
    resetTimer();
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    resetTimer();
  };

  useEffect(() => {
    // Function to start the interval with the current interval duration
    const startInterval = () => {
      // Clear the existing interval if it exists
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }

      // Start the interval to automatically change the image
      intervalIdRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, intervalDuration);
    };

    // Start a new interval when intervalDuration or images.length changes
    startInterval();

    // Cleanup the interval on unmount or when the effect dependencies change
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [intervalDuration, images.length, currentIndex]); // Dependency on intervalDuration ensures the timer restarts whenever it changes

  const currentImage = images[currentIndex];
  return (
    <>
      <div className="w-full p-5 grid grid-flow-row place-content-center place-items-center justify-items-center ">
        <h1 className="press-start-2p-regular text-3xl m-5">
          Project Showcase
        </h1>

        <div className="grid w-[52rem] h-full border-4 border-black bg-green-100 shadow-lg drop-shadow-2xl place-content-center justify-items-end place-items-end relative m-5 p-5">
          <div className="relative min-w-[50rem] min-h-[500px]">
            <Image
              src={currentImage.image}
              alt="Loading..."
              fill
              className="cover"
            />
          </div>

          <button
            className="button-right absolute right-12 mb-5"
            onClick={goToNextImage}
          >
            <div className="line one">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>
            <div className="line two">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>
            <div className="line three">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>
            <div className="line four">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>

            <div className="line five">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>

            <div className="line six">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>

            <div className="line seven">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>
          </button>
          <button
            className="button absolute left-[50px] mb-5"
            onClick={goToPreviousImage}
          >
            <div className="line one">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>
            <div className="line twoleft">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>
            <div className="line threeleft">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>
            <div className="line fourleft">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>

            <div className="line fiveleft">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>

            <div className="line sixleft">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>

            <div className="line seven">
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
              <div className="round"></div>
            </div>
          </button>
          {/* <button className="absolute right-5" onClick={goToNextImage}>Next</button>
                <button className="absolute left-5" onClick={goToPreviousImage}>Previous</button> */}
        </div>
        <div className="grid text-center max-w-[800px] min-h-[72px]">
          <p className="max-h-[200px] max-w-[1000px]">{currentImage.text}</p>
        </div>
        <section className="">
          <DotsNavigation
            total={images.length}
            currentIndex={currentIndex}
            onDotClick={handleDotClick}
          ></DotsNavigation>
        </section>
      </div>
    </>
  );
};
export default GalleySlideshow;
