"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSearchStore } from "@/lib/stores/search-store";
import { formatPrice } from "@/lib/utils";

// Initialize Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Mock listings data (same as search-results)
const mockListings = [
  {
    id: "1",
    title: "Modern Apartment in Mitte",
    price: 450000,
    currency: "EUR",
    bedrooms: 2,
    latitude: 52.5302,
    longitude: 13.4008,
  },
  {
    id: "2",
    title: "Charming House with Garden",
    price: 680000,
    currency: "EUR",
    bedrooms: 4,
    latitude: 48.1623,
    longitude: 11.5869,
  },
  {
    id: "3",
    title: "Beachfront Apartment",
    price: 520000,
    currency: "EUR",
    bedrooms: 3,
    latitude: 41.3784,
    longitude: 2.1925,
  },
  {
    id: "4",
    title: "Historic Townhouse",
    price: 890000,
    currency: "EUR",
    bedrooms: 5,
    latitude: 45.4729,
    longitude: 9.187,
  },
  {
    id: "5",
    title: "Penthouse with Rooftop Terrace",
    price: 1250000,
    currency: "EUR",
    bedrooms: 3,
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    id: "6",
    title: "Cozy Studio in City Center",
    price: 185000,
    currency: "EUR",
    bedrooms: 0,
    latitude: 52.499,
    longitude: 13.418,
  },
];

export function SearchMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  const { hoveredListingId, setHoveredListingId, setSelectedListingId, setMapBounds } =
    useSearchStore();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Check if Mapbox token is available
    if (!mapboxgl.accessToken) {
      console.warn("Mapbox token not configured. Map will not be displayed.");
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [10, 48], // Center of Europe
      zoom: 4,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl());

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    // Update bounds when map moves
    map.current.on("moveend", () => {
      if (!map.current) return;
      const bounds = map.current.getBounds();
      if (bounds) {
        setMapBounds({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [setMapBounds]);

  // Add markers for listings
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add new markers
    mockListings.forEach((listing) => {
      // Create custom marker element
      const el = document.createElement("div");
      el.className = "listing-marker";
      el.innerHTML = `
        <div class="marker-content" data-listing-id="${listing.id}">
          <span class="marker-price">${formatCompactPrice(listing.price)}</span>
        </div>
      `;

      // Add styles to marker
      const style = document.createElement("style");
      style.textContent = `
        .listing-marker {
          cursor: pointer;
        }
        .marker-content {
          background: white;
          border: 2px solid #0284c7;
          border-radius: 8px;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 600;
          color: #0284c7;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.2s;
          white-space: nowrap;
        }
        .marker-content:hover,
        .marker-content.active {
          background: #0284c7;
          color: white;
          transform: scale(1.1);
        }
      `;
      if (!document.querySelector("#marker-styles")) {
        style.id = "marker-styles";
        document.head.appendChild(style);
      }

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
      }).setHTML(`
        <div style="padding: 8px;">
          <div style="font-weight: 600; color: #111;">${listing.title}</div>
          <div style="color: #0284c7; font-weight: 700; margin-top: 4px;">
            ${formatPrice(listing.price, listing.currency)}
          </div>
          <div style="color: #666; font-size: 12px; margin-top: 2px;">
            ${listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} bedrooms`}
          </div>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([listing.longitude, listing.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      // Event handlers
      el.addEventListener("mouseenter", () => {
        setHoveredListingId(listing.id);
        marker.togglePopup();
      });

      el.addEventListener("mouseleave", () => {
        setHoveredListingId(null);
        marker.togglePopup();
      });

      el.addEventListener("click", () => {
        setSelectedListingId(listing.id);
        // Navigate to listing detail
        window.location.href = `/listings/${listing.id}`;
      });

      markersRef.current[listing.id] = marker;
    });

    // Fit bounds to show all markers
    if (mockListings.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      mockListings.forEach((listing) => {
        bounds.extend([listing.longitude, listing.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
    }
  }, [mapLoaded, setHoveredListingId, setSelectedListingId]);

  // Highlight marker when hovering on list item
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      const content = el.querySelector(".marker-content");
      if (content) {
        if (id === hoveredListingId) {
          content.classList.add("active");
          marker.togglePopup();
        } else {
          content.classList.remove("active");
          if (marker.getPopup()?.isOpen()) {
            marker.togglePopup();
          }
        }
      }
    });
  }, [hoveredListingId]);

  // Show placeholder if no Mapbox token
  if (!mapboxgl.accessToken) {
    return (
      <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-center p-8">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Configure your Mapbox access token in the environment variables to enable
          the interactive map.
        </p>
        <code className="mt-4 px-3 py-1.5 bg-gray-200 rounded text-xs text-gray-700">
          NEXT_PUBLIC_MAPBOX_TOKEN=your_token
        </code>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <div ref={mapContainer} className="h-full w-full" />

      {/* Map Controls Overlay */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={() => {
            if (map.current && mockListings.length > 0) {
              const bounds = new mapboxgl.LngLatBounds();
              mockListings.forEach((listing) => {
                bounds.extend([listing.longitude, listing.latitude]);
              });
              map.current.fitBounds(bounds, { padding: 50 });
            }
          }}
          className="bg-white px-3 py-2 rounded-lg shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Fit all
        </button>
      </div>

      {/* Search this area button */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <button
          onClick={() => {
            // Trigger search with current map bounds
            const bounds = map.current?.getBounds();
            if (bounds) {
              setMapBounds({
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest(),
              });
              // TODO: Trigger new search with bounds
            }
          }}
          className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium text-primary-600 hover:bg-primary-50 border border-primary-200"
        >
          Search this area
        </button>
      </div>
    </div>
  );
}

function formatCompactPrice(price: number): string {
  if (price >= 1000000) {
    return `€${(price / 1000000).toFixed(1)}M`;
  }
  if (price >= 1000) {
    return `€${Math.round(price / 1000)}K`;
  }
  return `€${price}`;
}
