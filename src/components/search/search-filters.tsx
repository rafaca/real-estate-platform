"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const propertyTypes = [
  { value: "HOUSE", label: "House" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "CONDO", label: "Condo" },
  { value: "TOWNHOUSE", label: "Townhouse" },
  { value: "LAND", label: "Land" },
];

const bedroomOptions = [
  { value: "", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

const bathroomOptions = [
  { value: "", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
];

const features = [
  { value: "garden", label: "Garden" },
  { value: "pool", label: "Pool" },
  { value: "garage", label: "Garage" },
  { value: "terrace", label: "Terrace" },
  { value: "fireplace", label: "Fireplace" },
  { value: "air-conditioning", label: "Air Conditioning" },
  { value: "modern-kitchen", label: "Modern Kitchen" },
  { value: "hardwood-floors", label: "Hardwood Floors" },
];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for form
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const [sqmMin, setSqmMin] = useState(searchParams.get("sqmMin") || "");
  const [sqmMax, setSqmMax] = useState(searchParams.get("sqmMax") || "");

  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset to page 1 when filters change
      params.delete("page");

      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  const selectedPropertyTypes = searchParams.get("propertyType")?.split(",") || [];
  const selectedBeds = searchParams.get("beds") || "";
  const selectedBaths = searchParams.get("baths") || "";
  const selectedFeatures = searchParams.get("features")?.split(",") || [];

  const togglePropertyType = (value: string) => {
    const current = selectedPropertyTypes.includes(value)
      ? selectedPropertyTypes.filter((t) => t !== value)
      : [...selectedPropertyTypes, value];

    updateFilters({
      propertyType: current.length > 0 ? current.join(",") : null,
    });
  };

  const toggleFeature = (value: string) => {
    const current = selectedFeatures.includes(value)
      ? selectedFeatures.filter((f) => f !== value)
      : [...selectedFeatures, value];

    updateFilters({
      features: current.length > 0 ? current.join(",") : null,
    });
  };

  const applyPriceFilter = () => {
    updateFilters({
      priceMin: priceMin || null,
      priceMax: priceMax || null,
    });
  };

  const applySqmFilter = () => {
    updateFilters({
      sqmMin: sqmMin || null,
      sqmMax: sqmMax || null,
    });
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

      {/* Price Range */}
      <FilterSection title="Price Range" defaultOpen>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            onBlur={applyPriceFilter}
            onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
            className="text-sm"
          />
          <span className="text-gray-400">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            onBlur={applyPriceFilter}
            onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
            className="text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            { min: "", max: "200000", label: "< €200k" },
            { min: "200000", max: "500000", label: "€200k-500k" },
            { min: "500000", max: "1000000", label: "€500k-1M" },
            { min: "1000000", max: "", label: "> €1M" },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => {
                setPriceMin(range.min);
                setPriceMax(range.max);
                updateFilters({ priceMin: range.min || null, priceMax: range.max || null });
              }}
              className="text-xs px-2 py-1 rounded-full border border-gray-300 hover:border-primary-500 hover:text-primary-600"
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection title="Property Type" defaultOpen>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedPropertyTypes.includes(type.value)}
                onChange={() => togglePropertyType(type.value)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection title="Bedrooms" defaultOpen>
        <div className="flex flex-wrap gap-2">
          {bedroomOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilters({ beds: option.value || null })}
              className={cn(
                "px-4 py-2 text-sm rounded-lg border transition-colors",
                selectedBeds === option.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-300 hover:border-gray-400"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Bathrooms */}
      <FilterSection title="Bathrooms" defaultOpen>
        <div className="flex flex-wrap gap-2">
          {bathroomOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilters({ baths: option.value || null })}
              className={cn(
                "px-4 py-2 text-sm rounded-lg border transition-colors",
                selectedBaths === option.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-300 hover:border-gray-400"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size (m²)">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={sqmMin}
            onChange={(e) => setSqmMin(e.target.value)}
            onBlur={applySqmFilter}
            onKeyDown={(e) => e.key === "Enter" && applySqmFilter()}
            className="text-sm"
          />
          <span className="text-gray-400">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={sqmMax}
            onChange={(e) => setSqmMax(e.target.value)}
            onBlur={applySqmFilter}
            onKeyDown={(e) => e.key === "Enter" && applySqmFilter()}
            className="text-sm"
          />
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection title="Features">
        <div className="space-y-2">
          {features.map((feature) => (
            <label
              key={feature.value}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedFeatures.includes(feature.value)}
                onChange={() => toggleFeature(feature.value)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{feature.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          const params = new URLSearchParams();
          const type = searchParams.get("type");
          if (type) params.set("type", type);
          router.push(`/search?${params.toString()}`);
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = false, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-left"
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}
