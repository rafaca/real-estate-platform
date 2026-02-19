import { Metadata } from "next";
import { SavedSearchesContent } from "@/components/saved-searches/saved-searches-content";

export const metadata: Metadata = {
  title: "Saved Searches",
  description: "Manage your saved searches and notification preferences",
};

export default function SavedSearchesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <SavedSearchesContent />
      </div>
    </div>
  );
}
