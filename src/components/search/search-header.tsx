"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Map, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SearchHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const listingType = searchParams.get("type") || "sale";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="City, neighborhood, or address..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Listing Type Tabs */}
        <div className="hidden sm:flex items-center rounded-lg border border-gray-300 p-1">
          <button
            onClick={() => handleTypeChange("sale")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              listingType === "sale"
                ? "bg-primary-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Buy
          </button>
          <button
            onClick={() => handleTypeChange("rent")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              listingType === "rent"
                ? "bg-primary-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Rent
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={() => setShowMobileFilters(true)}
          leftIcon={<SlidersHorizontal className="h-4 w-4" />}
        >
          Filters
        </Button>

        {/* View Toggle (Mobile) */}
        <div className="flex lg:hidden items-center rounded-lg border border-gray-300 p-1">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "list"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-400"
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "map"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-400"
            )}
            aria-label="Map view"
          >
            <Map className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active Filters Pills */}
      <ActiveFilters />
    </div>
  );
}

function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: { key: string; label: string }[] = [];

  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  if (priceMin || priceMax) {
    const label =
      priceMin && priceMax
        ? `€${Number(priceMin).toLocaleString()} - €${Number(priceMax).toLocaleString()}`
        : priceMin
        ? `€${Number(priceMin).toLocaleString()}+`
        : `Up to €${Number(priceMax).toLocaleString()}`;
    filters.push({ key: "price", label });
  }

  const beds = searchParams.get("beds");
  if (beds) {
    filters.push({ key: "beds", label: `${beds}+ beds` });
  }

  const baths = searchParams.get("baths");
  if (baths) {
    filters.push({ key: "baths", label: `${baths}+ baths` });
  }

  const propertyType = searchParams.get("propertyType");
  if (propertyType) {
    filters.push({ key: "propertyType", label: propertyType });
  }

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "price") {
      params.delete("priceMin");
      params.delete("priceMax");
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    const type = searchParams.get("type");
    const q = searchParams.get("q");
    if (type) params.set("type", type);
    if (q) params.set("q", q);
    router.push(`/search?${params.toString()}`);
  };

  if (filters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-3 flex-wrap">
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700"
        >
          {filter.label}
          <button
            onClick={() => removeFilter(filter.key)}
            className="ml-1 hover:text-primary-900"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        onClick={clearAll}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Clear all
      </button>
    </div>
  );
}
