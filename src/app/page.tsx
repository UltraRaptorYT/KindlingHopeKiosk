"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import "./index.css";
import {
  KioskConfig,
  ButtonConfig,
  EventConfig,
  SheetAPIResponse,
} from "@/types";
import ReactMarkdown from "react-markdown";

export default function WisdomKiosk() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStep(0); // 👈 Reset to "Tap for Wisdom"
    }, 1000 * 60 * 5); // 5 minutes
  }, []);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart"];

    const handleActivity = () => resetInactivityTimer();

    events.forEach((event) => window.addEventListener(event, handleActivity));

    resetInactivityTimer(); // Start the timer initially

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetInactivityTimer]);

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [config, setConfig] = useState<KioskConfig | null>(null);
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);
  const [events, setEvents] = useState<EventConfig[]>([]);

  const [spinDuration, setSpinDuration] = useState<number>(2000);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/sheet");
      const data: SheetAPIResponse = await res.json();

      setConfig(data.config);
      setButtons(data.buttons);
      setEvents(data.events);
    };

    loadData();
  }, []);

  useEffect(() => {
    setSpinDuration(parseInt(config?.NumberSpinDuration ?? "2000"));
  }, [config]);

  const handleTap = () => {
    setSpinning(true);
    setStep(1);

    const min = parseInt(config?.NumberMin ?? "1");
    const max = parseInt(config?.NumberMax ?? "100");

    const interval = setInterval(() => {
      setDisplayNumber(Math.floor(Math.random() * (max - min + 1)) + min);
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      const final = Math.floor(Math.random() * (max - min + 1)) + min;
      setDisplayNumber(final);
      setSpinning(false);
    }, spinDuration);
  };

  const goToEvents = () => setStep(2);

  const handleButton = (link: string) => {
    if (link == "/EVENT") {
      return goToEvents();
    } else {
      return window.open(link, "_blank");
    }
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center fullHeight text-2xl text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full fullHeight bg-cover bg-center"
      style={{
        backgroundImage: `url('${
          config.BackgroundImage || "/background.png"
        }')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center text-white">
        {step === 0 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10"
            onClick={handleTap}
          >
            <div className="max-w-xs">
              <h1 className="text-7xl font-bold">
                {config.StartTitle || "Tap for Wisdom"}
              </h1>
              <p className="mt-4 text-2xl">
                {config.StartReminder ||
                  "Your next reminder might be just one tap away."}
              </p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-4xl">
              {config.NumberTitle || "Your number is..."}
            </h2>
            <p
              className={cn(
                "text-9xl font-bold my-6",
                spinning && "animate-pulse delay-50"
              )}
            >
              {displayNumber ?? "--"}
            </p>
            {true && (
              <>
                <div className="text-2xl italic">
                  <ReactMarkdown>
                    {config.FlipPage ||
                      `Pick up **Kindling Hope** and flip to that page.  
Let the wisdom speak to you.`}
                  </ReactMarkdown>
                </div>
                <div className="flex gap-5 justify-center items-center">
                  {buttons.map((button, i) => {
                    console.log(button.link);
                    return (
                      <button
                        key={"Button" + i}
                        onClick={() => handleButton(button.link)}
                        className="mt-6 px-6 py-3 bg-white text-black rounded-full hover:bg-gray-300"
                      >
                        {button.name}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 w-full max-w-6xl">
            {events.map((event, i) => {
              console.log(event);
              return (
                <div
                  key={"Event" + i}
                  className="bg-white text-black rounded-lg shadow-lg p-4 flex flex-col items-center"
                >
                  <div className="relative w-full aspect-[3/4] mb-4">
                    <Image
                      src={event.image || "/background.png"}
                      alt={event.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{event.link}</p>
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                      Sign Up
                    </button>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
