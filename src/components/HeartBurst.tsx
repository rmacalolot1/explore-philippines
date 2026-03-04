import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

interface HeartBurstProps {
  children: React.ReactNode;
  onTap: () => void;
  className?: string;
}

const PARTICLES = 8;

const HeartBurst = ({ children, onTap, className = "" }: HeartBurstProps) => {
  const [bursts, setBursts] = useState<number[]>([]);

  const handleTap = useCallback(() => {
    const id = Date.now();
    setBursts((prev) => [...prev, id]);
    onTap();
    setTimeout(() => setBursts((prev) => prev.filter((b) => b !== id)), 600);
  }, [onTap]);

  return (
    <div className={`relative ${className}`}>
      <div onClick={handleTap}>{children}</div>
      <AnimatePresence>
        {bursts.map((id) => (
          <div key={id} className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {Array.from({ length: PARTICLES }).map((_, i) => {
              const angle = (i / PARTICLES) * 360;
              const rad = (angle * Math.PI) / 180;
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0.5],
                    x: Math.cos(rad) * 20,
                    y: Math.sin(rad) * 20,
                    opacity: [1, 0.8, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute h-1.5 w-1.5 rounded-full bg-primary"
                />
              );
            })}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default HeartBurst;
