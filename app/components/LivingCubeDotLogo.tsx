import { motion } from "framer-motion";
import { useMemo } from "react";

type Cube = {
  x: number;
  y: number;
  z: number;
  delay: number;
};

const GRID = 5;
const SPACING = 14;
const CUBE_SIZE = 5;

export default function LivingCubeDotLogo() {
  const cubes = useMemo<Cube[]>(() => {
    const result: Cube[] = [];
    const center = (GRID - 1) / 2;

    for (let x = 0; x < GRID; x++) {
      for (let y = 0; y < GRID; y++) {
        for (let z = 0; z < GRID; z++) {
          const dx = x - center;
          const dy = y - center;
          const dz = z - center;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Sphere mask
          if (dist <= GRID / 1.45) {
            result.push({
              x: dx * SPACING,
              y: dy * SPACING,
              z: dz * SPACING,
              delay: dist * 0.15, // center → outward propagation
            });
          }
        }
      }
    }
    return result;
  }, []);

  return (
    <div
      style={{
        width: 180,
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 800,
      }}
    >
      <motion.div
        animate={{
          rotateX: [0, 8, 0],
          rotateY: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "relative",
          width: 120,
          height: 120,
          transformStyle: "preserve-3d",
        }}
      >
        {cubes.map((cube, i) => (
          <motion.div
            key={i}
            animate={{
              x: cube.x,
              y: cube.y,
              z: cube.z,
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              repeatType: "mirror",
              delay: cube.delay,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: CUBE_SIZE,
              height: CUBE_SIZE,
              left: "50%",
              top: "50%",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front face */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, #eef2ff, #aab4ff)",
                boxShadow: "0 0 6px rgba(150,180,255,0.7)",
                transform: `translateZ(${CUBE_SIZE / 2}px)`,
              }}
            />

            {/* Side shading */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(120,150,255,0.25)",
                transform: `rotateY(90deg) translateZ(${CUBE_SIZE / 2}px)`,
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(80,110,255,0.35)",
                transform: `rotateX(90deg) translateZ(${CUBE_SIZE / 2}px)`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
