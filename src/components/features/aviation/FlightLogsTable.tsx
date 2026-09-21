import { useState, useMemo } from "react";
import {
    TableIcon,
    ListFilterIcon,
    SearchIcon,
    FileTextIcon,
    CheckCircleIcon,
} from "lucide-react";
import type { AviationLogbookData } from "@/lib/logbook-parser";
import { SectionCard } from "@/components/shared";
import { Select, type SelectOption } from "@/components/ui";

const CATEGORY_OPTIONS: SelectOption<string>[] = [
    { value: "ALL", label: "All Categories" },
    { value: "PIC", label: "Pilot-in-Command (PIC)" },
    { value: "DUAL", label: "Dual / Instruction" },
    { value: "IFR", label: "Instrument (IFR)" },
    { value: "NIGHT", label: "Night Flights" },
    { value: "SIM", label: "Simulator (FSTD)" },
];

interface FlightLogsTableProps {
    data: AviationLogbookData;
}

export default function FlightLogsTable({ data }: FlightLogsTableProps) {
    const [activeTab, setActiveTab] = useState<"summary" | "entries">("summary");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAircraft, setSelectedAircraft] = useState<string>("ALL");
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
    const pageSize = 12;

    // Ensure entries are sorted newest first (latest dates & off-block times first)
    const sortedEntries = useMemo(() => {
        return [...data.entries].sort((a, b) => {
            const [d1, m1, y1] = a.date.split(".").map(Number);
            const [d2, m2, y2] = b.date.split(".").map(Number);
            const time1 = new Date(y1, m1 - 1, d1).getTime();
            const time2 = new Date(y2, m2 - 1, d2).getTime();
            if (time2 !== time1) return time2 - time1;
            if (a.offBlock && b.offBlock && a.offBlock !== b.offBlock) {
                return b.offBlock.localeCompare(a.offBlock);
            }
            return b.id.localeCompare(a.id, undefined, { numeric: true });
        });
    }, [data.entries]);

    // Aircraft types list for filtering
    const aircraftTypes = useMemo(() => {
        const set = new Set<string>();
        sortedEntries.forEach((e) => {
            if (e.aircraftType) set.add(e.aircraftType);
        });
        return ["ALL", ...Array.from(set).sort()];
    }, [sortedEntries]);

    // Options formatted for Select component
    const aircraftOptions: SelectOption<string>[] = useMemo(() => {
        return aircraftTypes.map((ac) => ({
            value: ac,
            label: ac === "ALL" ? "All Aircraft" : ac,
        }));
    }, [aircraftTypes]);

    // Filtered entries
    const filteredEntries = useMemo(() => {
        return sortedEntries.filter((entry) => {
            const query = searchQuery.toLowerCase().trim();

            if (query) {
                const matchDate = entry.date.toLowerCase().includes(query);
                const matchDep = entry.departure.toLowerCase().includes(query);
                const matchArr = entry.arrival.toLowerCase().includes(query);
                const matchAc = entry.aircraftType.toLowerCase().includes(query);
                const matchReg = entry.registration.toLowerCase().includes(query);
                const matchRemarks = entry.remarks.toLowerCase().includes(query);

                if (
                    !matchDate &&
                    !matchDep &&
                    !matchArr &&
                    !matchAc &&
                    !matchReg &&
                    !matchRemarks
                ) {
                    return false;
                }
            }

            if (selectedAircraft !== "ALL" && entry.aircraftType !== selectedAircraft) {
                return false;
            }

            if (selectedCategory === "PIC" && entry.picMinutes === 0) {
                return false;
            }
            if (selectedCategory === "DUAL" && entry.dualMinutes === 0) {
                return false;
            }
            if (
                selectedCategory === "IFR" &&
                entry.singleEngineIfrMinutes === 0 &&
                entry.multiEngineIfrMinutes === 0
            ) {
                return false;
            }
            if (selectedCategory === "NIGHT" && entry.nightMinutes === 0) {
                return false;
            }
            if (selectedCategory === "SIM" && !entry.isSimulator) {
                return false;
            }

            return true;
        });
    }, [sortedEntries, searchQuery, selectedAircraft, selectedCategory]);

    // Only display the first table page due to privacy reasons
    const paginatedEntries = useMemo(() => {
        return filteredEntries.slice(0, pageSize);
    }, [filteredEntries, pageSize]);

    return (
        <SectionCard
            aria-label="Flight Experience Logbook"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
        >
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                        <TableIcon className="size-4" />
                        <span>Aeronautical Experience Breakdown</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                        FLIGHT LOGS & CREDENTIALS
                    </h2>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium">
                        Detailed breakdown by operational category and individual pilot logbook records.
                    </p>
                </div>

                {/* View Switcher Tabs */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/50 border border-border self-start md:self-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab("summary")}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                            activeTab === "summary"
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <TableIcon className="size-4" />
                        <span>Category Summary</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("entries")}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                            activeTab === "entries"
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <FileTextIcon className="size-4" />
                        <span>Logbook Entries ({data.entries.length})</span>
                    </button>
                </div>
            </div>

            {/* TAB 1: Flight Types Summary Table (Plan Section 3) */}
            {activeTab === "summary" && (
                <div className="space-y-4">
                    <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-bold text-muted-foreground">
                                <tr>
                                    <th className="py-2 px-4">Flight Type / Category</th>
                                    <th className="py-2 px-4 hidden md:table-cell">Scope & Operations</th>
                                    <th className="py-2 px-4 text-right">Flight Hours</th>
                                    <th className="py-2 px-4 text-right">Flights</th>
                                    <th className="py-2 px-4 text-right hidden sm:table-cell">Share</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {data.typeStats.map((stat) => (
                                    <tr
                                        key={stat.key}
                                        className="hover:bg-muted/25 transition-colors group"
                                    >
                                        <td className="py-2 px-4">
                                            <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                {stat.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground md:hidden mt-1">
                                                {stat.description}
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 text-xs text-muted-foreground hidden md:table-cell">
                                            {stat.description}
                                        </td>
                                        <td className="py-2 px-4 text-right whitespace-nowrap">
                                            <span className="text-xsfont-sans font-bold text-foreground">
                                                {stat.hoursFormatted}
                                            </span>
                                            <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">
                                                ({stat.hoursDecimal} hrs)
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 text-right whitespace-nowrap font-medium text-foreground">
                                            {stat.flightsCount}
                                        </td>
                                        <td className="py-2 px-4 text-right whitespace-nowrap hidden sm:table-cell">
                                            <div className="inline-flex items-center gap-2 justify-end min-w-24">
                                                <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full"
                                                        style={{ width: `${Math.min(stat.percentOfTotal, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-mono text-muted-foreground w-8 text-right">
                                                    {stat.percentOfTotal}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 rounded-lg bg-muted/25 border border-border/50 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="size-4 text-emerald-600 shrink-0" />
                            <span>
                                All flight experience officially certified under EASA Part-FCL standard logbook documentation.
                            </span>
                        </div>
                        <span className="font-medium">
                            Total Experience: <b className="text-foreground">{data.totalHoursFormatted}</b> ({data.totalHoursDecimal} hrs)
                        </span>
                    </div>
                </div>
            )}

            {/* TAB 2: Detailed Flight Logbook Entries */}
            {activeTab === "entries" && (
                <div className="space-y-4">
                    {/* Filters & Search Row */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by airport, aircraft, remark..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-xs md:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 relative z-20">
                            <div className="flex items-center gap-2 shrink-0">
                                <ListFilterIcon className="size-4 text-muted-foreground" />
                                <span className="font-semibold text-muted-foreground text-xs md:text-sm">Filter:</span>
                            </div>
                            <Select
                                value={selectedCategory}
                                onChange={(val) => setSelectedCategory(val)}
                                options={CATEGORY_OPTIONS}
                                placeholder="Category"
                                className="flex-1 sm:w-56 sm:flex-none"
                                triggerClassName="w-full text-foreground text-xs md:text-sm"
                                valueClassName="truncate text-xs md:text-sm text-foreground font-medium"
                            />
                            <Select
                                value={selectedAircraft}
                                onChange={(val) => setSelectedAircraft(val)}
                                options={aircraftOptions}
                                placeholder="Aircraft"
                                className="flex-1 sm:w-44 sm:flex-none"
                                triggerClassName="w-full text-foreground text-xs md:text-sm"
                                valueClassName="truncate text-xs md:text-sm text-foreground font-medium"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full text-left text-xs md:text-sm">
                            <thead className="bg-muted/50 border-b border-border text-[10px] md:text-xs uppercase tracking-wider font-bold text-muted-foreground">
                                <tr>
                                    <th className="py-2 px-4">Date</th>
                                    <th className="py-2 px-4">Route</th>
                                    <th className="py-2 px-4">Aircraft</th>
                                    <th className="py-2 px-4 text-right">Duration</th>
                                    <th className="py-2 px-4 text-center">Type</th>
                                    <th className="py-2 px-4 hidden lg:table-cell">Remarks & Endorsements</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {paginatedEntries.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                            No flight log records matching your filter criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedEntries.map((entry) => (
                                        <tr
                                            key={entry.id}
                                            className="hover:bg-muted/25 transition-colors"
                                        >
                                            <td className="py-2 px-4 font-mono text-muted-foreground whitespace-nowrap">
                                                {entry.date}
                                            </td>
                                            <td className="py-2 px-4 whitespace-nowrap font-bold text-foreground">
                                                {entry.isSimulator ? (
                                                    <span className="text-muted-foreground font-normal">
                                                        FSTD Session
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <span className="text-primary">{entry.departure}</span>
                                                        <span className="text-muted-foreground text-xs font-normal">➔</span>
                                                        <span className="text-primary">{entry.arrival}</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-2 px-4 whitespace-nowrap">
                                                <div className="font-semibold text-foreground">
                                                    {entry.aircraftType}
                                                </div>
                                                {entry.registration && (
                                                    <div className="text-[10px] font-mono text-muted-foreground">
                                                        {entry.registration}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-2 px-4 text-right font-mono font-bold whitespace-nowrap text-foreground">
                                                {Math.floor(entry.totalMinutes / 60)}:
                                                {(entry.totalMinutes % 60)
                                                    .toString()
                                                    .padStart(2, "0")}
                                            </td>
                                            <td className="py-2 px-4 text-center whitespace-nowrap">
                                                {entry.picMinutes > 0 ? (
                                                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                        PIC
                                                    </span>
                                                ) : entry.dualMinutes > 0 ? (
                                                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                                        DUAL
                                                    </span>
                                                ) : entry.isSimulator ? (
                                                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                                        SIM
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-muted text-muted-foreground">
                                                        FLT
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-2 px-4 text-xs text-muted-foreground hidden lg:table-cell max-w-xs truncate">
                                                {entry.remarks}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Privacy notice / First page only info */}
                    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 rounded-lg bg-muted/25 border border-border/50 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="size-4 text-emerald-600 shrink-0" />
                            <span>
                                Displaying latest flight records (first page only for privacy reasons).
                            </span>
                        </div>
                        <span className="font-medium">
                            Showing {paginatedEntries.length} latest records
                        </span>
                    </div>
                </div>
            )}
        </SectionCard>
    );
}
