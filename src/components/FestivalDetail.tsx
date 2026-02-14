import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Sparkles, Share2 } from "lucide-react";
import { format } from "date-fns";
import type { Festival } from "./FestivalCard";

interface FestivalDetailProps {
  festival: Festival | null;
  onClose: () => void;
}

const FestivalDetail = ({ festival, onClose }: FestivalDetailProps) => {
  if (!festival) return null;

  const startDate = new Date(festival.start_date);
  const endDate = festival.end_date ? new Date(festival.end_date) : null;
  const dateLabel =
    endDate && endDate.getTime() !== startDate.getTime()
      ? `${format(startDate, "MMMM d")} – ${format(endDate, "MMMM d, yyyy")}`
      : format(startDate, "MMMM d, yyyy");

  const month = format(startDate, "MMM").toUpperCase();
  const day = format(startDate, "d");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-40 bg-background overflow-y-auto"
      >
        {/* Hero image */}
        <div className="relative h-80">
          <img
            src={festival.image_url || "/placeholder.svg"}
            alt={festival.name}
            className="h-full w-full object-cover"
            onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-foreground/10" />

          {/* Top bar */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
            >
              <Share2 className="h-4 w-4 text-foreground" />
            </motion.button>
          </div>

          {/* Floating date card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-6 right-6 flex flex-col items-center rounded-2xl gradient-festive px-4 py-3 shadow-festive"
          >
            <span className="text-[10px] font-bold text-primary-foreground/80 uppercase tracking-wider">{month}</span>
            <span className="text-2xl font-extrabold text-primary-foreground leading-tight">{day}</span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-6 pb-10 pt-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {festival.category && (
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary capitalize tracking-wide mb-3">
                {festival.category}
              </span>
            )}
            <h1 className="text-2xl font-bold font-body text-foreground leading-tight">{festival.name}</h1>

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{festival.location}, {festival.province}</p>
                  <p className="text-xs text-muted-foreground">{festival.region}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10">
                  <Calendar className="h-4 w-4 text-secondary" />
                </div>
                <p className="text-sm font-medium text-foreground">{dateLabel}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-border" />

            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <span className="h-1 w-3 rounded-full gradient-festive inline-block" />
                About this Festival
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/80 text-justify font-body">{festival.description}</p>
            </div>

            {festival.highlights && festival.highlights.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1 w-3 rounded-full gradient-warm inline-block" />
                  Highlights
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {festival.highlights.map((h) => (
                    <motion.span
                      key={h}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-2 text-sm font-medium text-primary"
                    >
                      <Sparkles className="h-3 w-3" />
                      {h}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FestivalDetail;
