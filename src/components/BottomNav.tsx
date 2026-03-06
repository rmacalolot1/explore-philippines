import { motion } from "framer-motion";
import { Home, Search, CalendarDays, Heart, LogOut } from "lucide-react";

type Tab = "home" | "calendar" | "favorites" | "profile";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  onSearchClick?: () => void;
}

const tabs = [
  { id: "home" as Tab, icon: Home, label: "Home" },
  { id: "search" as const, icon: Search, label: "Search" },
  { id: "calendar" as Tab, icon: CalendarDays, label: "Calendar" },
  { id: "favorites" as Tab, icon: Heart, label: "Saved" },
  { id: "profile" as Tab, icon: LogOut, label: "Sign Out" },
];

const BottomNav = ({ activeTab, onTabChange, onLogout }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe">
      <div className="mx-3 mb-3 rounded-2xl glass-strong shadow-elevated border border-border/30">
        <div className="flex items-center justify-around py-2">
          {tabs.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id;
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.85 }}
                onClick={() => {
                  if (id === "profile") {
                    onLogout();
                  } else {
                    onTabChange(id);
                  }
                }}
                className="relative flex flex-col items-center gap-0.5 px-4 py-1.5"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomnav-pill"
                    className="absolute inset-0 rounded-xl bg-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={`h-5 w-5 relative z-10 transition-colors duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  } ${id === "favorites" && isActive ? "fill-primary" : ""}`}
                />
                <span
                  className={`text-[10px] font-semibold relative z-10 transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
