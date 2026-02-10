import React, { useEffect, useRef } from "react";
import { motion as Motion } from "framer-motion";

export default function Testimonials() {
  const sliderRef = useRef(null);

  const data = [
    { id: 1, name: "Amit Sharma", comment: "Excellent service! QuickTask solved my AC issue in minutes.", initials: "A", color: "bg-indigo-100" },
    { id: 2, name: "Priya Kulkarni", comment: "Very professional team, fast response. Loved the experience!", initials: "P", color: "bg-pink-100" },
    { id: 3, name: "Rohit Patil", comment: "QuickTask is my go-to for any home service. Highly recommended!", initials: "R", color: "bg-green-100" },
    { id: 4, name: "Sneha Desai", comment: "Affordable and reliable. The plumber was very polite.", initials: "S", color: "bg-yellow-100" },
    { id: 5, name: "Vikas More", comment: "Fantastic customer support! AC repairing was smooth.", initials: "V", color: "bg-blue-100" },
    { id: 6, name: "Neha Gupta", comment: "Amazing service quality. Quick and efficient!", initials: "N", color: "bg-purple-100" },
    { id: 7, name: "Arjun Mehta", comment: "Electrician arrived on time and fixed everything perfectly.", initials: "A", color: "bg-orange-100" },
    { id: 8, name: "Kiran Patil", comment: "Great experience. Fair pricing and clean work!", initials: "K", color: "bg-rose-100" },
    { id: 9, name: "Devika Rao", comment: "Very smooth booking experience. Loved their service!", initials: "D", color: "bg-teal-100" },
    { id: 10, name: "Harsh Verma", comment: "QuickTask team was super helpful and quick. Recommend!", initials: "H", color: "bg-red-100" },
  ];

  // AUTO SLIDING EVERY 5 SECONDS
  useEffect(() => {
    const slider = sliderRef.current;
    let scrollAmount = 0;

    const interval = setInterval(() => {
      if (!slider) return;

      scrollAmount += 320; // scroll by card width

      if (scrollAmount >= slider.scrollWidth) {
        scrollAmount = 0; // reset when reaching end
      }

      slider.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-7xl pt-32 mx-auto px-6 py-16">
      <h3 className="text-3xl font-bold mb-10 text-center">
        Customer Testimonials
      </h3>

      {/* OUTER WRAPPER REMOVES SCROLLBAR */}
      <div className="overflow-hidden">

        {/* INNER SLIDER (scroll works but invisible) */}
        <div
          ref={sliderRef}
          className="
            flex gap-6 overflow-x-auto 
            no-scrollbar 
            snap-x snap-mandatory 
            pb-4
          "
        >
          {data.map((item) => (
            <Motion.div
              key={item.id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.1 }}
              className="
                min-w-[300px] snap-center
                bg-white p-[2px] rounded-2xl shadow-md
                bg-gradient-to-br from-indigo-300 to-purple-300
              "
            >
              <div className="bg-white rounded-2xl p-6 shadow">
                <div className="text-3xl text-indigo-500 mb-3">❝</div>

                <div className="flex items-center gap-4">
                  <div
                    className={`
                      w-14 h-14 rounded-full ${item.color} 
                      flex items-center justify-center 
                      text-lg font-semibold text-gray-700
                    `}
                  >
                    {item.initials}
                  </div>

                  <div>
                    <div className="font-semibold text-lg">{item.name}</div>
                    <div className="text-sm text-gray-500">Verified Customer</div>
                  </div>
                </div>

                <div className="flex mt-4 text-yellow-500 text-lg">★★★★★</div>

                <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                  {item.comment}
                </p>

                <div className="mt-4 h-1 w-20 bg-indigo-500/80 rounded-full"></div>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
