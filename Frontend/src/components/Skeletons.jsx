import React from 'react';

/**
 * ItemCardSkeleton — Lightweight skeleton placeholder matching ItemCard dimensions.
 */
export function ItemCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-border/80 overflow-hidden flex flex-col animate-skeleton">
      {/* Photo Placeholder */}
      <div className="aspect-[4/3] bg-border/40 w-full relative">
        <div className="absolute top-3 left-3 w-12 h-5 rounded-md bg-border/70" />
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="h-4 bg-border/70 rounded-md w-3/5" />
          <div className="h-4 bg-border/50 rounded-full w-12" />
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <div className="h-3 bg-border/40 rounded w-4/5" />
          <div className="h-3 bg-border/40 rounded w-2/3" />
          <div className="h-3 bg-border/40 rounded w-1/2" />
        </div>

        <div className="mt-auto pt-3 flex gap-2">
          <div className="h-8 bg-border/50 rounded-lg flex-1" />
        </div>
      </div>
    </div>
  );
}

/**
 * ItemCardSkeletonGrid — Grid layout for Explore & Browse pages.
 */
export function ItemCardSkeletonGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ItemCardSkeleton key={idx} />
      ))}
    </div>
  );
}

/**
 * ItemDetailsSkeleton — Detail view placeholder.
 */
export function ItemDetailsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-skeleton">
      {/* Top back placeholder */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-4 w-24 bg-border/60 rounded" />
        <div className="h-7 w-28 bg-border/60 rounded-lg" />
      </div>

      {/* Main card */}
      <div className="bg-surface rounded-3xl border border-border overflow-hidden">
        <div className="aspect-video max-h-[380px] bg-border/40 w-full" />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-1/2 bg-border/70 rounded-md" />
            <div className="h-4 w-3/4 bg-border/40 rounded" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-border/60">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-border/30 rounded-xl" />
            ))}
          </div>

          <div className="h-10 w-full bg-border/50 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * MatchCardSkeleton — Placeholder for AI matches.
 */
export function MatchCardSkeleton({ count = 2 }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 bg-surface rounded-2xl border border-border flex flex-col sm:flex-row gap-4 animate-skeleton"
        >
          <div className="w-full sm:w-32 h-28 bg-border/50 rounded-xl shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-1/3 bg-border/70 rounded" />
              <div className="h-5 w-16 bg-border/60 rounded-full" />
            </div>
            <div className="h-3 w-2/3 bg-border/40 rounded" />
            <div className="h-3 w-1/2 bg-border/40 rounded" />
            <div className="h-7 w-28 bg-border/60 rounded-lg mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ListSkeleton — Generic rows placeholder for dashboard & notifications.
 */
export function ListSkeleton({ count = 3 }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 bg-surface rounded-xl border border-border flex items-center justify-between gap-4 animate-skeleton"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-border/50 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-border/60 rounded w-2/5" />
              <div className="h-2.5 bg-border/40 rounded w-3/5" />
            </div>
          </div>
          <div className="h-6 w-16 bg-border/50 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}
