"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Navigation, Clock, Car, Train, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Initialize Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface ListingMapProps {
  listing: {
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    addressLine1: string;
    city: string;
    postalCode: string;
  };
}

type TransportMode = "driving" | "walking" | "cycling";

interface NearbyPlace {
  name: string;
  type: string;
  distance: string;
  icon: string;
}

export function ListingMap({ listing }: ListingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showIsochrone, setShowIsochrone] = useState(false);
  const [transportMode, setTransportMode] = useState<TransportMode>("driving");
  const [travelTime, setTravelTime] = useState(15); // minutes

  // Mock nearby places (would come from API in production)
  const nearbyPlaces: NearbyPlace[] = [
    { name: "Central Station", type: "transit", distance: "0.5 km", icon: "train" },
    { name: "City Park", type: "park", distance: "0.3 km", icon: "tree" },
    { name: "International School", type: "school", distance: "0.8 km", icon: "school" },
    { name: "Shopping Mall", type: "shopping", distance: "1.2 km", icon: "shopping" },
    { name: "Hospital", type: "health", distance: "1.5 km", icon: "hospital" },
    { name: "Supermarket", type: "grocery", distance: "0.2 km", icon: "cart" },
  ];

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Check if Mapbox token is available
    if (!mapboxgl.accessToken) {
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [listing.longitude, listing.latitude],
      zoom: 15,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add marker for the property
    const markerEl = document.createElement("div");
    markerEl.innerHTML = `
      <div style="
        background: #0284c7;
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        position: relative;
      ">
        <span style="display: flex; align-items: center; gap: 4px;">
          📍 This Property
        </span>
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #0284c7;
        "></div>
      </div>
    `;

    new mapboxgl.Marker(markerEl)
      .setLngLat([listing.longitude, listing.latitude])
      .addTo(map.current);

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [listing.latitude, listing.longitude]);

  // Add isochrone layer when toggled
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing isochrone layer if any
    if (map.current.getLayer("isochrone-fill")) {
      map.current.removeLayer("isochrone-fill");
    }
    if (map.current.getLayer("isochrone-outline")) {
      map.current.removeLayer("isochrone-outline");
    }
    if (map.current.getSource("isochrone")) {
      map.current.removeSource("isochrone");
    }

    if (!showIsochrone) return;

    // In production, this would call the Mapbox Isochrone API
    // For demo, we'll create a simple circle approximation
    const radiusKm = transportMode === "driving"
      ? travelTime * 0.8 // ~48 km/h average city driving
      : transportMode === "cycling"
      ? travelTime * 0.25 // ~15 km/h cycling
      : travelTime * 0.08; // ~5 km/h walking

    // Create a simple polygon approximating the isochrone
    const center = [listing.longitude, listing.latitude];
    const points = 64;
    const coordinates = [];

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const dx = radiusKm / 111.32 * Math.cos(angle); // longitude degrees
      const dy = radiusKm / 110.574 * Math.sin(angle); // latitude degrees
      coordinates.push([center[0] + dx, center[1] + dy]);
    }
    coordinates.push(coordinates[0]); // Close the polygon

    map.current.addSource("isochrone", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [coordinates],
        },
      },
    });

    map.current.addLayer({
      id: "isochrone-fill",
      type: "fill",
      source: "isochrone",
      paint: {
        "fill-color": "#0284c7",
        "fill-opacity": 0.15,
      },
    });

    map.current.addLayer({
      id: "isochrone-outline",
      type: "line",
      source: "isochrone",
      paint: {
        "line-color": "#0284c7",
        "line-width": 2,
      },
    });
  }, [showIsochrone, transportMode, travelTime, mapLoaded, listing.longitude, listing.latitude]);

  // Show placeholder if no Mapbox token
  if (!mapboxgl.accessToken) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
        <div className="bg-gray-100 rounded-lg h-[400px] flex flex-col items-center justify-center text-center p-8">
          <MapPin className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
          <p className="text-sm text-gray-500 max-w-xs">
            Configure your Mapbox access token to enable the interactive map.
          </p>
          <div className="mt-4 text-sm text-gray-700">
            <p className="font-medium">{listing.addressLine1}</p>
            <p>{listing.city}, {listing.postalCode}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Location</h2>
        <p className="mt-1 text-gray-500">
          {listing.addressLine1}, {listing.city} {listing.postalCode}
        </p>
      </div>

      {/* Map */}
      <div className="relative h-[400px]">
        <div ref={mapContainer} className="h-full w-full" />

        {/* Map Controls */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Travel Time</span>
          </div>

          <Button
            variant={showIsochrone ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowIsochrone(!showIsochrone)}
            className="w-full"
          >
            {showIsochrone ? "Hide Area" : "Show Reachable Area"}
          </Button>

          {showIsochrone && (
            <>
              <div className="flex gap-1">
                <Button
                  variant={transportMode === "driving" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setTransportMode("driving")}
                  className="flex-1 px-2"
                >
                  <Car className="h-4 w-4" />
                </Button>
                <Button
                  variant={transportMode === "cycling" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setTransportMode("cycling")}
                  className="flex-1 px-2"
                >
                  <Bike className="h-4 w-4" />
                </Button>
                <Button
                  variant={transportMode === "walking" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setTransportMode("walking")}
                  className="flex-1 px-2"
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-1">
                {[5, 10, 15, 20].map((time) => (
                  <Button
                    key={time}
                    variant={travelTime === time ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setTravelTime(time)}
                    className="flex-1 text-xs px-1"
                  >
                    {time}m
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Nearby Places */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Nearby Places</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {nearbyPlaces.map((place, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                {place.icon === "train" && <Train className="h-5 w-5 text-primary-600" />}
                {place.icon === "tree" && (
                  <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )}
                {place.icon === "school" && (
                  <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
                  </svg>
                )}
                {place.icon === "shopping" && (
                  <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                )}
                {place.icon === "hospital" && (
                  <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
                {place.icon === "cart" && (
                  <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {place.name}
                </p>
                <p className="text-xs text-gray-500">{place.distance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Get Directions */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${listing.latitude},${listing.longitude}`,
              "_blank"
            );
          }}
          leftIcon={<Navigation className="h-4 w-4" />}
        >
          Get Directions
        </Button>
      </div>
    </Card>
  );
}
