import { useEffect, useMemo, useState } from "react";
import { SEO } from "@/components/shared";
import {
    AviationHero,
    StatsCards,
    FlightLogsTable,
    ContactCTA,
} from "@/components/features/aviation";
import { parseLogbookCsv, type AviationLogbookData } from "@/lib/logbook-parser";
import { Skeleton } from "@/components/ui";

export default function Aviation() {
    const [logbookData, setLogbookData] = useState<AviationLogbookData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        fetch("/logbook/logbook_report.csv")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to load logbook data: ${res.statusText}`);
                }
                return res.text();
            })
            .then((csvText) => {
                if (!isMounted) return;
                const parsed = parseLogbookCsv(csvText);
                setLogbookData(parsed);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading logbook CSV:", err);
                if (!isMounted) return;
                setError("Unable to load flight logbook data. Please try again later.");
                setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // For privacy reasons, display only the first page with the latest entries in the logbook table
    const tableData = useMemo(() => {
        if (!logbookData) return null;
        return {
            ...logbookData,
            entries: logbookData.entries.slice(0, 12),
        };
    }, [logbookData]);

    return (
        <main className="space-y-8 md:space-y-10 mt-6 animate-in fade-in duration-700 delay-100 fill-mode-both">
            <SEO
                title="Commercial Aviation & Flight Experience | Jürgen Jacobsen"
                description="Commercial aviation journey, flight experience, and piloting credentials of Jürgen Jacobsen, licensed commercial pilot with 230+ flight hours across various aircraft types."
                canonical="/aviation"
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Aviation", path: "/aviation" },
                ]}
            />

            {loading ? (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-48 rounded-full" />
                        <Skeleton className="h-12 w-3/4 rounded-xl" />
                        <Skeleton className="h-6 w-1/2 rounded-lg" />
                        <Skeleton className="h-[460px] w-full rounded-2xl" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))}
                    </div>
                    <Skeleton className="h-96 rounded-2xl" />
                </div>
            ) : error || !logbookData || !tableData ? (
                <div className="p-8 rounded-2xl border border-destructive/20 bg-destructive/5 text-center space-y-2">
                    <p className="font-bold text-destructive">Unable to Load Flight Logs</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </div>
            ) : (
                <>
                    {/* 1. Hero Map with Flight Paths & Aerodromes */}
                    <AviationHero data={logbookData} />

                    {/* 2. Key Aviation Statistics (4 Cards) */}
                    <StatsCards data={logbookData} />

                    {/* 3. Flight Logs (Category Summary & Individual Records) */}
                    <FlightLogsTable data={tableData} />

                    {/* 9. Contact / Inquiries Section */}
                    <ContactCTA />
                </>
            )}
        </main>
    );
}
