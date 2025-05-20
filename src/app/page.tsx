"use client";

import React, { useState } from "react";

type EventItem = {
  title: string;
  date: string;
  img: string;
  link: string;
};

const events: EventItem[] = [
  {
    title: "Have a Seat",
    date: "25 May 2025",
    img: "/event1.png",
    link: "https://example.com/signup1",
  },
  {
    title: "The Secret Code of Life",
    date: "7 Jul 2025",
    img: "/event2.png",
    link: "https://example.com/signup2",
  },
  {
    title: "Discovering Dharma",
    date: "1–29 Jun 2025",
    img: "/event3.png",
    link: "https://example.com/signup3",
  },
];

export default function WisdomKiosk() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [wisdomNumber, setWisdomNumber] = useState<number | null>(null);

  const handleTap = () => {
    setWisdomNumber(Math.floor(Math.random() * 100) + 1);
    setStep(1);
  };

  const goToEvents = () => setStep(2);

  return (
    <div className="relative w-full min-h-[100dvh] bg-cover bg-center" style={{ backgroundImage: "url('/background.png')", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center text-white">
        {step === 0 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10"
            onClick={handleTap}
          >
            <div className="max-w-xs">
              <h1 className="text-7xl font-bold">Tap for Wisdom</h1>
              <p className="mt-4 text-2xl">Your next reminder might be just one tap away.</p>
            </div>
          </div>
        )}


        {step === 1 && (
          <div>
            <h2 className="text-4xl">Your number is...</h2>
            <p className="text-9xl font-bold my-6">{wisdomNumber}</p>
            <p className="text-2xl italic">
              Pick up <strong>Kindling Hope</strong> and flip to that page.<br />
              Let the wisdom speak to you.
            </p>
            <div className="flex gap-5">
              <button
                onClick={goToEvents}
                className="mt-6 px-6 py-3 bg-white text-black rounded-full hover:bg-gray-300"
              >
                Explore our Classes
              </button>
              <button
                onClick={goToEvents}
                className="mt-6 px-6 py-3 bg-white text-black rounded-full hover:bg-gray-300"
              >
                What's Coming Up?
              </button>
              <button
                onClick={goToEvents}
                className="mt-6 px-6 py-3 bg-white text-black rounded-full hover:bg-gray-300"
              >
                Hear us Out
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 w-full max-w-6xl">
            {events.map((event, i) => (
              <div
                key={i}
                className="bg-white text-black rounded-lg shadow-lg p-4 flex flex-col items-center"
              >
                <img src={event.img} alt={event.title} className="w-full h-auto rounded-md mb-4" />
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{event.date}</p>
                <a href={event.link} target="_blank" rel="noopener noreferrer">
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                    Sign Up
                  </button>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
