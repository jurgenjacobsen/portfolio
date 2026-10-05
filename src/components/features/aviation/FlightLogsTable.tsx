import { useState, useMemo } from "react";
import {
    TableIcon,
    FilterIcon,
    PlaneIcon,
    SearchIcon,
    FileTextIcon,
    CheckCircleIcon,
    ChevronDown,
    X,
} from "lucide-react";
import type { AviationLogbookData } from "@/lib/logbook-parser";
import { SectionCard } from "@/components/shared";
import { Input, Select, type SelectOption } from "@/components/ui";
import { cn } from "@/lib/utils";

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

    const paginatedEntries = useMemo(() => {
        return filteredEntries.slice(0, pageSize);
    }, [filteredEntries, pageSize]);

    const hasActiveFilters =
        selectedCategory !== "ALL" ||
        selectedAircraft !== "ALL" ||
        searchQuery.trim() !== "";

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("ALL");
        setSelectedAircraft("ALL");
    };

    return (
        <SectionCard
            aria-label="Flight Experience Logbook"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
        >
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
                        <TableIcon className="size-4" />
                        <span>Aeronautical Experience Breakdown</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                        FLIGHT LOGS & CREDENTIALS
                    </h2>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                        Detailed breakdown by operational category and individual pilot logbook records.
                    </p>
                </div>

                {/* View Switcher Tabs */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/50 border border-border self-start md:self-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                    <button
                        type="button"
                        onClick={() => setActiveTab("summary")}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-[background-color,color,box-shadow] duration-300 cursor-pointer ${
                            activeTab === "summary"
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                        data-cuelume-tap="toggle"
                    >
                        <TableIcon className="size-4" />
                        <span>Category Summary</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("entries")}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-[background-color,color,box-shadow] duration-300 cursor-pointer ${
                            activeTab === "entries"
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                        data-cuelume-tap="toggle"
                    >
                        <FileTextIcon className="size-4" />
                        <span>Logbook Entries ({data.entries.length})</span>
                    </button>
                </div>
            </div>

            {/* TAB 1: Flight Types Summary Table (Plan Section 3) */}
            {activeTab === "summary" && (
                <div className="space-y-4 animate-in fade-in duration-500 fill-mode-both">
                    <div className="overflow-x-auto rounded-lg border border-border animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
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

                    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 rounded-lg bg-muted/25 border border-border/50 text-xs text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
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
                <div className="space-y-4 animate-in fade-in duration-500 fill-mode-both">
                    {/* Filters & Search Row */}
                    <div
                        className={cn(
                            "grid grid-cols-1 items-center gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both relative z-20 transition-[grid-template-columns] duration-300 ease-in-out",
                            hasActiveFilters
                                ? "md:grid-cols-[1fr_1.25fr]"
                                : "md:grid-cols-[1fr_1fr]",
                        )}
                    >
                        {/* Search Input */}
                        <div className="relative w-full group">
                            <SearchIcon
                                aria-hidden="true"
                                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors"
                            />
                            <Input
                                type="search"
                                name="search"
                                aria-label="Search flight logs"
                                autoComplete="off"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by airport, aircraft, remark..."
                                className="pl-10 py-2 rounded-xl bg-muted/30 border-border/50 focus-visible:ring-primary/10 focus-visible:border-primary/20"
                                data-cuelume-type
                            />
                        </div>

                        {/* Filters and Sorting */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-4 w-full md:w-auto relative z-10">
                            <Select
                                aria-label="Filter flight logs by category"
                                value={selectedCategory}
                                onChange={(val) => setSelectedCategory(val)}
                                options={CATEGORY_OPTIONS}
                                placeholder="Category"
                                className="flex-1 min-w-0"
                                triggerClassName="rounded-xl bg-muted/30 border-border/50 w-full"
                                renderTrigger={(selectedOption, isOpen) => (
                                    <>
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <FilterIcon
                                                aria-hidden="true"
                                                className="size-4 text-muted-foreground shrink-0"
                                            />
                                            <span className="truncate text-sm text-foreground">
                                                {selectedOption
                                                    ? selectedOption.label
                                                    : "Category"}
                                            </span>
                                        </div>
                                        <span aria-hidden="true">
                                            <ChevronDown
                                                className={`size-4 stroke-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                            />
                                        </span>
                                    </>
                                )}
                            />

                            <Select
                                aria-label="Filter flight logs by aircraft"
                                value={selectedAircraft}
                                onChange={(val) => setSelectedAircraft(val)}
                                options={aircraftOptions}
                                placeholder="Aircraft"
                                className="flex-1 min-w-0"
                                triggerClassName="rounded-xl bg-muted/30 border-border/50 w-full"
                                renderTrigger={(selectedOption, isOpen) => (
                                    <>
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <PlaneIcon
                                                aria-hidden="true"
                                                className="size-4 text-muted-foreground shrink-0"
                                            />
                                            <span className="truncate text-sm text-foreground">
                                                {selectedOption
                                                    ? selectedOption.label
                                                    : "Aircraft"}
                                            </span>
                                        </div>
                                        <span aria-hidden="true">
                                            <ChevronDown
                                                className={`size-4 stroke-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                            />
                                        </span>
                                    </>
                                )}
                            />

                            {/* Clear Filters Button */}
                            <div
                                className={cn(
                                    "transition-[max-width,opacity,transform,margin] duration-300 ease-in-out overflow-hidden flex items-center shrink-0",
                                    hasActiveFilters
                                        ? "w-auto max-w-28 opacity-100 scale-100 translate-x-0 ml-0"
                                        : "w-0 max-w-0 opacity-0 scale-95 translate-x-2 -ml-2 md:-ml-3 pointer-events-none",
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    tabIndex={hasActiveFilters ? 0 : -1}
                                    title="Clear all filters"
                                    aria-label="Clear all filters"
                                    className="px-4 py-2 rounded-xl border border-border/50 bg-muted/30 hover:text-muted-foreground text-foreground transition-colors duration-300 text-xs md:text-sm flex items-center justify-center gap-1 shrink-0 cursor-pointer whitespace-nowrap group"
                                    data-cuelume-tap="close"
                                >
                                    <X
                                        aria-hidden="true"
                                        className="size-4 group-hover:rotate-90 transition-transform duration-200"
                                    />
                                    <span>Clear</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg border border-border animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
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
                    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 rounded-lg bg-muted/25 border border-border/50 text-xs text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 fill-mode-both">
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
