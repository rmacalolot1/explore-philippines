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
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${splashBg})` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-foreground/55" />
          {/* Gradient accents */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-accent/10" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Animated confetti dots */}
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 8 + 5,
                  height: Math.random() * 8 + 5,
                  background: [
                    "hsl(18 90% 52%)",
                    "hsl(42 95% 54%)",
                    "hsl(338 80% 52%)",
                    "hsl(168 70% 34%)",
                    "hsl(252 65% 50%)",
                    "hsl(0 0% 100%)",
                  ][i % 6],
                  top: `${Math.random() * 120 - 60}%`,
                  left: `${Math.random() * 120 - 60}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, Math.random() * 24 - 12, 0],
                  opacity: [0.2, 0.9, 0.2],
                  scale: [0.6, 1.4, 0.6],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 2,
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
              className="text-base font-body font-light tracking-[0.25em] text-primary-foreground/75 uppercase"
            >
              Discover Philippine Festivals
            </motion.p>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-10 h-1 w-52 overflow-hidden rounded-full bg-primary-foreground/15"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className="h-full w-full gradient-gold rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
