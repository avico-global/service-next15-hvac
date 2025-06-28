import React, { useState, useRef, useEffect } from "react";
import Container from "./common/Container";
import Image from "next/image";
import FullContainer from "./common/FullContainer";
import { project_id } from "@/lib/myFun";
import arrow from "../public/st-images/arrowhead.jpg";

export default function BeforeAfter({ project_id, niche }) {
  console.log("project_id in before after", project_id);

  const HVAC = [
    {
      before: "/st-images/beforeafter/hvac/before1.webp",
      before_alt: "before",
      after: "/st-images/beforeafter/hvac/after1.webp",
      after_alt: "after",
    },
    {
      before: "/st-images/beforeafter/hvac/before2.webp",
      before_alt: "before",
      after: "/st-images/beforeafter/hvac/after2.webp",
      after_alt: "after",
    },
    {
      before: "/st-images/beforeafter/hvac/before3.webp",
      before_alt: "before",
      after: "/st-images/beforeafter/hvac/after3.webp",
      after_alt: "after",
    },
    {
      before: "/st-images/beforeafter/hvac/before4.webp",
      before_alt: "before",
      after: "/st-images/beforeafter/hvac/after4.webp",
      after_alt: "after",
    },
  ];

  return (
    <FullContainer>
      <Container className="pb-16 pt-6 ">
        <h2 className="text-4xl text-center pb-6 font-extrabold text-[#002B5B] mb-2">
          Before And After Results
        </h2>
        <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-5">
          {HVAC.map((item, index) => (
            <BeforeAfterSlider
              key={index}
              beforeImage={item.before}
              afterImage={item.after}
              beforeAlt={item.before_alt}
              afterAlt={item.after_alt}
            />
          ))}
        </div>
        <div className="md:hidden grid grid-cols-2 md:grid-cols-4 gap-5">
          {HVAC.slice(0, 2).map((item, index) => (
            <BeforeAfterSlider
              key={index}
              beforeImage={item.before}
              afterImage={item.after}
              beforeAlt={item.before_alt}
              afterAlt={item.after_alt}
            />
          ))}
        </div>
      </Container>
    </FullContainer>
  );
}

function BeforeAfterSlider({ beforeImage, afterImage, beforeAlt, afterAlt }) {
  const [ishover, setIshover] = useState(false);

  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e) => {
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const position =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, position)));
    }
  };

  const handleTouchMove = (e) => {
    if (containerRef.current && e.touches[0]) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const position =
        ((e.touches[0].clientX - containerRect.left) / containerRect.width) *
        100;
      setSliderPosition(Math.max(0, Math.min(100, position)));
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchEnd = () => {
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div
      className="relative w-full aspect-square overflow-hidden"
      onMouseEnter={() => setIshover(true)}
      onMouseLeave={() => setIshover(false)}
      ref={containerRef}
    >
      {/* Before Image (Static, always visible) */}
      <div className="absolute inset-0">
        <Image src={afterImage} alt={afterAlt} fill className="object-cover" />
        <div
          className={`${
            ishover ? "opacity-100" : "opacity-0"
          } transition-all duration-500 absolute top-32 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded z-10`}
        >
          After
        </div>
      </div>

      {/* After Image (Masked, always 100% size, only part revealed) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="relative w-full h-full">
          <Image
            src={beforeImage}
            alt={beforeAlt}
            fill
            className="object-cover object-left"
          />
          <div
            className={`${
              ishover ? "opacity-100" : "opacity-0"
            } transition-all duration-500 absolute top-32 left-4 bg-black bg-opacity-70 z-10 text-white px-3 py-1 rounded`}
          >
            Before
          </div>
        </div>
      </div>

      {/* Slider Control */}
      <div
        ref={sliderRef}
        className="absolute top-0 bottom-0 w-[3px] bg-white cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%`, marginLeft: "-2px" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          onMouseEnter={() => setIshover(false)}
          onMouseLeave={() => setIshover(true)}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-transparent border-[3px] border-white shadow-md flex items-center justify-center"
        >
          <div className="flex items-center gap-2">
            <Image
              src={arrow}
              alt="arrow"
              width={20}
              height={20}
              className=" w-2.5 h-2.5"
            />
            <Image
              src={arrow}
              alt="arrow"
              width={20}
              height={20}
              className="rotate-180  w-2.5 h-2.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
