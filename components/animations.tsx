"use client";

import { useEffect, useState } from "react";

export function DashboardAnimation() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dashboardChase {
          0% { transform: translateX(110vw); }
          100% { transform: translateX(-50vw); }
        }
        .anim-container-bottom {
          position: absolute;
          bottom: 0px;
          left: 0;
          width: 100vw;
          height: 120px;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }
        .anim-sprite-1 {
          position: absolute;
          height: 60px;
          width: auto;
          bottom: 10px;
          animation: dashboardChase 15s linear infinite;
        }
        .anim-sprite-2 {
          position: absolute;
          height: 60px;
          width: auto;
          bottom: 10px;
          margin-left: 150px;
          animation: dashboardChase 15s linear infinite;
        }
      `}} />
      <div className="anim-container-bottom">
        {/* Nyan Cat */}
        <img src="https://media.tenor.com/fGQjBvX5620AAAAj/nyan-cat.gif" className="anim-sprite-2" alt="Nyan Cat" />
        {/* Pikachu */}
        <img src="https://media.tenor.com/vHqT8Sls07AAAAAj/pikachu-running.gif" className="anim-sprite-1" alt="Pikachu" style={{ transform: "scaleX(-1)" }} />
      </div>
    </>
  );
}
