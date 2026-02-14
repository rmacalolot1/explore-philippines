import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface Festival {
  id: string;
  name: string;
  description: string;
  location: string;
  province: string;
  region: string;
  start_date: string;
  end_date: string | null;
  image_url: string | null;
  category: string | null;
  highlights: string[] | null;
}

interface FestivalCardProps {
  festival: Festival;
  index: number;
  onClick: () => void;
}

const categoryColors: Record<string, string> = {
  religious: "bg-festival-indigo text-primary-foreground",
  cultural: "bg-festival-magenta text-primary-foreground",
  harvest: "bg-festival-teal text-primary-foreground",
  festival: "bg-festival-gold text-foreground",
};

const FestivalCard = ({ festival, index, onClick }: FestivalCardProps) => {
  const startDate = new Date(festival.start_date);
  const endDate = festival.end_date ? new Date(festival.end_date) : null;

  const dateLabel =
    endDate && endDate.getTime() !== startDate.getTime()
      ? `${format(startDate, "MMM d")} – ${format(endDate, "MMM d, yyyy")}`
      : format(startDate, "MMM d, yyyy");

  const month = format(startDate, "MMM").toUpperCase();
  const day = format(startDate, "d");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.35 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-festive transition-all duration-300"
    >
      <div className="flex">
        {/* Left: Image with overlay */}
        <div className="relative h-[130px] w-[120px] flex-shrink-0 overflow-hidden">
          <img
            src={festival.image_url || "/placeholder.svg"}
            alt={festival.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/20" />
          {/* Date badge */}
          <div className="absolute top-2 left-2 flex flex-col items-center rounded-xl bg-background/90 backdrop-blur-sm px-2 py-1 shadow-sm">
            <span className="text-[9px] font-bold text-primary uppercase leading-none tracking-wider">{month}</span>
            <span className="text-lg font-extrabold text-foreground leading-tight">{day}</span>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-1 flex-col justify-between p-3 min-w-0">
          <div>
            {festival.category && (
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold capitalize mb-1 tracking-wide ${categoryColors[festival.category] || "bg-primary text-primary-foreground"}`}
              >
                {festival.category}
              </span>
            )}
            <h3 className="text-[15px] font-bold font-body text-card-foreground leading-snug line-clamp-2">
              {festival.name}
            </h3>
          </div>

          <div className="mt-auto flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="truncate">{festival.location}, {festival.province}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3 text-secondary flex-shrink-0" />
                <span>{dateLabel}</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export type { Festival };
export default FestivalCard;
