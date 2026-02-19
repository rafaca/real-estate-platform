import { Suspense } from "react";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";
import { SearchMap } from "@/components/search/search-map";
import { SearchHeader } from "@/components/search/search-header";

export const metadata = {
  title: "Search Properties",
  description: "Find your perfect property with our powerful search tools",
};

export default function SearchPage() {
  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      {/* Search Header with quick filters */}
      <Suspense fallback={<HeaderSkeleton />}>
        <SearchHeader />
      </Suspense>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Filters Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 border-r border-gray-200 overflow-y-auto bg-white">
          <Suspense fallback={<FiltersSkeleton />}>
            <SearchFilters />
          </Suspense>
        </aside>

        {/* Results + Map */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Results List */}
          <div className="flex-1 lg:w-1/2 overflow-y-auto bg-gray-50">
            <Suspense fallback={<ResultsSkeleton />}>
              <SearchResults />
            </Suspense>
          </div>

          {/* Map - Desktop */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <Suspense fallback={<MapSkeleton />}>
              <SearchMap />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="h-10 bg-gray-100 rounded animate-pulse" />
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 space-y-3 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  );
}
