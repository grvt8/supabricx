import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type Dot = {
  x: number;
  y: number;
  z: number;
};

const GRID = 5;
const SPACING = 22;

export default function LivingDotLogo() {
  const [cubeMode, setCubeMode] = useState(false);

  const dots = useMemo<Dot[]>(() => {
    const result: Dot[] = [];
    const offset = ((GRID - 1) * SPACING) / 2;

    for (let x = 0; x < GRID; x++) {
      for (let y = 0; y < GRID; y++) {
        for (let z = 0; z < GRID; z++) {
          // Sphere mask (matches your image)
          const dx = x - (GRID - 1) / 2;
          const dy = y - (GRID - 1) / 2;
          const dz = z - (GRID - 1) / 2;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < GRID / 1.5) {
            result.push({
              x: x * SPACING - offset,
              y: y * SPACING - offset,
              z: z * SPACING - offset,
            });
          }
        }
      }
    }
    return result;
  }, []);

  return (
    <div
      onClick={() => setCubeMode(!cubeMode)}
      style={{
        width: 300,
        height: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 900,
        cursor: "pointer",
      }}
    >
      <motion.div
        animate={{
          rotateX: cubeMode ? 45 : 0,
          rotateY: cubeMode ? 45 : 0,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{
          position: "relative",
          width: 200,
          height: 200,
          transformStyle: "preserve-3d",
        }}
      >
        {dots.map((dot, i) => (
          <motion.span
            key={i}
            animate={{
              x: cubeMode ? dot.x : dot.x * 0.6,
              y: cubeMode ? dot.y : dot.y * 0.6,
              z: cubeMode ? dot.z : 0,
              scale: [1, 1.2, 1],
              opacity: cubeMode ? 1 : 0.9,
            }}
            transition={{
              duration: cubeMode ? 1.2 : 2.5,
              repeat: cubeMode ? 0 : Infinity,
              repeatType: "mirror",
              delay: i * 0.01,
            }}
            style={{
              position: "absolute",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#EDEFFF",
              left: "50%",
              top: "50%",
              transform: "translate3d(0,0,0)",
              boxShadow: "0 0 8px rgba(255,255,255,0.6)",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
