import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, LogOut, MapPin, Sparkles, Flame, Star, CalendarDays, ChevronRight, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import FestivalCard from "@/components/FestivalCard";
import FestivalDetail from "@/components/FestivalDetail";
import type { Festival } from "@/components/FestivalCard";
import { toast } from "sonner";
import { format } from "date-fns";

const categories = [
  { label: "All", icon: Sparkles, gradient: "gradient-festive" },
  { label: "Religious", icon: Star, gradient: "gradient-warm" },
  { label: "Cultural", icon: Flame, gradient: "gradient-festive" },
  { label: "Harvest", icon: CalendarDays, gradient: "gradient-teal" },
];

const FeaturedCard = ({ festival, onClick }: { festival: Festival; onClick: () => void }) => {
  const startDate = new Date(festival.start_date);
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative flex-shrink-0 w-[280px] h-[340px] rounded-3xl overflow-hidden cursor-pointer snap-center"
    >
      <img
        src={festival.image_url || "/placeholder.svg"}
        alt={festival.name}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {festival.category && (
          <span className="inline-block rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-primary-foreground uppercase tracking-wider mb-2">
            {festival.category}
          </span>
        )}
        <h3 className="text-xl font-bold text-primary-foreground leading-tight line-clamp-2 font-body">
          {festival.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-primary-foreground/70" />
          <span className="text-xs text-primary-foreground/80 font-body">{festival.location}, {festival.province}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-primary-foreground/70" />
          <span className="text-xs text-primary-foreground/80 font-body">{format(startDate, "MMM d, yyyy")}</span>
        </div>
      </div>
    </motion.div>
  );
};

const Index = () => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.92]);

  useEffect(() => {
    const fetchFestivals = async () => {
      const { data, error } = await supabase
        .from("festivals")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) {
        toast.error("Failed to load festivals");
        console.error(error);
      } else {
        setFestivals(data as Festival[]);
      }
      setLoading(false);
    };

    fetchFestivals();
  }, []);

  const filtered = useMemo(() => {
    return festivals.filter((f) => {
      const matchSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.location.toLowerCase().includes(search.toLowerCase()) ||
        f.province.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        activeCategory === "All" ||
        f.category?.toLowerCase() === activeCategory.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [festivals, search, activeCategory]);

  const featured = useMemo(() => {
    const now = new Date();
    return festivals
      .filter((f) => new Date(f.start_date) >= now)
      .slice(0, 6);
  }, [festivals]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  const upcomingCount = festivals.filter(f => new Date(f.start_date) >= new Date()).length;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Hero Header */}
      <motion.div
        ref={headerRef}
        style={{ opacity: headerOpacity }}
        className="relative overflow-hidden gradient-festive px-6 pb-6 pt-14"
      >
        {/* Animated decorative elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-primary-foreground/10 blur-xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary-foreground/10 blur-lg"
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-24 right-10 h-4 w-4 rounded-full bg-festival-gold/40"
        />
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute top-16 right-24 h-3 w-3 rounded-full bg-primary-foreground/20"
        />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-display text-5xl font-bold text-primary-foreground drop-shadow-lg"
            >
              SeekLakaw
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-1 text-sm text-primary-foreground/80 font-body"
            >
              Your guide to Philippine Fiestas 🎊
            </motion.p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-md border border-primary-foreground/10"
          >
            <LogOut className="h-5 w-5 text-primary-foreground" />
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mt-5 z-10">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search festivals, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 bg-background/95 backdrop-blur-md border-0 h-13 rounded-2xl font-body shadow-lg text-base"
          />
        </div>

        {/* Stats pills */}
        <div className="relative z-10 mt-4 flex gap-2.5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1.5 rounded-full bg-primary-foreground/15 backdrop-blur-sm px-3 py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-festival-gold" />
            <span className="text-[11px] font-semibold text-primary-foreground">{festivals.length} Festivals</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-1.5 rounded-full bg-primary-foreground/15 backdrop-blur-sm px-3 py-1.5"
          >
            <TrendingUp className="h-3.5 w-3.5 text-festival-teal" />
            <span className="text-[11px] font-semibold text-primary-foreground">{upcomingCount} Upcoming</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Carousel */}
      {!search && activeCategory === "All" && featured.length > 0 && (
        <div className="mt-5">
          <div className="px-6 mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold font-body text-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              Upcoming Fiestas
            </h2>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 pb-2 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {featured.map((festival) => (
              <FeaturedCard
                key={festival.id}
                festival={festival}
                onClick={() => setSelectedFestival(festival)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="px-6 py-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
          <span className="h-1 w-4 rounded-full gradient-festive inline-block" />
          Browse by Category
        </p>
        <div className="grid grid-cols-4 gap-2">
          {categories.map(({ label, icon: Icon }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(label)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2 text-xs font-semibold font-body transition-all duration-200 ${
                activeCategory === label
                  ? "gradient-festive text-primary-foreground shadow-festive scale-[1.02]"
                  : "bg-card text-muted-foreground shadow-card hover:bg-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Section title */}
      <div className="px-6 mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold font-body text-foreground">
          {activeCategory === "All" ? "All Festivals" : `${activeCategory} Festivals`}
        </h2>
        <span className="text-xs text-muted-foreground font-body bg-muted px-2.5 py-1 rounded-full">{filtered.length} found</span>
      </div>

      {/* Festival Grid */}
      <div className="px-6">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 flex flex-col items-center text-muted-foreground"
          >
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <MapPin className="h-12 w-12 text-muted-foreground/40" />
            </div>
            <p className="text-lg font-semibold font-body">No festivals found</p>
            <p className="text-sm mt-1 font-body">Try a different search or category</p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3.5">
            <AnimatePresence mode="popLayout">
              {filtered.map((festival, i) => (
                <FestivalCard
                  key={festival.id}
                  festival={festival}
                  index={i}
                  onClick={() => setSelectedFestival(festival)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail View */}
      {selectedFestival && (
        <FestivalDetail
          festival={selectedFestival}
          onClose={() => setSelectedFestival(null)}
        />
      )}
    </div>
  );
};

export default Index;
