import { motion } from "framer-motion";
import { PartyPopper, Sparkles, Music } from "lucide-react";

const FeastBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring" }}
      className="mx-6 mt-4 relative overflow-hidden rounded-3xl gradient-feast p-4 shadow-festive shimmer"
    >
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary-foreground/10 blur-xl" />
      <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-primary-foreground/8 blur-lg" />

      <div className="relative z-10 flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm"
        >
          <PartyPopper className="h-6 w-6 text-primary-foreground" />
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-extrabold text-primary-foreground font-body">
              🎊 Fiesta Season is Here!
            </h3>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground/80" />
            </motion.div>
          </div>
          <p className="text-[11px] text-primary-foreground/70 mt-0.5 font-body">
            Explore vibrant celebrations across the Philippines
          </p>
        </div>
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Music className="h-5 w-5 text-primary-foreground/60" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeastBanner;
