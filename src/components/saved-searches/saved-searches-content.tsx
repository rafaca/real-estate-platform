"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  BellOff,
  Trash2,
  Edit2,
  ExternalLink,
  MapPin,
  Home,
  Euro,
  Bed,
  Calendar,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

interface SavedSearch {
  id: string;
  name: string;
  criteria: {
    location?: string;
    propertyType?: string;
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    maxBedrooms?: number;
    minSqm?: number;
    maxSqm?: number;
    features?: string[];
  };
  notificationsEnabled: boolean;
  notificationFrequency: "instant" | "daily" | "weekly";
  matchCount: number;
  newMatches: number;
  lastMatchAt: Date | null;
  createdAt: Date;
}

// Mock saved searches
const mockSavedSearches: SavedSearch[] = [
  {
    id: "1",
    name: "2BR Apartments in Berlin",
    criteria: {
      location: "Berlin",
      propertyType: "APARTMENT",
      listingType: "SALE",
      minPrice: 300000,
      maxPrice: 500000,
      minBedrooms: 2,
      maxBedrooms: 2,
    },
    notificationsEnabled: true,
    notificationFrequency: "instant",
    matchCount: 47,
    newMatches: 3,
    lastMatchAt: new Date("2024-01-24"),
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Family Homes in Munich",
    criteria: {
      location: "Munich",
      propertyType: "HOUSE",
      listingType: "SALE",
      minPrice: 700000,
      maxPrice: 1200000,
      minBedrooms: 4,
      features: ["Garden", "Garage"],
    },
    notificationsEnabled: true,
    notificationFrequency: "daily",
    matchCount: 12,
    newMatches: 1,
    lastMatchAt: new Date("2024-01-23"),
    createdAt: new Date("2023-12-15"),
  },
  {
    id: "3",
    name: "Rentals in Barcelona",
    criteria: {
      location: "Barcelona",
      listingType: "RENT",
      minPrice: 1000,
      maxPrice: 2000,
      minSqm: 60,
    },
    notificationsEnabled: false,
    notificationFrequency: "weekly",
    matchCount: 89,
    newMatches: 0,
    lastMatchAt: new Date("2024-01-20"),
    createdAt: new Date("2023-11-20"),
  },
];

