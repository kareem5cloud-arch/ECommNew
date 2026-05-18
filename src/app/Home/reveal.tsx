export default function ProductSkeleton() {
  return (
    <div
      className="
        bg-white rounded-2xl border border-gray-200
        overflow-hidden flex flex-col
        animate-pulse
      "
    >
      {/* IMAGE SKELETON */}
      <div className="relative w-full aspect-[3/4] bg-gray-200" />

      {/* CONTENT SKELETON */}
      <div className="px-5 py-4 flex flex-col flex-1 gap-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />

        <div className="mt-auto flex items-center gap-2">
          <div className="h-6 bg-gray-200 rounded w-24" />
          <div className="h-5 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}
