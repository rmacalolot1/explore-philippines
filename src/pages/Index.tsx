import { useState, useEffect, useMemo } from "react";
import splashBg from "@/assets/splash-bg.jpg";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Sparkles, Flame, Star, CalendarDays, ChevronRight, TrendingUp, Crown, Heart, PartyPopper } from "lucide-react";
import { Input } from "@/components/ui/input";
import FestivalCard from "@/components/FestivalCard";
import FestivalCardSkeleton from "@/components/FestivalCardSkeleton";
import FestivalDetail from "@/components/FestivalDetail";
import CalendarView from "@/pages/CalendarView";
import ConfettiRain from "@/components/ConfettiRain";
import FeastBanner from "@/components/FeastBanner";
import BottomNav from "@/components/BottomNav";
import SectionDivider from "@/components/SectionDivider";
import HeartBurst from "@/components/HeartBurst";
import { useFavorites } from "@/hooks/useFavorites";
import type { Festival } from "@/components/FestivalCard";
import { toast } from "sonner";
import { format } from "date-fns";

const categories = [
{ label: "All", icon: Sparkles, gradient: "gradient-festive" },
{ label: "Religious", icon: Star, gradient: "gradient-blue" },
{ label: "Cultural", icon: Flame, gradient: "gradient-red" },
{ label: "Harvest", icon: CalendarDays, gradient: "gradient-yellow" }];


const FeaturedCard = ({ festival, onClick, isFav, onToggleFav }: {festival: Festival;onClick: () => void;isFav: boolean;onToggleFav: () => void;}) => {
  const startDate = new Date(festival.start_date);
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="relative flex-shrink-0 w-[260px] h-[360px] rounded-3xl overflow-hidden cursor-pointer snap-center group">

      {/* Blur-up image */}
      {!imageLoaded && <div className="absolute inset-0 bg-muted shimmer" />}
      <img
        src={festival.image_url || "/placeholder.svg"}
        alt={festival.name}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
          imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {e.currentTarget.src = "/placeholder.svg"; setImageLoaded(true);}} />

      <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
        <div className="glass-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5">
          <CalendarDays className="h-3 w-3 text-primary" />
          <span className="text-[10px] font-bold text-foreground">{format(startDate, "MMM d")}</span>
        </div>
        <HeartBurst onTap={() => {}} className="">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {e.stopPropagation();onToggleFav();}}
            className="flex h-9 w-9 items-center justify-center rounded-xl glass-strong">
            <Heart className={`h-4 w-4 transition-all duration-300 ${isFav ? "fill-primary-foreground text-primary-foreground" : "text-primary-foreground/70"}`} />
          </motion.button>
        </HeartBurst>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        {festival.category &&
        <span className="inline-block rounded-full gradient-warm shimmer px-3 py-0.5 text-[9px] font-extrabold text-foreground uppercase tracking-widest mb-2.5">
            {festival.category}
          </span>
        }
        <h3 className="text-lg font-bold text-primary-foreground leading-tight line-clamp-2 font-body drop-shadow-md">
          {festival.name}
        </h3>
        <div className="mt-2 flex items-center gap-1.5">
          <MapPin className="h-3 w-3 text-primary" />
          <span className="text-[11px] text-primary-foreground/80 font-medium font-body">{festival.location}, {festival.province}</span>
        </div>
      </div>
    </motion.div>);

};

