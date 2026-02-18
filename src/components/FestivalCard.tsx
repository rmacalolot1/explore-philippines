import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight, Heart } from "lucide-react";
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
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const categoryColors: Record<string, string> = {
  religious: "bg-festival-indigo/15 text-festival-indigo border border-festival-indigo/20",
  cultural: "bg-festival-magenta/15 text-festival-magenta border border-festival-magenta/20",
  harvest: "bg-festival-teal/15 text-festival-teal border border-festival-teal/20",
  festival: "bg-festival-gold/15 text-festival-gold border border-festival-gold/20",
};

const FestivalCard = ({ festival, index, onClick, isFavorite = false, onToggleFavorite }: FestivalCardProps) => {
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
      className="group cursor-pointer overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-400 border border-border/50"
    >
      <div className="flex">
        {/* Left: Image */}
        <div className="relative h-[135px] w-[115px] flex-shrink-0 overflow-hidden">
          <img
            src={festival.image_url || "/placeholder.svg"}
            alt={festival.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
            onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/10" />
          {/* Date badge */}
          <div className="absolute top-2 left-2 flex flex-col items-center rounded-xl gradient-festive px-2.5 py-1.5 shadow-festive">
            <span className="text-[8px] font-extrabold text-primary-foreground/80 uppercase leading-none tracking-widest">{month}</span>
            <span className="text-lg font-black text-primary-foreground leading-tight">{day}</span>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-1 flex-col justify-between p-3.5 min-w-0">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {festival.category && (
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold capitalize mb-1.5 tracking-wide ${categoryColors[festival.category] || "bg-primary/15 text-primary border border-primary/20"}`}
                  >
                    {festival.category}
                  </span>
                )}
                <h3 className="text-[15px] font-bold font-body text-card-foreground leading-snug line-clamp-2">
                  {festival.name}
                </h3>
              </div>
              {onToggleFavorite && (
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                  className="ml-2 flex-shrink-0 mt-1"
                >
                  <Heart className={`h-4.5 w-4.5 transition-all ${isFavorite ? "fill-festival-rose text-festival-rose scale-110" : "text-muted-foreground/40 hover:text-festival-rose/60"}`} />
                </motion.button>
              )}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="truncate font-medium">{festival.location}, {festival.province}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3 text-secondary flex-shrink-0" />
                <span>{dateLabel}</span>
              </div>
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export type { Festival };
export default FestivalCard;
