"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Trash2,
  Grid,
  List,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Share2,
  Bell,
  BellOff,
  FolderPlus,
  MoreHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

// Mock favorite listings
const mockFavorites = [
  {
    id: "1",
    title: "Modern Apartment in Mitte",
    price: 450000,
    currency: "EUR",
    bedrooms: 2,
    bathrooms: 1,
    sqm: 75,
    city: "Berlin",
    state: "Berlin",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    priceChange: -5000,
    priceChangePercent: -1.1,
    savedAt: new Date("2024-01-15"),
    notifications: true,
  },
  {
    id: "2",
    title: "Charming Family House with Garden",
    price: 980000,
    currency: "EUR",
    bedrooms: 4,
    bathrooms: 3,
    sqm: 180,
    city: "Munich",
    state: "Bavaria",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    priceChange: 0,
    priceChangePercent: 0,
    savedAt: new Date("2024-01-10"),
    notifications: true,
  },
  {
    id: "3",
    title: "Beachfront Apartment with Sea Views",
    price: 720000,
    currency: "EUR",
    bedrooms: 3,
    bathrooms: 2,
    sqm: 120,
    city: "Barcelona",
    state: "Catalonia",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    priceChange: 15000,
    priceChangePercent: 2.1,
    savedAt: new Date("2024-01-05"),
    notifications: false,
  },
  {
    id: "4",
    title: "Cozy Studio in City Center",
    price: 185000,
    currency: "EUR",
    bedrooms: 0,
    bathrooms: 1,
    sqm: 35,
    city: "Berlin",
    state: "Berlin",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    priceChange: -2000,
    priceChangePercent: -1.07,
    savedAt: new Date("2024-01-20"),
    notifications: true,
  },
];

type ViewMode = "grid" | "list";

