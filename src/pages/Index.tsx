import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LogOut, MapPin, Sparkles, Flame, Star, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import FestivalCard from "@/components/FestivalCard";
import FestivalDetail from "@/components/FestivalDetail";
import type { Festival } from "@/components/FestivalCard";
import { toast } from "sonner";

const categories = [
  { label: "All", icon: Sparkles },
  { label: "Religious", icon: Star },
  { label: "Cultural", icon: Flame },
  { label: "Harvest", icon: CalendarDays },
];

const Index = () => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  const upcomingCount = festivals.filter(f => new Date(f.start_date) >= new Date()).length;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="relative overflow-hidden gradient-festive px-6 pb-10 pt-14 rounded-b-[2rem]">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-foreground/10" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary-foreground/10" />
        <div className="absolute top-20 right-8 h-8 w-8 rounded-full bg-primary-foreground/15" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="font-display text-5xl font-bold text-primary-foreground drop-shadow-md">SeekLakaw</h1>
            <p className="mt-1 text-sm text-primary-foreground/80 font-body">
              Discover {festivals.length}+ Philippine Festivals ✨
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-md border border-primary-foreground/10"
          >
            <LogOut className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-6 z-10">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search festivals, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 bg-background/95 backdrop-blur-md border-0 h-13 rounded-2xl font-body shadow-lg text-base"
          />
        </div>

        {/* Stats row */}
        <div className="relative z-10 mt-4 flex gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-primary-foreground/15 backdrop-blur-sm px-3 py-2">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
            <span className="text-xs font-semibold text-primary-foreground">{festivals.length} Festivals</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-primary-foreground/15 backdrop-blur-sm px-3 py-2">
            <CalendarDays className="h-4 w-4 text-primary-foreground" />
            <span className="text-xs font-semibold text-primary-foreground">{upcomingCount} Upcoming</span>
          </div>
        </div>
      </div>

      {/* Categories - wrapped grid instead of horizontal scroll */}
      <div className="px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Browse by Category</p>
        <div className="grid grid-cols-4 gap-2">
          {categories.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2 text-xs font-semibold font-body transition-all duration-200 ${
                activeCategory === label
                  ? "gradient-festive text-primary-foreground shadow-festive scale-[1.02]"
                  : "bg-card text-muted-foreground shadow-card hover:bg-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Section title */}
      <div className="px-6 mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold font-body text-foreground">
          {activeCategory === "All" ? "All Festivals" : `${activeCategory} Festivals`}
        </h2>
        <span className="text-sm text-muted-foreground font-body">{filtered.length} found</span>
      </div>

      {/* Festival Grid */}
      <div className="px-6">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-muted-foreground">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <MapPin className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <p className="text-lg font-semibold">No festivals found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
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
