import { Metadata } from "next";
import { FavoritesContent } from "@/components/favorites/favorites-content";

export const metadata: Metadata = {
  title: "My Favorites",
  description: "View and manage your saved properties",
};

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <FavoritesContent />
      </div>
    </div>
  );
}
