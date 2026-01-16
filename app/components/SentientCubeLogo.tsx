import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PIECES = 18;

export default function SentientCubeLogo() {
  const [explode, setExplode] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setExplode(true);
      setTimeout(() => setExplode(false), 1600);
    }, 5200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setEyeOffset({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      style={{
        width: 260,
        height: 260,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 1000,
      }}
    >
      <motion.div
        animate={{
          rotateX: explode ? 25 : 0,
          rotateY: explode ? -30 : 0,
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{
          position: "relative",
          width: 140,
          height: 140,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Core cube */}
        <motion.div
          animate={{
            x: explode ? 0 : [0, -1, 1, 0],
            y: explode ? 0 : [0, 1, -1, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: explode ? 0 : Infinity,
          }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #3a7bff, #1b2cff)",
            boxShadow: "0 0 40px rgba(80,120,255,0.6)",
            borderRadius: 6,
          }}
        >
          {/* Eyes */}
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "32%",
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#dff6ff",
              transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
              boxShadow: "0 0 12px #9fdfff",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "40%",
              right: "32%",
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#dff6ff",
              transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
              boxShadow: "0 0 12px #9fdfff",
            }}
          />
        </motion.div>

        {/* Fragment cubes */}
        {[...Array(PIECES)].map((_, i) => {
          const angle = (i / PIECES) * Math.PI * 2;
          const radius = 80;

          return (
            <motion.div
              key={i}
              animate={{
                x: explode ? Math.cos(angle) * radius : 0,
                y: explode ? Math.sin(angle) * radius : 0,
                z: explode ? (i % 2 === 0 ? 60 : -60) : 0,
                rotateX: explode ? 180 : 0,
                rotateY: explode ? 180 : 0,
                opacity: explode ? 1 : 0,
              }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: 22,
                height: 22,
                background:
                  "linear-gradient(135deg, #4fa3ff, #1a3cff)",
                boxShadow:
                  "0 0 20px rgba(90,140,255,0.8)",
                borderRadius: 4,
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
