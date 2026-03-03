import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Sparkles, Share2, Heart } from "lucide-react";
import { format } from "date-fns";
import type { Festival } from "./FestivalCard";

interface FestivalDetailProps {
  festival: Festival | null;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const FestivalDetail = ({ festival, onClose, isFavorite = false, onToggleFavorite }: FestivalDetailProps) => {
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
        <div className="relative h-[380px]">
          <img
            src={festival.image_url || "/placeholder.svg"}
            alt={festival.name}
            className="h-full w-full object-cover"
            onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-foreground/5" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

          {/* Top bar */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-2xl glass-strong shadow-elevated"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </motion.button>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onToggleFavorite}
                className="flex h-11 w-11 items-center justify-center rounded-2xl glass-strong shadow-elevated"
              >
                <Heart className={`h-4.5 w-4.5 transition-all ${isFavorite ? "fill-primary text-primary" : "text-foreground"}`} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl glass-strong shadow-elevated"
              >
                <Share2 className="h-4 w-4 text-foreground" />
              </motion.button>
            </div>
          </div>

          {/* Floating date card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute -bottom-5 right-4 flex flex-col items-center justify-center rounded-xl bg-primary px-3 py-2 shadow-festive min-w-[48px]"
          >
            <span className="text-[9px] font-bold text-primary-foreground/80 uppercase tracking-wider leading-none">{month}</span>
            <span className="text-xl font-black text-primary-foreground leading-tight">{day}</span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-4 pb-12 pt-3 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {festival.category && (
              <span className="inline-block rounded-full bg-primary/10 border border-primary/15 px-3 py-0.5 text-[11px] font-bold text-primary capitalize tracking-wide mb-2">
                {festival.category}
              </span>
            )}
            <h1 className="text-lg font-extrabold font-body text-foreground leading-tight pr-14">{festival.name}</h1>

            <div className="mt-3 flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">{festival.location}, {festival.province}</p>
                  <p className="text-xs text-muted-foreground">{festival.region}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">{dateLabel}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-7 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div>
              <h2 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <span className="h-1.5 w-5 rounded-full gradient-red inline-block" />
                About this Festival
              </h2>
              <p className="mt-3.5 text-[15px] leading-[1.8] text-foreground/75 text-justify font-body">{festival.description}</p>
            </div>

            {festival.highlights && festival.highlights.length > 0 && (
              <div className="mt-7">
                <h2 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <span className="h-1.5 w-5 rounded-full gradient-yellow inline-block" />
                  Highlights
                </h2>
                <div className="mt-3.5 flex flex-wrap gap-2.5">
                  {festival.highlights.map((h) => (
                    <motion.span
                      key={h}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1.5 rounded-2xl glass border border-primary/10 px-4 py-2.5 text-sm font-medium text-foreground"
                    >
                      <Sparkles className="h-3 w-3 text-secondary" />
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
