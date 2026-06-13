export function SkeletonPlan() {
  return (
    <div className="p-7 space-y-5 max-w-5xl mx-auto animate-pulse">
      <div className="skeleton h-8 w-48 rounded-xl" />
      <div className="skeleton h-4 w-72 rounded-lg" />
      <div className="skeleton h-64 w-full rounded-2xl mt-6" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