export function FavoritesContent() {
  const [favorites, setFavorites] = useState(mockFavorites);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === favorites.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(favorites.map((f) => f.id));
    }
  };

  const handleDeleteSelected = () => {
    setFavorites((prev) => prev.filter((f) => !selectedIds.includes(f.id)));
    setSelectedIds([]);
    setShowDeleteConfirm(false);
  };

  const toggleNotifications = (id: string) => {
    setFavorites((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, notifications: !f.notifications } : f
      )
    );
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <p className="mt-1 text-gray-500">
            {favorites.length} saved {favorites.length === 1 ? "property" : "properties"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-primary-50 text-primary-600"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 border-l border-gray-200 ${
                viewMode === "list"
                  ? "bg-primary-50 text-primary-600"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
              aria-label="List view"
            >
              <List className="h-5 w-5" />
            </button>
          </div>

          {/* Create Folder */}
          <Button variant="outline" leftIcon={<FolderPlus className="h-4 w-4" />}>
            New Folder
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-primary-700">
              {selectedIds.length} selected
            </span>
            <button
              onClick={toggleSelectAll}
              className="text-sm text-primary-600 hover:underline"
            >
              {selectedIds.length === favorites.length ? "Deselect all" : "Select all"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FolderPlus className="h-4 w-4" />}
            >
              Move to Folder
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setShowDeleteConfirm(true)}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Remove from Favorites?
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove {selectedIds.length}{" "}
              {selectedIds.length === 1 ? "property" : "properties"} from your
              favorites? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteSelected}
              >
                Remove
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {favorites.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">No favorites yet</h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Start saving properties you love by clicking the heart icon on any listing.
            You'll be able to compare them all here.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/search">Browse Properties</Link>
          </Button>
        </Card>
      )}

      {/* Favorites Grid */}
      {favorites.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((listing) => (
            <FavoriteCard
              key={listing.id}
              listing={listing}
              isSelected={selectedIds.includes(listing.id)}
              onSelect={() => toggleSelect(listing.id)}
              onToggleNotifications={() => toggleNotifications(listing.id)}
              onRemove={() => removeFavorite(listing.id)}
            />
          ))}
        </div>
      )}

      {/* Favorites List */}
      {favorites.length > 0 && viewMode === "list" && (
        <div className="space-y-4">
          {favorites.map((listing) => (
            <FavoriteListItem
              key={listing.id}
              listing={listing}
              isSelected={selectedIds.includes(listing.id)}
              onSelect={() => toggleSelect(listing.id)}
              onToggleNotifications={() => toggleNotifications(listing.id)}
              onRemove={() => removeFavorite(listing.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FavoriteCardProps {
  listing: (typeof mockFavorites)[0];
  isSelected: boolean;
  onSelect: () => void;
  onToggleNotifications: () => void;
  onRemove: () => void;
}

function FavoriteCard({
  listing,
  isSelected,
  onSelect,
  onToggleNotifications,
  onRemove,
}: FavoriteCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card className={`overflow-hidden group ${isSelected ? "ring-2 ring-primary-500" : ""}`}>
      {/* Image */}
      <div className="relative aspect-[4/3]">
        <Link href={`/listings/${listing.id}`}>
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Selection Checkbox */}
        <button
          onClick={onSelect}
          className={`absolute top-3 left-3 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-primary-600 border-primary-600"
              : "bg-white/90 border-gray-300 hover:border-gray-400"
          }`}
        >
          {isSelected && (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-600" />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    onToggleNotifications();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  {listing.notifications ? (
                    <>
                      <BellOff className="h-4 w-4" /> Disable Alerts
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4" /> Enable Alerts
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" /> Share
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FolderPlus className="h-4 w-4" /> Add to Folder
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    onRemove();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
            </>
          )}
        </div>

        {/* Price Change Badge */}
        {listing.priceChange !== 0 && (
          <div
            className={`absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-medium ${
              listing.priceChange < 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {listing.priceChange < 0 ? "↓" : "↑"}{" "}
            {Math.abs(listing.priceChangePercent).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(listing.price, listing.currency)}
          </span>
          {listing.notifications && (
            <Bell className="h-4 w-4 text-primary-500" />
          )}
        </div>

        {/* Title */}
        <Link href={`/listings/${listing.id}`}>
          <h3 className="mt-1 font-semibold text-gray-900 line-clamp-1 hover:text-primary-600">
            {listing.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
          <MapPin className="h-3 w-3" />
          <span>
            {listing.city}, {listing.state}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{listing.bedrooms === 0 ? "Studio" : listing.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{listing.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            <span>{listing.sqm} m²</span>
          </div>
        </div>

        {/* Saved Date */}
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
          Saved {listing.savedAt.toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
}

function FavoriteListItem({
  listing,
  isSelected,
  onSelect,
  onToggleNotifications,
  onRemove,
}: FavoriteCardProps) {
  return (
    <Card className={`p-4 ${isSelected ? "ring-2 ring-primary-500" : ""}`}>
      <div className="flex gap-4">
        {/* Selection */}
        <button
          onClick={onSelect}
          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-primary-600 border-primary-600"
              : "bg-white border-gray-300 hover:border-gray-400"
          }`}
        >
          {isSelected && (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Image */}
        <Link href={`/listings/${listing.id}`} className="flex-shrink-0">
          <div className="relative w-40 h-28 rounded-lg overflow-hidden">
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              className="object-cover"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link href={`/listings/${listing.id}`}>
                <h3 className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">
                  {listing.title}
                </h3>
              </Link>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>
                  {listing.city}, {listing.state}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary-600">
                {formatPrice(listing.price, listing.currency)}
              </div>
              {listing.priceChange !== 0 && (
                <span
                  className={`text-xs font-medium ${
                    listing.priceChange < 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {listing.priceChange < 0 ? "↓" : "↑"}{" "}
                  {Math.abs(listing.priceChangePercent).toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{listing.bedrooms === 0 ? "Studio" : listing.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{listing.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              <span>{listing.sqm} m²</span>
            </div>
            <span className="text-gray-400">
              Saved {listing.savedAt.toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleNotifications}
            className={`p-2 rounded-lg ${
              listing.notifications
                ? "bg-primary-50 text-primary-600"
                : "bg-gray-50 text-gray-400"
            } hover:bg-opacity-80`}
            title={listing.notifications ? "Disable alerts" : "Enable alerts"}
          >
            {listing.notifications ? (
              <Bell className="h-5 w-5" />
            ) : (
              <BellOff className="h-5 w-5" />
            )}
          </button>
          <button
            className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100"
            title="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            onClick={onRemove}
            className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500"
            title="Remove from favorites"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Card>
  );
}
