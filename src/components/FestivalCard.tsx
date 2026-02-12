import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
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
  religious: "bg-festival-indigo",
  cultural: "bg-festival-magenta",
  harvest: "bg-festival-teal",
  festival: "bg-festival-gold",
};

const FestivalCard = ({ festival, index, onClick }: FestivalCardProps) => {
  const startDate = new Date(festival.start_date);
  const endDate = festival.end_date ? new Date(festival.end_date) : null;

  const dateLabel =
    endDate && endDate.getTime() !== startDate.getTime()
      ? `${format(startDate, "MMM d")} – ${format(endDate, "MMM d, yyyy")}`
      : format(startDate, "MMM d, yyyy");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-festive transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={festival.image_url || "/placeholder.svg"}
          alt={festival.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        {festival.category && (
          <span
            className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground capitalize ${categoryColors[festival.category] || "bg-primary"}`}
          >
            {festival.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold font-body text-card-foreground leading-tight">
          {festival.name}
        </h3>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span>{festival.location}, {festival.province}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-secondary" />
          <span>{dateLabel}</span>
        </div>
      </div>
    </motion.div>
  );
};

export type { Festival };
export default FestivalCard;
