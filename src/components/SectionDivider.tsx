const SectionDivider = () => {
  return (
    <div className="flex items-center justify-center gap-3 py-2 px-6">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="flex items-center gap-1.5">
        <span className="text-primary/40 text-xs">✦</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="text-primary/30"
        >
          {/* Filipino sun motif */}
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="12"
              y1="12"
              x2={12 + 10 * Math.cos((angle * Math.PI) / 180)}
              y2={12 + 10 * Math.sin((angle * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
          ))}
        </svg>
        <span className="text-primary/40 text-xs">✦</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
};

export default SectionDivider;
