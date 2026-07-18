"use client";

import createGlobe from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [1, 1, 1],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

export function Globe({ className, config = GLOBE_CONFIG }) {
  const phi = useRef(0);
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteracting.current = clientX;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / 200);
    }
  };

  useEffect(() => {
    let globe;
    let mounted = true;
    let currentWidth = 0;

    const initGlobe = () => {
      if (!canvasRef.current || !mounted) return;

      // Ambil ukuran kanvas, pastikan tidak 0 untuk mencegah WebGL crash
      currentWidth = canvasRef.current.offsetWidth;
      if (currentWidth === 0) currentWidth = 600;

      globe = createGlobe(canvasRef.current, {
        ...config,
        width: currentWidth * 2,
        height: currentWidth * 2,
        onRender: (state) => {
          if (!mounted) return; // Hentikan render loop jika komponen sudah unmount

          // Proteksi: cegah NaN dari useSpring merusak memori matrix WebGL
          const springValue = rs.get();
          const safeSpring = isNaN(springValue) ? 0 : springValue;

          if (pointerInteracting.current === null) {
            phi.current += 0.005;
          }
          
          state.phi = phi.current + safeSpring;
          state.width = currentWidth * 2;
          state.height = currentWidth * 2;
        },
      });

      // Munculkan kanvas secara halus
      requestAnimationFrame(() => {
        if (canvasRef.current && mounted) {
          canvasRef.current.style.opacity = "1";
        }
      });
    };

    // Tunda inisialisasi selama 100ms. 
    // Ini adalah kunci utama untuk lolos dari "hantu" React Strict Mode!
    const mountTimeout = setTimeout(initGlobe, 100);

    const onResize = () => {
      if (canvasRef.current && mounted) {
        const w = canvasRef.current.offsetWidth;
        if (w > 0) currentWidth = w; 
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      mounted = false;
      clearTimeout(mountTimeout);
      window.removeEventListener("resize", onResize);
      if (globe) {
        globe.destroy();
      }
    };
  }, []); // Dependency dikosongkan secara absolut

  return (
    <div
      className={twMerge(
        "mx-auto aspect-square w-full max-w-[600px] flex items-center justify-center",
        className
      )}
    >
      <canvas
        className="block h-full w-full opacity-0 transition-opacity duration-1000 cursor-grab"
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onPointerMove={(e) => updateMovement(e.clientX)}
      />
    </div>
  );
}