const Index = () => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"home" | "calendar" | "favorites" | "profile">("home");
  const { isFavorite, toggleFavorite, favoriteIds } = useFavorites();

  useEffect(() => {
    const fetchFestivals = async () => {
      const { data, error } = await supabase.
      from("festivals").
      select("*").
      order("start_date", { ascending: true });

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
    const now = new Date();
    return festivals.filter((f) => {
      const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase()) ||
      f.province.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
      activeCategory === "All" ||
      f.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchFav = !showFavoritesOnly || isFavorite(f.id);
      const matchUpcoming = !showUpcomingOnly || new Date(f.start_date) >= now;
      return matchSearch && matchCategory && matchFav && matchUpcoming;
    });
  }, [festivals, search, activeCategory, showFavoritesOnly, showUpcomingOnly, isFavorite]);

  const featured = useMemo(() => {
    const now = new Date();
    return festivals.
    filter((f) => new Date(f.start_date) >= now).
    slice(0, 6);
  }, [festivals]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  const handleTabChange = (tab: "home" | "calendar" | "favorites" | "profile") => {
    if (tab === "home") {
      setShowFavoritesOnly(false);
      setShowUpcomingOnly(false);
      setActiveCategory("All");
      setSearch("");
      setShowCalendar(false);
    } else if (tab === "calendar") {
      setShowCalendar(true);
    } else if (tab === "favorites") {
      setShowCalendar(false);
      setShowFavoritesOnly(true);
      setShowUpcomingOnly(false);
      setActiveCategory("All");
      setSearch("");
      setTimeout(() => {
        document.getElementById("all-festivals")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    setActiveTab(tab);
  };

  const upcomingCount = festivals.filter((f) => new Date(f.start_date) >= new Date()).length;
  const favCount = favoriteIds.size;

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      {/* Background image like login */}
      <div
        className="fixed inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: `url(${splashBg})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-t from-background via-background/85 to-foreground/15" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8" />
      {/* Confetti rain */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ConfettiRain count={20} />
      </div>

      {/* Hero Header */}
      <div className="relative z-10 overflow-hidden bg-background px-6 pb-8 pt-14">
        {/* Decorative glow orbs */}
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/8 blur-2xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-0 h-32 w-32 rounded-full bg-primary/5 blur-2xl animate-pulse-glow" style={{ animationDelay: '3s' }} />

        {/* Sparkle dots */}
        {[...Array(8)].map((_, i) =>
        <motion.div
          key={i}
          className="absolute animate-sparkle"
          style={{
            width: 6,
            height: 6,
            borderRadius: "1px",
            background: ["hsl(340 82% 59% / 0.3)", "hsl(350 55% 78% / 0.3)", "hsl(330 50% 72% / 0.3)"][i % 3],
            top: `${15 + Math.random() * 70}%`,
            left: `${5 + Math.random() * 90}%`,
            animationDelay: `${i * 0.3}s`
          }} />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2">
            <h1 className="font-display text-5xl font-bold text-primary drop-shadow-lg">
              SeekLakaw
            </h1>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              <Crown className="h-6 w-6 text-primary drop-shadow-md" />
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-1.5 text-[13px] text-primary/75 font-body font-light tracking-wide">Explore Philippine Fiestas ✨
          </motion.p>
        </div>

        {/* Search */}
        <div className="relative mt-6 z-10">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder="Search festivals, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 bg-background/90 backdrop-blur-xl border-0 h-14 rounded-2xl font-body shadow-elevated text-base placeholder:text-muted-foreground/50" />
        </div>

        {/* Stats pills */}
        <div className="relative z-10 mt-5 grid grid-cols-3 gap-2">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowFavoritesOnly(false); setShowUpcomingOnly(false); setActiveCategory("All"); setSearch(""); setActiveTab("home"); }}
            className="flex flex-col items-center gap-1 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm px-3 py-3 border border-primary-foreground/10 active:bg-primary-foreground/25 transition-all">
            <div className="h-8 w-8 rounded-xl gradient-yellow flex items-center justify-center shadow-sm">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-extrabold text-primary-foreground leading-none">{festivals.length}</span>
            <span className="text-[10px] text-primary-foreground/60 font-semibold">Festivals</span>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowFavoritesOnly(false); setShowUpcomingOnly(true); setActiveCategory("All"); setSearch(""); setActiveTab("home"); }}
            className="flex flex-col items-center gap-1 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm px-3 py-3 border border-primary-foreground/10 active:bg-primary-foreground/25 transition-all">
            <div className="h-8 w-8 rounded-xl gradient-blue flex items-center justify-center shadow-sm">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-extrabold text-primary-foreground leading-none">{upcomingCount}</span>
            <span className="text-[10px] text-primary-foreground/60 font-semibold">Upcoming</span>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowUpcomingOnly(false); setShowFavoritesOnly(!showFavoritesOnly); setActiveTab(showFavoritesOnly ? "home" : "favorites"); }}
            className={`flex flex-col items-center gap-1 rounded-2xl backdrop-blur-sm px-3 py-3 border transition-all ${
            showFavoritesOnly ?
            "bg-primary-foreground/30 border-primary-foreground/20 shadow-sm" :
            "bg-primary-foreground/15 border-primary-foreground/10"}`}>
            <div className="h-8 w-8 rounded-xl gradient-red flex items-center justify-center shadow-sm">
              <Heart className={`h-4 w-4 ${showFavoritesOnly ? "fill-primary-foreground text-primary-foreground" : "text-primary-foreground"}`} />
            </div>
            <span className="text-lg font-extrabold text-primary-foreground leading-none">{favCount}</span>
            <span className="text-[10px] text-primary-foreground/60 font-semibold">Saved</span>
          </motion.button>
        </div>
      </div>

      {/* Feast Banner */}
      <div className="relative z-10">
        <FeastBanner />
      </div>

      {/* Section Divider */}
      <div className="relative z-10 mt-2">
        <SectionDivider />
      </div>

      {/* Featured Carousel */}
      {!search && activeCategory === "All" && !showFavoritesOnly && featured.length > 0 &&
      <div className="mt-4 relative z-10">
          <div className="px-6 mb-4 flex items-center justify-between">
            <h2 className="text-base font-extrabold font-body text-foreground flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg gradient-red flex items-center justify-center shadow-festive">
                <Flame className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              Upcoming Fiestas
            </h2>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowFavoritesOnly(false);
                setActiveCategory("All");
                setSearch("");
                setShowUpcomingOnly(true);
                setTimeout(() => {
                  document.getElementById("all-festivals")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors active:text-primary/60">
              <span className="text-[11px] font-bold">View all</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 pb-3 snap-x snap-mandatory scrollbar-hide touch-pan-x">
            {featured.map((festival) =>
          <FeaturedCard
            key={festival.id}
            festival={festival}
            onClick={() => setSelectedFestival(festival)}
            isFav={isFavorite(festival.id)}
            onToggleFav={() => toggleFavorite(festival.id)} />
            )}
          </div>
        </div>
      }

      {/* Section Divider */}
      <div className="relative z-10 mt-2">
        <SectionDivider />
      </div>

      {/* Categories */}
      <div className="px-6 py-4 relative z-10">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground mb-3.5 flex items-center gap-2">
          <span className="h-1.5 w-5 rounded-full gradient-primary inline-block" />
          Browse by Category
        </p>
        <div className="grid grid-cols-4 gap-2.5">
          {categories.map(({ label, icon: Icon, gradient }) =>
          <motion.button
            key={label}
            whileTap={{ scale: 0.88 }}
            animate={activeCategory === label ? { scale: 1.03 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            onClick={() => { setActiveCategory(label); setShowUpcomingOnly(false); setActiveTab("home"); }}
            className={`relative flex flex-col items-center gap-2 rounded-2xl py-3.5 px-2 text-[11px] font-bold font-body transition-all duration-300 overflow-hidden ${
            activeCategory === label ?
            `${gradient} text-primary-foreground shadow-elevated` :
            "glass text-muted-foreground hover:shadow-card"}`
            }>
              {activeCategory === label && <div className="absolute inset-0 shimmer" />}
              <Icon className="h-5 w-5 relative z-10" />
              <span className="relative z-10">{label}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Section title */}
      <div id="all-festivals" className="px-6 mb-4 flex items-center justify-between relative z-10">
        <h2 className="text-lg font-extrabold font-body text-foreground">
          {showFavoritesOnly ? "My Favorites ❤️" : showUpcomingOnly ? "Upcoming Festivals 🎉" : activeCategory === "All" ? "All Festivals" : `${activeCategory} Festivals`}
        </h2>
        <span className="text-[11px] text-muted-foreground font-bold font-body glass rounded-full px-3 py-1.5">{filtered.length} found</span>
      </div>

      {/* Festival Grid */}
      <div className="px-6 relative z-10">
        {loading ?
        <div className="flex flex-col gap-3.5">
            {[0, 1, 2, 3, 4].map((i) =>
          <FestivalCardSkeleton key={i} index={i} />
            )}
          </div> :
        filtered.length === 0 ?
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 flex flex-col items-center text-muted-foreground">
            <div className="h-24 w-24 rounded-3xl glass flex items-center justify-center mb-4">
              {showFavoritesOnly ?
            <Heart className="h-12 w-12 text-muted-foreground/30" /> :
            <MapPin className="h-12 w-12 text-muted-foreground/30" />
              }
            </div>
            <p className="text-lg font-bold font-body">
              {showFavoritesOnly ? "No favorites yet" : "No festivals found"}
            </p>
            <p className="text-sm mt-1 font-body text-muted-foreground/70">
              {showFavoritesOnly ? "Tap the heart icon to save festivals" : "Try a different search or category"}
            </p>
          </motion.div> :

        <div className="flex flex-col gap-3.5">
            <AnimatePresence mode="popLayout">
              {filtered.map((festival, i) =>
            <FestivalCard
              key={festival.id}
              festival={festival}
              index={i}
              onClick={() => setSelectedFestival(festival)}
              isFavorite={isFavorite(festival.id)}
              onToggleFavorite={() => toggleFavorite(festival.id)} />
              )}
            </AnimatePresence>
          </div>
        }
      </div>

      {/* Detail View */}
      {selectedFestival &&
      <FestivalDetail
        festival={selectedFestival}
        onClose={() => setSelectedFestival(null)}
        isFavorite={isFavorite(selectedFestival.id)}
        onToggleFavorite={() => toggleFavorite(selectedFestival.id)} />
      }

      {/* Calendar View */}
      <AnimatePresence>
        {showCalendar &&
        <CalendarView
          festivals={festivals}
          onBack={() => { setShowCalendar(false); setActiveTab("home"); }}
          onSelectFestival={(f) => {
            setShowCalendar(false);
            setSelectedFestival(f);
            setActiveTab("home");
          }} />
        }
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />
    </div>);

};

export default Index;
