import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LogOut, MapPin, Sparkles, Flame, Star, CalendarDays, ChevronRight, TrendingUp, Crown, Heart, PartyPopper } from "lucide-react";
import { Input } from "@/components/ui/input";
import FestivalCard from "@/components/FestivalCard";
import FestivalDetail from "@/components/FestivalDetail";
import CalendarView from "@/pages/CalendarView";
import ConfettiRain from "@/components/ConfettiRain";
import FeastBanner from "@/components/FeastBanner";
import { useFavorites } from "@/hooks/useFavorites";
import type { Festival } from "@/components/FestivalCard";
import { toast } from "sonner";
import { format } from "date-fns";

const categories = [
  { label: "All", icon: Sparkles, gradient: "gradient-festive" },
  { label: "Religious", icon: Star, gradient: "gradient-royal" },
  { label: "Cultural", icon: Flame, gradient: "gradient-festive" },
  { label: "Harvest", icon: CalendarDays, gradient: "gradient-teal" },
];

const FeaturedCard = ({ festival, onClick, isFav, onToggleFav }: { festival: Festival; onClick: () => void; isFav: boolean; onToggleFav: () => void }) => {
  const startDate = new Date(festival.start_date);
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="relative flex-shrink-0 w-[260px] h-[360px] rounded-3xl overflow-hidden cursor-pointer snap-center group"
    >
      <img
        src={festival.image_url || "/placeholder.svg"}
        alt={festival.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
        <div className="glass-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5">
          <CalendarDays className="h-3 w-3 text-primary" />
          <span className="text-[10px] font-bold text-foreground">{format(startDate, "MMM d")}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
          className="flex h-9 w-9 items-center justify-center rounded-xl glass-strong"
        >
          <Heart className={`h-4 w-4 transition-colors ${isFav ? "fill-festival-rose text-festival-rose" : "text-primary-foreground/70"}`} />
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        {festival.category && (
          <span className="inline-block rounded-full gradient-gold shimmer px-3 py-0.5 text-[9px] font-extrabold text-foreground uppercase tracking-widest mb-2.5">
            {festival.category}
          </span>
        )}
        <h3 className="text-lg font-bold text-primary-foreground leading-tight line-clamp-2 font-body drop-shadow-md">
          {festival.name}
        </h3>
        <div className="mt-2 flex items-center gap-1.5">
          <MapPin className="h-3 w-3 text-festival-gold" />
          <span className="text-[11px] text-primary-foreground/80 font-medium font-body">{festival.location}, {festival.province}</span>
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
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite, favoriteIds } = useFavorites();

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
      const matchFav = !showFavoritesOnly || isFavorite(f.id);
      return matchSearch && matchCategory && matchFav;
    });
  }, [festivals, search, activeCategory, showFavoritesOnly, isFavorite]);

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
  const favCount = favoriteIds.size;

  return (
    <div className="min-h-screen bg-background pb-8 relative">
      {/* Confetti rain */}
      <ConfettiRain count={20} />

      {/* Hero Header */}
      <div className="relative overflow-hidden gradient-festive px-6 pb-8 pt-14">
        {/* Decorative glow orbs */}
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-festival-gold/15 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary-foreground/8 blur-2xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-0 h-32 w-32 rounded-full bg-accent/10 blur-2xl animate-pulse-glow" style={{ animationDelay: '3s' }} />

        {/* Sparkle dots */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute animate-sparkle"
            style={{
              width: 6,
              height: 6,
              borderRadius: "1px",
              background: "hsl(42 95% 54%)",
              top: `${15 + Math.random() * 70}%`,
              left: `${5 + Math.random() * 90}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <h1 className="font-display text-5xl font-bold text-primary-foreground drop-shadow-lg">
                SeekLakaw
              </h1>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Crown className="h-6 w-6 text-festival-gold drop-shadow-md" />
              </motion.div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-1.5 text-[13px] text-primary-foreground/75 font-body font-light tracking-wide"
            >
              Your premium guide to Philippine Fiestas ✨
            </motion.p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowCalendar(true)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur-xl border border-primary-foreground/10 hover:bg-primary-foreground/25 transition-colors"
            >
              <CalendarDays className="h-5 w-5 text-primary-foreground" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur-xl border border-primary-foreground/10 hover:bg-primary-foreground/25 transition-colors"
            >
              <LogOut className="h-5 w-5 text-primary-foreground" />
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-6 z-10">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder="Search festivals, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 bg-background/90 backdrop-blur-xl border-0 h-14 rounded-2xl font-body shadow-elevated text-base placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Stats pills */}
        <div className="relative z-10 mt-5 flex gap-2.5 overflow-x-auto scrollbar-hide">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 rounded-2xl bg-primary-foreground/12 backdrop-blur-sm px-4 py-2 border border-primary-foreground/8 flex-shrink-0"
          >
            <div className="h-6 w-6 rounded-lg gradient-gold flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-foreground" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-primary-foreground">{festivals.length}</span>
              <span className="text-[11px] text-primary-foreground/60 ml-1">Festivals</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 rounded-2xl bg-primary-foreground/12 backdrop-blur-sm px-4 py-2 border border-primary-foreground/8 flex-shrink-0"
          >
            <div className="h-6 w-6 rounded-lg gradient-teal flex items-center justify-center">
              <TrendingUp className="h-3 w-3 text-primary-foreground" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-primary-foreground">{upcomingCount}</span>
              <span className="text-[11px] text-primary-foreground/60 ml-1">Upcoming</span>
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 rounded-2xl backdrop-blur-sm px-4 py-2 border flex-shrink-0 transition-all ${
              showFavoritesOnly
                ? "bg-festival-rose/25 border-festival-rose/30"
                : "bg-primary-foreground/12 border-primary-foreground/8"
            }`}
          >
            <div className="h-6 w-6 rounded-lg gradient-warm flex items-center justify-center">
              <Heart className={`h-3 w-3 ${showFavoritesOnly ? "fill-primary-foreground text-primary-foreground" : "text-primary-foreground"}`} />
            </div>
            <div>
              <span className="text-[13px] font-bold text-primary-foreground">{favCount}</span>
              <span className="text-[11px] text-primary-foreground/60 ml-1">Saved</span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Feast Banner */}
      <FeastBanner />

      {/* Featured Carousel */}
      {!search && activeCategory === "All" && !showFavoritesOnly && featured.length > 0 && (
        <div className="mt-6">
          <div className="px-6 mb-4 flex items-center justify-between">
            <h2 className="text-base font-extrabold font-body text-foreground flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg gradient-warm flex items-center justify-center shadow-festive">
                <Flame className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              Upcoming Fiestas
            </h2>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-[11px] font-medium">View all</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 pb-3 snap-x snap-mandatory scrollbar-hide touch-pan-x">
            {featured.map((festival) => (
              <FeaturedCard
                key={festival.id}
                festival={festival}
                onClick={() => setSelectedFestival(festival)}
                isFav={isFavorite(festival.id)}
                onToggleFav={() => toggleFavorite(festival.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="px-6 py-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground mb-3.5 flex items-center gap-2">
          <span className="h-1.5 w-5 rounded-full gradient-festive inline-block" />
          Browse by Category
        </p>
        <div className="grid grid-cols-4 gap-2.5">
          {categories.map(({ label, icon: Icon, gradient }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.93 }}
              onClick={() => setActiveCategory(label)}
              className={`relative flex flex-col items-center gap-2 rounded-2xl py-3.5 px-2 text-[11px] font-bold font-body transition-all duration-300 overflow-hidden ${
                activeCategory === label
                  ? `${gradient} text-primary-foreground shadow-elevated scale-[1.03]`
                  : "glass text-muted-foreground hover:shadow-card"
              }`}
            >
              {activeCategory === label && <div className="absolute inset-0 shimmer" />}
              <Icon className="h-5 w-5 relative z-10" />
              <span className="relative z-10">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Section title */}
      <div className="px-6 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold font-body text-foreground">
          {showFavoritesOnly ? "My Favorites ❤️" : activeCategory === "All" ? "All Festivals" : `${activeCategory} Festivals`}
        </h2>
        <span className="text-[11px] text-muted-foreground font-bold font-body glass rounded-full px-3 py-1.5">{filtered.length} found</span>
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
            <div className="h-24 w-24 rounded-3xl glass flex items-center justify-center mb-4">
              {showFavoritesOnly ? (
                <Heart className="h-12 w-12 text-muted-foreground/30" />
              ) : (
                <MapPin className="h-12 w-12 text-muted-foreground/30" />
              )}
            </div>
            <p className="text-lg font-bold font-body">
              {showFavoritesOnly ? "No favorites yet" : "No festivals found"}
            </p>
            <p className="text-sm mt-1 font-body text-muted-foreground/70">
              {showFavoritesOnly ? "Tap the heart icon to save festivals" : "Try a different search or category"}
            </p>
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
                  isFavorite={isFavorite(festival.id)}
                  onToggleFavorite={() => toggleFavorite(festival.id)}
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
          isFavorite={isFavorite(selectedFestival.id)}
          onToggleFavorite={() => toggleFavorite(selectedFestival.id)}
        />
      )}

      {/* Calendar View */}
      <AnimatePresence>
        {showCalendar && (
          <CalendarView
            festivals={festivals}
            onBack={() => setShowCalendar(false)}
            onSelectFestival={(f) => {
              setShowCalendar(false);
              setSelectedFestival(f);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
