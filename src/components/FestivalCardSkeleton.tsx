import { motion } from "framer-motion";

const FestivalCardSkeleton = ({ index = 0 }: { index?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="overflow-hidden rounded-2xl bg-card shadow-card border border-border/50"
    >
      <div className="flex">
        {/* Image skeleton */}
        <div className="relative h-[135px] w-[115px] flex-shrink-0 bg-muted shimmer" />
        {/* Content skeleton */}
        <div className="flex flex-1 flex-col justify-between p-3.5">
          <div>
            <div className="h-4 w-16 rounded-full bg-muted shimmer mb-2" />
            <div className="h-4 w-full rounded bg-muted shimmer mb-1" />
            <div className="h-4 w-3/4 rounded bg-muted shimmer" />
          </div>
          <div className="mt-auto flex flex-col gap-1.5">
            <div className="h-3 w-2/3 rounded bg-muted shimmer" />
            <div className="h-3 w-1/2 rounded bg-muted shimmer" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FestivalCardSkeleton;
