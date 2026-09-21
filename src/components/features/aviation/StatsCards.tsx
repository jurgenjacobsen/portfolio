import { ClockIcon, PlaneIcon, CompassIcon, MapPinIcon } from "lucide-react";
import type { AviationLogbookData } from "@/lib/logbook-parser";

interface StatsCardsProps {
    data: AviationLogbookData;
}

export default function StatsCards({ data }: StatsCardsProps) {
    const cards = [
        {
            label: "Total Flight Hours",
            icon: ClockIcon,
            value: `${data.totalHoursDecimal} hrs`,
            subtitle: `${data.aircraftHoursDecimal} hrs Aircraft • ${data.simulatorHoursDecimal} hrs FSTD`,
            delay: 100,
        },
        {
            label: "Number of Flights",
            icon: PlaneIcon,
            value: `${data.totalFlightsCount}`,
            subtitle: `${data.aircraftFlightsCount} Flights • ${data.simulatorSessionsCount} Sim Sessions`,
            delay: 200,
        },
        {
            label: "Estimated Distance",
            icon: CompassIcon,
            value: `${data.totalDistanceNm.toLocaleString()} NM`,
            subtitle: `~${Math.round(data.totalDistanceNm * 1.852).toLocaleString()} km Ground Distance`,
            delay: 300,
        },
        {
            label: "Airports Visited",
            icon: MapPinIcon,
            value: `${data.airportsVisitedCount} Aerodromes`,
            subtitle: "Operations Across Europe",
            delay: 400,
        },
    ];

    return (
        <section
            aria-label="Aviation Key Statistics"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
            {cards.map((card) => {
                const IconComponent = card.icon;
                return (
                    <div
                        key={card.label}
                        style={{ animationDelay: `${card.delay}ms` }}
                        className="p-6 rounded-xl border border-border/75 bg-card hover:border-primary/50 transition-all shadow-md flex flex-col justify-between group animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {card.label}
                            </span>
                            <div className="p-1 rounded-lg bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <IconComponent className="size-4" />
                            </div>
                        </div>

                        <div>
                            <div className="text-xl md:text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                                {card.value}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium mt-2">
                                {card.subtitle}
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
