import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FeatureCollection, LineString, Point } from "geojson";
import { PlaneIcon, Triangle } from "lucide-react";
import type { AviationLogbookData } from "@/lib/logbook-parser";
import { AIRPORTS_DATABASE } from "@/lib/aviation-airports";
import { SectionCard } from "@/components/shared";

interface HeroMapProps {
    data: AviationLogbookData;
}

export default function HeroMap({ data }: HeroMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Clean up previous instance if any
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";
        mapboxgl.accessToken = mapboxToken;

        // Initialize Mapbox map centered on the Iberian Peninsula
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/jurgenjacosben/cmub2wexe004u01s8a7fv4sfo",
            center: [-6.5, 41.2],
            zoom: 5.5,
            attributionControl: true,
        });

        mapInstanceRef.current = map;

        // Add navigation controls (zoom in/out, compass)
        map.addControl(
            new mapboxgl.NavigationControl({ showCompass: true }),
            "top-right",
        );

        // Prepare GeoJSON for flight routes
        const routesGeoJson: FeatureCollection<LineString> = {
            type: "FeatureCollection",
            features: data.routes.map((route, index) => {
                const aircraftLabel =
                    route.aircraftTypes.length > 0
                        ? route.aircraftTypes.join(", ")
                        : "General Aviation";

                const depAirport = AIRPORTS_DATABASE[route.fromIcao];
                const arrAirport = AIRPORTS_DATABASE[route.toIcao];

                return {
                    type: "Feature",
                    id: index,
                    properties: {
                        fromIcao: route.fromIcao,
                        toIcao: route.toIcao,
                        depCity: depAirport?.city || depAirport?.name || route.fromIcao,
                        arrCity: arrAirport?.city || arrAirport?.name || route.toIcao,
                        distanceNm: route.distanceNm,
                        flightCount: route.flightCount,
                        aircraftLabel,
                    },
                    geometry: {
                        type: "LineString",
                        coordinates: [
                            [route.fromCoords[1], route.fromCoords[0]],
                            [route.toCoords[1], route.toCoords[0]],
                        ],
                    },
                };
            }),
        };

        // Prepare GeoJSON for airports
        const airportsGeoJson: FeatureCollection<Point> = {
            type: "FeatureCollection",
            features: data.uniqueAirports.map((airport) => {
                const airportData = AIRPORTS_DATABASE[airport.icao];
                const connectedRoutes = data.routes.filter(
                    (r) =>
                        r.fromIcao === airport.icao ||
                        r.toIcao === airport.icao,
                );
                const connectedDestinations = Array.from(
                    new Set(
                        connectedRoutes.map((r) =>
                            r.fromIcao === airport.icao ? r.toIcao : r.fromIcao,
                        ),
                    ),
                );

                return {
                    type: "Feature",
                    properties: {
                        icao: airport.icao,
                        iata: airportData?.iata || "",
                        name: airport.name,
                        city: airport.city,
                        country: airport.country,
                        lat: airport.lat,
                        lon: airport.lon,
                        operationsCount: airport.operationsCount,
                        connectedCount: connectedRoutes.length,
                        connectedDestinations: JSON.stringify(connectedDestinations),
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [airport.lon, airport.lat],
                    },
                };
            }),
        };

        map.on("load", () => {
            // 1. Flight Paths Source & Layers
            map.addSource("flight-routes", {
                type: "geojson",
                data: routesGeoJson,
            });

            // Wider invisible hitbox layer for effortless hovering
            map.addLayer({
                id: "flight-routes-hitbox",
                type: "line",
                source: "flight-routes",
                layout: {
                    "line-cap": "round",
                    "line-join": "round",
                },
                paint: {
                    "line-color": "#5966ff",
                    "line-width": 16,
                    "line-opacity": 0,
                },
            });

            // Visible crisp flight trajectory line
            map.addLayer({
                id: "flight-routes-line",
                type: "line",
                source: "flight-routes",
                layout: {
                    "line-cap": "round",
                    "line-join": "round",
                },
                paint: {
                    "line-color": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        "#a5b4fc",
                        "#5966ff",
                    ],
                    "line-width": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        2.75,
                        1.75,
                    ],
                    "line-opacity": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        1,
                        0.9,
                    ],
                },
            });

            // 2. Airports Source & Circle Layer
            map.addSource("airports", {
                type: "geojson",
                data: airportsGeoJson,
            });

            // Outer soft halo
            map.addLayer({
                id: "airports-halo",
                type: "circle",
                source: "airports",
                paint: {
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        4, 5,
                        6, 7,
                        8, 9,
                        10, 12,
                    ],
                    "circle-color": "#5966ff",
                    "circle-opacity": 0.25,
                },
            });

            // Inner solid waypoint dot
            map.addLayer({
                id: "airports-circle",
                type: "circle",
                source: "airports",
                paint: {
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        4, 2.5,
                        6, 3.5,
                        8, 5,
                        10, 6.5,
                    ],
                    "circle-color": "#5966ff",
                    "circle-stroke-color": "#ffffff",
                    "circle-stroke-width": 1.5,
                    "circle-opacity": 0.95,
                },
            });

            // 3. Hover Tooltip for Routes
            let hoveredRouteId: number | string | null = null;
            const routePopup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: "aviation-mapbox-tooltip",
                offset: 12,
            });

            map.on("mousemove", "flight-routes-hitbox", (e) => {
                if (!e.features || e.features.length === 0) return;
                map.getCanvas().style.cursor = "pointer";

                const feature = e.features[0] as unknown as {
                    id?: number | string;
                    properties?: {
                        fromIcao: string;
                        toIcao: string;
                        depCity: string;
                        arrCity: string;
                        distanceNm: number;
                        flightCount: number;
                        aircraftLabel: string;
                    };
                };
                const featureId = feature.id ?? null;
                if (hoveredRouteId !== null) {
                    map.setFeatureState(
                        { source: "flight-routes", id: hoveredRouteId },
                        { hover: false },
                    );
                }
                hoveredRouteId = featureId;
                if (hoveredRouteId !== null) {
                    map.setFeatureState(
                        { source: "flight-routes", id: hoveredRouteId },
                        { hover: true },
                    );
                }

                const props = feature.properties || {
                    fromIcao: "",
                    toIcao: "",
                    depCity: "",
                    arrCity: "",
                    distanceNm: 0,
                    flightCount: 0,
                    aircraftLabel: "",
                };

                const distanceKm = Math.round(props.distanceNm * 1.852);

                routePopup
                    .setLngLat(e.lngLat)
                    .setHTML(
                        `<div class="aviation-route-popup px-4 py-2 font-sans space-y-2 min-w-60 max-w-72">
                            <div class="flex items-center justify-between gap-2 border-b border-border pb-2">
                                <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
                                    <span>Flight Route</span>
                                </div>
                                <span class="text-[10px] font-mono font-bold text-muted-foreground">
                                    ${props.flightCount} ${props.flightCount === 1 ? "Flight" : "Flights"}
                                </span>
                            </div>

                            <div class="flex items-center justify-between gap-2 pt-1">
                                <div class="min-w-0">
                                    <span class="font-mono font-black text-base text-foreground tracking-tight">${props.fromIcao}</span>
                                    <p class="text-[11px] text-muted-foreground truncate max-w-22 leading-tight">${props.depCity}</p>
                                </div>
                                <div class="flex flex-col items-center shrink-0 px-2">
                                    <svg class="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M5 12h14m-7-7 7 7-7 7"/>
                                    </svg>
                                    <span class="text-[10px] font-sans font-medium text-muted-foreground mt-1">${props.distanceNm} NM</span>
                                </div>
                                <div class="min-w-0 text-right">
                                    <span class="font-mono font-black text-base text-foreground tracking-tight">${props.toIcao}</span>
                                    <p class="text-[11px] text-muted-foreground truncate max-w-22 leading-tight">${props.arrCity}</p>
                                </div>
                            </div>

                            <div class="pt-2 border-t border-border flex flex-col gap-1 text-[10px]">
                                <div class="flex items-center justify-between text-muted-foreground">
                                    <span>Distance</span>
                                    <span class="font-bold text-foreground">${props.distanceNm} NM <span class="text-muted-foreground font-normal">(${distanceKm} km)</span></span>
                                </div>
                                <div class="flex items-center justify-between text-muted-foreground">
                                    <span>Aircraft</span>
                                    <span class="font-semibold text-primary truncate max-w-38 text-right">${props.aircraftLabel}</span>
                                </div>
                            </div>
                        </div>`,
                    )
                    .addTo(map);
            });

            map.on("mouseleave", "flight-routes-hitbox", () => {
                map.getCanvas().style.cursor = "";
                if (hoveredRouteId !== null) {
                    map.setFeatureState(
                        { source: "flight-routes", id: hoveredRouteId },
                        { hover: false },
                    );
                    hoveredRouteId = null;
                }
                routePopup.remove();
            });

            map.on("mouseenter", "airports-circle", () => {
                map.getCanvas().style.cursor = "pointer";
            });

            map.on("mouseleave", "airports-circle", () => {
                map.getCanvas().style.cursor = "";
            });

            // 5. Fit Bounds to All Coordinates
            const bounds = new mapboxgl.LngLatBounds();
            data.routes.forEach((route) => {
                bounds.extend([route.fromCoords[1], route.fromCoords[0]]);
                bounds.extend([route.toCoords[1], route.toCoords[0]]);
            });
            data.uniqueAirports.forEach((airport) => {
                bounds.extend([airport.lon, airport.lat]);
            });

            if (!bounds.isEmpty()) {
                map.fitBounds(bounds, { padding: 40, maxZoom: 8, duration: 1000 });
            }
        });

        // ResizeObserver to automatically resize Mapbox canvas on container dimensions change
        const resizeObserver = new ResizeObserver(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.resize();
            }
        });
        resizeObserver.observe(mapContainerRef.current);

        return () => {
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

                <div className="relative overflow-hidden rounded-xl">
                    <div
                        ref={mapContainerRef}
                        className="w-full relative z-0 aspect-square md:aspect-auto md:h-120 md:min-h-100"
                    />
                </div>

                {/* Map Overlay Legend */}
                <div className="hidden md:inline-flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2 rounded-full px-4 py-1 border border-border bg-primary/5">
                        <span className="size-2 rounded-full bg-[#5966ff] inline-block shrink-0" />
                        <span className="text-foreground">Aerodromes</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full px-4 py-1 border border-border bg-primary/5">
                        <Triangle className="size-3 fill-[#5966ff] inline-block stroke-[#5966ff] shrink-0" />
                        <span className="text-foreground">Waypoints</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full px-4 py-1 border border-border bg-primary/5">
                        <span className="w-4 h-1 bg-[#5966ff] rounded inline-block shrink-0" />
                        <span className="text-foreground">Flight Trajectories</span>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
