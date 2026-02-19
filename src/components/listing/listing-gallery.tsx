"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Grid, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingGalleryProps {
  images: { url: string; caption?: string }[];
  title: string;
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="relative h-[50vh] md:h-[60vh] bg-gray-200">
        <div className="h-full grid grid-cols-1 md:grid-cols-4 gap-1">
          {/* Main Image */}
          <div
            className="md:col-span-2 md:row-span-2 relative cursor-pointer"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={images[0]?.url || "/placeholder.jpg"}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Secondary Images */}
          {images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className={cn(
                "relative cursor-pointer hidden md:block",
                index === 3 && images.length > 5 && "relative"
              )}
              onClick={() => openLightbox(index + 1)}
            >
              <Image
                src={image.url}
                alt={image.caption || `${title} - Image ${index + 2}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
              {/* Show More Overlay */}
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-medium">
                    +{images.length - 5} more
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Camera className="h-4 w-4" />
          View all {images.length} photos
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
            <span className="text-white text-sm">
              {currentIndex + 1} / {images.length}
            </span>
            <button
              onClick={closeLightbox}
              className="p-2 text-white hover:bg-white/10 rounded-full"
              aria-label="Close gallery"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main Image */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].caption || `Image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Caption */}
          {images[currentIndex].caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-white text-center">
                {images[currentIndex].caption}
              </p>
            </div>
          )}

          {/* Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-2 justify-center overflow-x-auto max-w-3xl mx-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2",
                    currentIndex === index
                      ? "border-white"
                      : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
