import { useState, useEffect, useRef } from "react";
import Image from "next/image";
const GalleySlideshow = () => {
  const DotsNavigation = ({ total, currentIndex, onDotClick }) => {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
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
      text: "Having Fun!",
      color: "text-gray-600",
    },
    {
      image: "/Images/LabelShowcase.png",
      text: "Revolutionary Anti-Shiba Token",
      color: "text-gray-600",
    },
    {
      image: "/Images/QuillaShowcase.gif",
      text: "Loneliness Reduction",
      color: "text-black",
    },
    {
      image: "/Images/SwapWidgetAdjusted.png",
      text: "Identity (finding a similar crew):",
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
    resetTimer()
  };
  
  const goToPreviousImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
    resetTimer()
  };
  
  const handleDotClick = (index) => {
    setCurrentIndex(index);
    resetTimer()
  };
  

  
  useEffect(() => {
    // Function to start the interval with the current interval duration
    const startInterval = () => {
        console.log("test123412321321")
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
  }, [intervalDuration, images.length,currentIndex]); // Dependency on intervalDuration ensures the timer restarts whenever it changes
  
  
  

  const currentImage = images[currentIndex];
  return (
    <>
      <div className="h-[1000px] w-100% grid grid-flow-col place-content-center m-5 p-5 ">
        <div className="relative bottom-12 w-[1700px] h-[900px] place-content-center border-4 border-black shadow-lg shadow-gray-400 drop-shadow-2xl mt-[48px]">
          <div
            className="relative justify-items-center place-content-start text-center bottom-[450px] mb-7"
          >
            <h1 className="press-start-2p-regular text-3xl">
              Project Showcase
            </h1>
          </div>
          <Image
            src={currentImage.image}
            alt={"Loading..."}
            layout="fill"
          ></Image>
          <button
            className="button-right absolute right-12"
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
            className="button absolute left-[50px]"
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
          <section className="relative bottom-[-380px]">
            <DotsNavigation
              total={images.length}
              currentIndex={currentIndex}
              onDotClick={handleDotClick}
            ></DotsNavigation>
          </section>
        </div>
      </div>
    </>
  );
};
export default GalleySlideshow;
