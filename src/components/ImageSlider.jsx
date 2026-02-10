
import React, { useEffect, useRef } from "react";
export default function ImageSlider() {
  const sliderRef = useRef(null);


  const images = [
    "bathroom-cleaning (1).jpg" ,
    "instant-glow-facial.jpg",
    "natural-salon-desk-cover.webp",
    "1735893886310-6dbc53.webp",
    "1750420814338-49f225.webp",
    "1765426992951-93ac91.webp",
    "1765427014173-6ef806.webp",
    "wall-makeovers-banner.jpg"
  ];

  // AUTO SLIDER
  useEffect(() => {
    const slider = sliderRef.current;
    let scrollAmount = 0;

    const interval = setInterval(() => {
      if (!slider) return;

      scrollAmount += slider.clientWidth;

      if (scrollAmount >= slider.scrollWidth) {
        scrollAmount = 0;
      }

      slider.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full flex justify-center py-6">
      <div className="w-4/5 overflow-hidden rounded-xl shadow-lg">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="min-w-full snap-center flex-shrink-0"
            >
              <img
                src={img}
                className="w-full h-[350px] md:h-[450px] object-cover rounded-xl"
                alt="slider"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

