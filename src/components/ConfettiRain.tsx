import { motion } from "framer-motion";
import { useMemo } from "react";

const CONFETTI_COLORS = [
  "hsl(42 95% 54%)",   // gold
  "hsl(18 90% 52%)",   // primary
  "hsl(338 80% 52%)",  // magenta
  "hsl(168 70% 34%)",  // teal
  "hsl(252 65% 50%)",  // indigo
  "hsl(0 0% 100%)",    // white
  "hsl(350 85% 60%)",  // rose
  "hsl(36 100% 50%)",  // amber
];

const SHAPES = ["rounded-full", "rounded-sm", "rounded-none rotate-45"];

interface ConfettiRainProps {
  count?: number;
  className?: string;
}

const ConfettiRain = ({ count = 25, className = "" }: ConfettiRainProps) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        shape: SHAPES[i % SHAPES.length],
        size: Math.random() * 8 + 4,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 6,
        startY: -10 - Math.random() * 20,
        drift: Math.random() * 60 - 30,
      })),
    [count]
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute ${p.shape}`}
          style={{
            width: p.size,
            height: p.size * (p.shape.includes("full") ? 1 : 0.6),
            background: p.color,
            left: p.left,
            top: `${p.startY}%`,
          }}
          animate={{
            y: [0, window.innerHeight * 1.2],
            x: [0, p.drift],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [0.9, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiRain;
