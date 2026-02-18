import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("favorites")
        .select("festival_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setFavoriteIds(new Set(data.map((f) => f.festival_id)));
      }
      setLoading(false);
    };
    fetchFavorites();
  }, []);

  const toggleFavorite = useCallback(async (festivalId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please sign in first"); return; }

    const isFav = favoriteIds.has(festivalId);

    if (isFav) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("festival_id", festivalId);
      if (error) { toast.error("Failed to remove"); return; }
      setFavoriteIds((prev) => { const s = new Set(prev); s.delete(festivalId); return s; });
      toast.success("Removed from favorites");
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, festival_id: festivalId });
      if (error) { toast.error("Failed to save"); return; }
      setFavoriteIds((prev) => new Set(prev).add(festivalId));
      toast.success("Added to favorites ❤️");
    }
  }, [favoriteIds]);

  const isFavorite = useCallback((id: string) => favoriteIds.has(id), [favoriteIds]);

  return { isFavorite, toggleFavorite, favoriteIds, loading };
};
