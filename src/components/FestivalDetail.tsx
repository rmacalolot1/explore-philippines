import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
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
        <div className="relative h-72">
          <img
            src={festival.image_url || "/placeholder.svg"}
            alt={festival.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-foreground/20" />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-10 -mt-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold font-body text-foreground">{festival.name}</h1>

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{festival.location}, {festival.province}</p>
                  <p className="text-xs text-muted-foreground">{festival.region}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
                  <Calendar className="h-4 w-4 text-secondary" />
                </div>
                <p className="text-sm font-medium text-foreground">{dateLabel}</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">About</h2>
              <p className="mt-2 text-base leading-relaxed text-foreground/80 text-justify">{festival.description}</p>
            </div>

            {festival.highlights && festival.highlights.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Highlights</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {festival.highlights.map((h) => (
                    <span
                      key={h}
                      className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
                    >
                      <Sparkles className="h-3 w-3" />
                      {h}
                    </span>
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
