import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import splashBg from "@/assets/splash-bg.jpg";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 600);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${splashBg})` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-foreground/50" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Animated confetti dots */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 10 + 6,
                  height: Math.random() * 10 + 6,
                  background: [
                    "hsl(15 85% 55%)",
                    "hsl(42 92% 56%)",
                    "hsl(340 75% 55%)",
                    "hsl(170 65% 36%)",
                    "hsl(250 60% 52%)",
                  ][i % 5],
                  top: `${Math.random() * 100 - 50}%`,
                  left: `${Math.random() * 100 - 50}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 1.5,
                }}
              />
            ))}

            {/* Logo */}
            <motion.h1
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="font-display text-7xl font-bold text-primary-foreground drop-shadow-lg"
            >
              SeekLakaw
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-lg font-body font-light tracking-widest text-primary-foreground/80 uppercase"
            >
              Discover Philippine Festivals
            </motion.p>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-primary-foreground/20"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className="h-full w-full gradient-warm rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
