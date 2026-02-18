import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CalendarDays, MapPin, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { format, addMonths, subMonths, isSameMonth, parseISO } from "date-fns";
import type { Festival } from "@/components/FestivalCard";

interface CalendarViewProps {
  festivals: Festival[];
  onBack: () => void;
  onSelectFestival: (festival: Festival) => void;
}

const MONTH_COLORS = [
  "gradient-festive", "gradient-royal", "gradient-warm", "gradient-teal",
  "gradient-gold", "gradient-festive", "gradient-royal", "gradient-warm",
  "gradient-teal", "gradient-gold", "gradient-festive", "gradient-royal",
];

const CalendarView = ({ festivals, onBack, onSelectFestival }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const festivalsThisMonth = useMemo(() => {
    return festivals.filter((f) => isSameMonth(parseISO(f.start_date), currentDate));
  }, [festivals, currentDate]);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { numDays, firstDay };
  }, [currentDate]);

  const festivalsByDay = useMemo(() => {
    const map: Record<number, Festival[]> = {};
    festivalsThisMonth.forEach((f) => {
      const day = parseISO(f.start_date).getDate();
      if (!map[day]) map[day] = [];
      map[day].push(f);
    });
    return map;
  }, [festivalsThisMonth]);

  const monthIdx = currentDate.getMonth();

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-40 bg-background overflow-y-auto"
    >
      {/* Header */}
      <div className={`relative overflow-hidden ${MONTH_COLORS[monthIdx]} px-6 pb-8 pt-14`}>
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary-foreground/10 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary-foreground/8 blur-2xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur-xl border border-primary-foreground/10"
          >
            <ArrowLeft className="h-5 w-5 text-primary-foreground" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-extrabold font-body text-primary-foreground">Festival Calendar</h1>
            <p className="text-xs text-primary-foreground/60 font-body mt-0.5">Browse by month</p>
          </div>
        </div>

        {/* Month navigator */}
        <div className="relative z-10 mt-6 flex items-center justify-between">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="h-10 w-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center backdrop-blur-sm">
            <ChevronLeft className="h-5 w-5 text-primary-foreground" />
          </motion.button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-primary-foreground font-body">{format(currentDate, "MMMM yyyy")}</h2>
            <p className="text-xs text-primary-foreground/60 mt-0.5">{festivalsThisMonth.length} festival{festivalsThisMonth.length !== 1 ? "s" : ""}</p>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="h-10 w-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center backdrop-blur-sm">
            <ChevronRight className="h-5 w-5 text-primary-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="px-6 pt-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-muted-foreground uppercase">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: daysInMonth.firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth.numDays }).map((_, i) => {
            const day = i + 1;
            const hasFestival = !!festivalsByDay[day];
            const isToday = day === new Date().getDate() && isSameMonth(currentDate, new Date());
            return (
              <motion.div
                key={day}
                whileTap={hasFestival ? { scale: 0.9 } : {}}
                onClick={() => {
                  if (hasFestival) onSelectFestival(festivalsByDay[day][0]);
                }}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-semibold cursor-pointer transition-all ${
                  hasFestival
                    ? "gradient-festive text-primary-foreground shadow-festive shimmer overflow-hidden"
                    : isToday
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-foreground/60 hover:bg-muted/50"
                }`}
              >
                <span className="relative z-10">{day}</span>
                {hasFestival && festivalsByDay[day].length > 1 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-festival-gold text-[8px] font-black text-foreground flex items-center justify-center z-10">
                    {festivalsByDay[day].length}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Festival list for this month */}
      <div className="px-6 pt-6 pb-10">
        <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-4">
          <span className="h-1.5 w-5 rounded-full gradient-festive inline-block" />
          Festivals in {format(currentDate, "MMMM")}
        </h3>
        <AnimatePresence mode="popLayout">
          {festivalsThisMonth.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-12 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mb-3 text-muted-foreground/30" />
              <p className="font-bold font-body">No festivals this month</p>
              <p className="text-sm mt-1 text-muted-foreground/70">Try navigating to another month</p>
            </motion.div>
          ) : (
            festivalsThisMonth.map((festival, i) => (
              <motion.div
                key={festival.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectFestival(festival)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card border border-border/50 mb-3 cursor-pointer group hover:shadow-elevated transition-all"
              >
                <div className="flex flex-col items-center rounded-xl gradient-festive px-3 py-2 shadow-festive min-w-[52px]">
                  <span className="text-[8px] font-extrabold text-primary-foreground/70 uppercase tracking-widest">
                    {format(parseISO(festival.start_date), "MMM").toUpperCase()}
                  </span>
                  <span className="text-xl font-black text-primary-foreground leading-tight">
                    {format(parseISO(festival.start_date), "d")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold font-body text-card-foreground truncate">{festival.name}</h4>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="truncate">{festival.location}, {festival.province}</span>
                  </div>
                </div>
                <Sparkles className="h-4 w-4 text-festival-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CalendarView;
