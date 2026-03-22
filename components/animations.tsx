"use client";

import { useEffect, useState } from "react";

export function HorseAnimation() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes horseChase {
          0% { transform: translateX(-20vw) translateY(5vh); }
          25% { transform: translateX(120vw) translateY(15vh); }
          26% { transform: translateX(120vw) scaleX(-1) translateY(70vh); }
          75% { transform: translateX(-20vw) scaleX(-1) translateY(50vh); }
          76% { transform: translateX(-20vw) scaleX(1) translateY(5vh); }
          100% { transform: translateX(-20vw) translateY(5vh); }
        }
        @keyframes alienFlee {
          0% { transform: translateX(0vw) translateY(5vh); }
          25% { transform: translateX(140vw) translateY(15vh); }
          26% { transform: translateX(140vw) scaleX(-1) translateY(70vh); }
          75% { transform: translateX(0vw) scaleX(-1) translateY(50vh); }
          76% { transform: translateX(0vw) scaleX(1) translateY(5vh); }
          100% { transform: translateX(0vw) translateY(5vh); }
        }
        .horse-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }
        .anim-horse {
          position: absolute;
          width: 140px;
          height: auto;
          animation: horseChase 12s linear infinite;
          filter: drop-shadow(4px 4px 10px rgba(0,0,0,0.4));
        }
        .anim-alien {
          position: absolute;
          width: 110px;
          height: auto;
          animation: alienFlee 12s linear infinite;
          filter: drop-shadow(4px 4px 10px rgba(0,0,0,0.4));
          margin-left: 200px;
        }
      `}} />
      <div className="horse-container">
        {/* Usando media transparent images com fallbacks via CDN global */}
        <img src="https://media.giphy.com/media/xUPGcxpCV81ebKhpnG/giphy.gif" alt="Alien UFO" className="anim-alien" />
        <img src="https://media.giphy.com/media/3o7TKsWpEnbEqV49xu/giphy.gif" alt="Horse" className="anim-horse" style={{ transform: "scaleX(-1)" }} />
      </div>
    </>
  );
}
