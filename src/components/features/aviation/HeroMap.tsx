import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PlaneIcon } from "lucide-react";
import type { AviationLogbookData } from "@/lib/logbook-parser";
import { SectionCard } from "@/components/shared";

interface HeroMapProps {
    data: AviationLogbookData;
}

export default function HeroMap({ data }: HeroMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Clean up previous instance if any
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        // Initialize Leaflet map centered on the Iberian Peninsula
        const map = L.map(mapContainerRef.current, {
            center: [41.2, -6.5],
            zoom: 6,
            scrollWheelZoom: true,
            attributionControl: true,
        });

        mapInstanceRef.current = map;

        const API_KEY = import.meta.env.VITE_CARTO_API_KEY || "";

        L.tileLayer(`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${API_KEY}`, {                                                                                                                                                                              
            attribution:                                                                                                                                                                                                                                            
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',                                                                                                
            subdomains: "abcd",                                                                                                                                                                                                                                     
            maxZoom: 20,                                                                                                                                                                                                                                            
        }).addTo(map);

        const allLatLngs: [number, number][] = [];

        // Dynamic marker radius based strictly on zoom level (uniform across all airports)
        const getMarkerRadius = (zoom: number) => {
            if (zoom <= 4) return 2.5;
            if (zoom === 5) return 3;
            if (zoom === 6) return 3.5;
            if (zoom === 7) return 4;
            if (zoom === 8) return 4.5;
            return 5;
        };

        // 1. Draw flight paths (thin solid line)
        data.routes.forEach((route) => {
            allLatLngs.push(route.fromCoords);
            allLatLngs.push(route.toCoords);

            // Polyline connecting airports (thin solid line in #5966ff)
            const polyline = L.polyline([route.fromCoords, route.toCoords], {
                color: "#5966ff",
                weight: 1.5,
                opacity: 1,
                lineCap: "round",
            }).addTo(map);

            const aircraftLabel =
                route.aircraftTypes.length > 0
                    ? route.aircraftTypes.join(", ")
                    : "General Aviation";

            polyline.bindTooltip(
                `<div class="p-1 font-sans text-xs">
                    <p class="font-bold text-sm text-foreground mb-0.5">${route.fromIcao} ➔ ${route.toIcao}</p>
                    <p class="text-muted-foreground">${route.distanceNm} NM • ${route.flightCount} Flights</p>
                    <p class="text-[11px] text-primary font-medium mt-0.5">Aircraft: ${aircraftLabel}</p>
                </div>`,
                {
                    sticky: true,
                    className: "aviation-leaflet-tooltip",
                },
            );

            polyline.on("mouseover", () => {
                polyline.setStyle({
                    color: "#4b54bf",
                    weight: 2.5,
                    opacity: 1,
                });
            });

            polyline.on("mouseout", () => {
                polyline.setStyle({
                    color: "#5966ff",
                    weight: 1.5,
                    opacity: 0.85,
                });
            });
        });

        // 2. Draw Airport dot markers (smaller fixed size dots in #5966ff)
        const airportMarkers: L.CircleMarker[] = [];

        data.uniqueAirports.forEach((airport) => {
            allLatLngs.push([airport.lat, airport.lon]);

            const circle = L.circleMarker([airport.lat, airport.lon], {
                radius: getMarkerRadius(map.getZoom()),
                fillColor: "#5966ff",
                color: "#ffffff",
                weight: 1.5,
                opacity: 0.95,
                fillOpacity: 0.95,
            }).addTo(map);

            airportMarkers.push(circle);

            circle.bindPopup(
                `<div class="py-2 px-6 font-sans">
                    <div class="flex items-center justify-between gap-4 border-b border-border pb-2 mb-2">
                        <span class="font-black text-base text-primary">${airport.icao}</span>
                        <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-primary/5 text-primary">
                            ${airport.operationsCount} Operations
                        </span>
                    </div>
                    <p class="font-bold text-xs text-foreground">${airport.name}</p>
                    <p class="text-xs text-muted-foreground mt-1">${airport.city}, ${airport.country}</p>
                    <p class="text-[11px] font-mono text-muted-foreground mt-1">Lat: ${airport.lat.toFixed(4)}°, Lon: ${airport.lon.toFixed(4)}°</p>
                </div>`,
                {
                    className: "aviation-leaflet-popup",
                },
            );
        });

        // Update airport marker sizes exclusively when zooming in and out
        const updateMarkerSizes = () => {
            if (!mapInstanceRef.current) return;
            const newRadius = getMarkerRadius(mapInstanceRef.current.getZoom());
            airportMarkers.forEach((marker) => marker.setRadius(newRadius));
        };

        map.on("zoom", updateMarkerSizes);
        map.on("zoomend", updateMarkerSizes);

        const fitAll = () => {
            if (!mapInstanceRef.current || allLatLngs.length === 0) return;
            mapInstanceRef.current.invalidateSize();
            const bounds = L.latLngBounds(allLatLngs);
            mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30] });
        };

        // ResizeObserver to handle layout / container resize changes
        const resizeObserver = new ResizeObserver(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        });
        resizeObserver.observe(mapContainerRef.current);

        // Multiple staggered triggers to ensure sizing after CSS entrance animations finish
        const t1 = setTimeout(fitAll, 100);
        const t2 = setTimeout(fitAll, 400);
        const t3 = setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        }, 800);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            resizeObserver.disconnect();
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [data]);

    return (
        <SectionCard>
            <div className="space-y-4">
                {/* Header / Intro */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-3">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 
                            border border-border rounded-full 
                            text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold
                            bg-primary/5 
                            animate-in fade-in slide-in-from-bottom-4 duration-700"
                        >
                            <PlaneIcon className="size-3 md:size-4 fill-primary/15" />
                            <span>Commercial & General Aviation</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                            FLIGHT{" "}
                            <span className="text-primary italic font-serif text-3xl md:text-6xl">
                                EXPERIENCE
                            </span>
                            .
                        </h1>

                        <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                            In this page you can explore my flight logbook statistics, pilot credentials and overall experience since the start of my flight training.
                        </p>
                    </div>
                </div>

                {/* Interactive Leaflet Map Box */}
                <div className="relative overflow-hidden rounded-xl">
                    <div
                        ref={mapContainerRef}
                        style={{ height: "480px", minHeight: "400px", width: "100%" }}
                        className="w-full relative z-0"
                    />

                    {/* Map Overlay Legend */}
                    <div className="hidden md:blockabsolute bottom-4 left-4 z-20 pointer-events-none">
                        <div className="p-2.5 rounded-xl bg-card/90 backdrop-blur-md border border-border/80 text-[11px] font-semibold space-y-1 shadow-md">
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-[#5966ff] border border-white inline-block shrink-0" />
                                <span className="text-foreground">Aerodromes / Waypoints</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3.5 h-0.5 bg-[#5966ff] inline-block shrink-0" />
                                <span className="text-foreground">Flown Flight Trajectories</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
