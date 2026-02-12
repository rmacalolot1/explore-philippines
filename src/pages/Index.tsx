import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Search, LogOut, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import FestivalCard from "@/components/FestivalCard";
import FestivalDetail from "@/components/FestivalDetail";
import type { Festival } from "@/components/FestivalCard";
import { toast } from "sonner";

const categories = ["All", "Religious", "Cultural", "Harvest"];

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

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="gradient-festive px-6 pb-8 pt-12 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-primary-foreground">SeekLakaw</h1>
            <p className="mt-1 text-sm text-primary-foreground/70 font-body">
              Discover Philippine Festivals
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur-sm"
          >
            <LogOut className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search festivals, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background/90 backdrop-blur-sm border-0 h-12 rounded-xl font-body"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto px-6 py-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold font-body transition-all ${
              activeCategory === cat
                ? "gradient-festive text-primary-foreground shadow-festive"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Festival Grid */}
      <div className="px-6">
        {loading ? (
          <div className="flex flex-col gap-4 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-muted-foreground">
            <MapPin className="h-12 w-12 mb-3 text-muted-foreground/50" />
            <p className="text-lg font-semibold">No festivals found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((festival, i) => (
              <FestivalCard
                key={festival.id}
                festival={festival}
                index={i}
                onClick={() => setSelectedFestival(festival)}
              />
            ))}
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
