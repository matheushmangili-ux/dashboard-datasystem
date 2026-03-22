"use client";

import { useEffect, useState } from "react";

const GAMEBOY_COLORS: Record<string, string> = {
  "1": "#0f380f", // Darkest green (Outlines)
  "2": "#9bbc0f", // Light bright green (Highlights)
  "3": "#8bac0f", // Mid-light green
  "4": "#306230", // Mid-dark green (Shadows)
};

const UFO_PIXELS = [
  "     111111     ",
  "    12222221    ",
  "   1222222221   ",
  "  111111111111  ",
  " 14444444444441 ",
  "1112111211121111",
  "1222222222222221",
  " 11111111111111 ",
  "   1  1  1  1   ",
  "  1   1  1   1  ",
  " 1    1  1    1 "
];

const HORSE_PIXELS = [
  "            11  ",
  "           1211 ",
  "           11111",
  "          11111 ",
  "        11114   ",
  "     11111114   ",
  "    111111114   ",
  "   111111111    ",
  "   11  111 1    ",
  "   1   11  1    ",
  "  1    1   1    ",
  "  1   1    1    ",
  " 11   1    1    ",
  " 11  11   11    "
];

function PixelSprite({ matrix, size = 6, style, className }: { matrix: string[], size?: number, style?: React.CSSProperties, className?: string }) {
  const width = Math.max(...matrix.map(row => row.length)) * size;
  const height = matrix.length * size;
  
  return (
    <svg 
      className={className}
      style={style}
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`} 
      xmlns="http://www.w3.org/2000/svg" 
      shapeRendering="crispEdges"
    >
      {matrix.map((row, y) => 
        row.split('').map((char, x) => 
          GAMEBOY_COLORS[char] ? (
            <rect key={`${x}-${y}`} x={x * size} y={y * size} width={size} height={size} fill={GAMEBOY_COLORS[char]} />
          ) : null
        )
      )}
    </svg>
  );
}

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
        @keyframes pixelBounce {
          0% { margin-top: 0px; }
          50% { margin-top: -12px; }
          100% { margin-top: 0px; }
        }
        @keyframes hoverUfo {
          0% { margin-top: 0px; }
          50% { margin-top: -6px; }
          100% { margin-top: 0px; }
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
        .anim-group {
          position: absolute;
          will-change: transform;
        }
        .group-horse {
          animation: horseChase 15s linear infinite;
        }
        .group-alien {
          animation: alienFlee 15s linear infinite;
          margin-left: 180px;
        }
        .anim-alien {
          animation: hoverUfo 0.8s steps(2, end) infinite;
          filter: drop-shadow(4px 4px 0px rgba(15, 56, 15, 0.4));
        }
        .anim-horse {
          animation: pixelBounce 0.4s steps(2, start) infinite;
          filter: drop-shadow(4px 4px 0px rgba(15, 56, 15, 0.4));
        }
      `}} />
      <div className="horse-container">
        {/* UFO with hover animation inside the linear tracking animation */}
        <div className="anim-group group-alien">
          <PixelSprite matrix={UFO_PIXELS} size={8} className="anim-alien" />
        </div>
        
        {/* Horse with bounce animation inside the linear tracking animation */}
        <div className="anim-group group-horse" style={{ transform: "scaleX(-1)" }}>
          <PixelSprite matrix={HORSE_PIXELS} size={8} className="anim-horse" />
        </div>
      </div>
    </>
  );
}