export function SavedSearchesContent() {
  const [searches, setSearches] = useState(mockSavedSearches);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const toggleNotifications = (id: string) => {
    setSearches((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, notificationsEnabled: !s.notificationsEnabled } : s
      )
    );
  };

  const changeFrequency = (id: string, frequency: SavedSearch["notificationFrequency"]) => {
    setSearches((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, notificationFrequency: frequency } : s
      )
    );
  };

  const startEditing = (search: SavedSearch) => {
    setEditingId(search.id);
    setEditName(search.name);
  };

  const saveName = () => {
    if (editingId && editName.trim()) {
      setSearches((prev) =>
        prev.map((s) =>
          s.id === editingId ? { ...s, name: editName.trim() } : s
        )
      );
    }
    setEditingId(null);
    setEditName("");
  };

  const deleteSearch = (id: string) => {
    setSearches((prev) => prev.filter((s) => s.id !== id));
    setShowDeleteConfirm(null);
  };

  const buildSearchUrl = (criteria: SavedSearch["criteria"]) => {
    const params = new URLSearchParams();
    if (criteria.location) params.set("location", criteria.location);
    if (criteria.propertyType) params.set("propertyType", criteria.propertyType);
    if (criteria.listingType) params.set("type", criteria.listingType.toLowerCase());
    if (criteria.minPrice) params.set("minPrice", criteria.minPrice.toString());
    if (criteria.maxPrice) params.set("maxPrice", criteria.maxPrice.toString());
    if (criteria.minBedrooms) params.set("minBeds", criteria.minBedrooms.toString());
    if (criteria.maxBedrooms) params.set("maxBeds", criteria.maxBedrooms.toString());
    if (criteria.minSqm) params.set("minSqm", criteria.minSqm.toString());
    if (criteria.maxSqm) params.set("maxSqm", criteria.maxSqm.toString());
    return `/search?${params.toString()}`;
  };

  const formatCriteria = (criteria: SavedSearch["criteria"]) => {
    const parts: string[] = [];

    if (criteria.location) parts.push(criteria.location);
    if (criteria.propertyType) {
      parts.push(criteria.propertyType === "APARTMENT" ? "Apartments" :
                 criteria.propertyType === "HOUSE" ? "Houses" :
                 criteria.propertyType);
    }
    if (criteria.listingType) {
      parts.push(criteria.listingType === "SALE" ? "For Sale" : "For Rent");
    }

    return parts.join(" • ");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Searches</h1>
          <p className="mt-1 text-gray-500">
            Get notified when new properties match your criteria
          </p>
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />} asChild>
          <Link href="/search">Create New Search</Link>
        </Button>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-primary-50 border-primary-200">
        <div className="flex gap-3">
          <Bell className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-primary-800">
              <strong>Pro tip:</strong> Enable instant notifications to be the first to
              know about new listings. Properties in popular areas can go under contract
              within hours!
            </p>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {searches.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">No saved searches yet</h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Save your search criteria and we'll notify you when new properties match
            your preferences.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/search">Start Searching</Link>
          </Button>
        </Card>
      )}

      {/* Saved Searches List */}
      {searches.length > 0 && (
        <div className="space-y-4">
          {searches.map((search) => (
            <Card key={search.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Main Content */}
                <div className="flex-1">
                  {/* Name */}
                  <div className="flex items-center gap-2">
                    {editingId === search.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-64"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveName();
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                        <Button size="sm" onClick={saveName}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {search.name}
                        </h3>
                        <button
                          onClick={() => startEditing(search)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Criteria Summary */}
                  <p className="mt-1 text-sm text-gray-500">
                    {formatCriteria(search.criteria)}
                  </p>

                  {/* Criteria Details */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {search.criteria.location && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        <MapPin className="h-3 w-3" />
                        {search.criteria.location}
                      </span>
                    )}
                    {search.criteria.propertyType && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        <Home className="h-3 w-3" />
                        {search.criteria.propertyType === "APARTMENT"
                          ? "Apartment"
                          : search.criteria.propertyType === "HOUSE"
                          ? "House"
                          : search.criteria.propertyType}
                      </span>
                    )}
                    {(search.criteria.minPrice || search.criteria.maxPrice) && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        <Euro className="h-3 w-3" />
                        {search.criteria.minPrice
                          ? formatPrice(search.criteria.minPrice, "EUR")
                          : "Any"}{" "}
                        -{" "}
                        {search.criteria.maxPrice
                          ? formatPrice(search.criteria.maxPrice, "EUR")
                          : "Any"}
                      </span>
                    )}
                    {(search.criteria.minBedrooms || search.criteria.maxBedrooms) && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        <Bed className="h-3 w-3" />
                        {search.criteria.minBedrooms === search.criteria.maxBedrooms
                          ? `${search.criteria.minBedrooms} beds`
                          : `${search.criteria.minBedrooms || 0}-${
                              search.criteria.maxBedrooms || "Any"
                            } beds`}
                      </span>
                    )}
                    {search.criteria.features?.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="mt-4 flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Matches:</span>
                      <span className="font-medium text-gray-900">
                        {search.matchCount}
                      </span>
                      {search.newMatches > 0 && (
                        <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                          +{search.newMatches} new
                        </span>
                      )}
                    </div>
                    {search.lastMatchAt && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="h-4 w-4" />
                        Last match: {search.lastMatchAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="flex flex-col gap-3 lg:items-end">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleNotifications(search.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        search.notificationsEnabled
                          ? "border-primary-200 bg-primary-50 text-primary-700"
                          : "border-gray-200 bg-white text-gray-500"
                      }`}
                    >
                      {search.notificationsEnabled ? (
                        <>
                          <Bell className="h-4 w-4" />
                          <span className="text-sm font-medium">Alerts On</span>
                        </>
                      ) : (
                        <>
                          <BellOff className="h-4 w-4" />
                          <span className="text-sm font-medium">Alerts Off</span>
                        </>
                      )}
                    </button>
                  </div>

                  {search.notificationsEnabled && (
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
                      {(["instant", "daily", "weekly"] as const).map((freq) => (
                        <button
                          key={freq}
                          onClick={() => changeFrequency(search.id, freq)}
                          className={`px-3 py-1.5 capitalize ${
                            search.notificationFrequency === freq
                              ? "bg-primary-600 text-white"
                              : "bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<ExternalLink className="h-4 w-4" />}
                  asChild
                >
                  <Link href={buildSearchUrl(search.criteria)}>View Results</Link>
                </Button>

                <button
                  onClick={() => setShowDeleteConfirm(search.id)}
                  className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>

              {/* Delete Confirmation */}
              {showDeleteConfirm === search.id && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">
                    Are you sure you want to delete this saved search? You will stop
                    receiving notifications.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => deleteSearch(search.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
