import React from "react";

/**
 * BusinessMenuSkeleton: Esqueleto de carga animado premium con estilo de vidrios
 * y gradientes fluidos para Crave Vision.
 */
export function BusinessMenuSkeleton() {
  return (
    <div className="absolute inset-0 bg-[#ededed] overflow-y-auto flex flex-col scrollbar-hide pb-10">
      {/* Banner Slider Skeleton */}
      <div className="w-full h-[21rem] bg-gradient-to-br from-slate-200/50 to-slate-300/30 animate-pulse relative flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-transparent rounded-full animate-spin absolute" />
      </div>

      {/* Business Header Skeleton */}
      <div className="relative px-6 -mt-14 z-20 flex items-start gap-5 animate-pulse">
        {/* Logo Circle Skeleton */}
        <div className="w-28 h-28 rounded-full border-[5px] border-white bg-gradient-to-br from-slate-200 to-slate-300/80 shadow-sm shrink-0" />

        {/* Details Skeleton */}
        <div className="pt-16 flex-1 space-y-3">
          <div className="h-6 bg-slate-300/60 rounded-full w-3/4" />
          <div className="flex gap-4">
            <div className="h-4 bg-slate-300/60 rounded-full w-1/4" />
            <div className="h-4 bg-slate-300/60 rounded-full w-1/4" />
          </div>
        </div>
      </div>

      {/* Search & Categories Skeleton */}
      <div className="px-6 mt-8 space-y-6 animate-pulse">
        {/* Search Bar Skeleton */}
        <div className="h-12 bg-white/60 backdrop-blur-md rounded-full w-full border border-white/40" />
        
        {/* Categories Bar Skeleton */}
        <div className="flex gap-3 overflow-x-hidden">
          <div className="h-8 bg-white/60 backdrop-blur-md rounded-full w-16 shrink-0 border border-white/40" />
          <div className="h-8 bg-white/60 backdrop-blur-md rounded-full w-24 shrink-0 border border-white/40" />
          <div className="h-8 bg-white/60 backdrop-blur-md rounded-full w-20 shrink-0 border border-white/40" />
          <div className="h-8 bg-white/60 backdrop-blur-md rounded-full w-28 shrink-0 border border-white/40" />
        </div>
      </div>

      {/* Product Cards Grid Skeleton */}
      <div className="px-4 mt-6 flex-1 animate-pulse">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 overflow-hidden flex flex-col p-3 space-y-3">
              {/* Image placeholder */}
              <div className="h-28 w-full bg-slate-200/50 rounded-2xl" />
              {/* Title & Desc placeholder */}
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200/60 rounded-full w-5/6" />
                <div className="h-3 bg-slate-200/40 rounded-full w-2/3" />
              </div>
              {/* Footer placeholder */}
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-slate-200/60 rounded-full w-1/3" />
                <div className="w-8 h-8 rounded-full bg-slate-200/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default BusinessMenuSkeleton;
