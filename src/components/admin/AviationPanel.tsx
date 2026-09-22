import { useState, useMemo, useRef } from "react";
import { supabase, type FlightLogRow, generateFlightUniqueKey } from "@/lib/supabase";
import FlightEntryModal from "./FlightEntryModal";
import { parseLogbookCsv } from "@/lib/logbook-parser";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Upload,
    Loader2,
    AlertCircle,
    FileSpreadsheet,
    X,
} from "lucide-react";

interface AviationPanelProps {
    flightLogs: FlightLogRow[];
    loading: boolean;
    onRefresh: () => void;
}

function normalizeToIsoDate(rawDate: string): string {
    if (!rawDate) return new Date().toISOString().split("T")[0];
    const clean = rawDate.trim();
    const normalizeYear = (yearStr: string) => {
        if (yearStr.length === 2) return `20${yearStr}`;
        return yearStr;
    };
    if (clean.includes(".")) {
        const parts = clean.split(".");
        if (parts.length === 3) {
            const [d, m, y] = parts;
            return `${normalizeYear(y)}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        }
    }
    if (clean.includes("/")) {
        const parts = clean.split("/");
        if (parts.length === 3) {
            const [d, m, y] = parts;
            return `${normalizeYear(y)}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        }
    }
    if (clean.includes("-")) {
        const parts = clean.split("-");
        if (parts.length === 3) {
            if (parts[0].length === 4) {
                return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
            } else {
                const [d, m, y] = parts;
                return `${normalizeYear(y)}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
            }
        }
    }
    return clean;
}

function getErrorMessage(err: unknown): string {
    if (!err) return "Unknown error occurred.";
    if (err instanceof Error) return err.message;
    if (typeof err === "object") {
        const anyErr = err as {
            message?: string;
            details?: string;
            hint?: string;
            error_description?: string;
            code?: string;
        };
        if (anyErr.message) {
            let msg = anyErr.message;
            if (anyErr.details) msg += ` (${anyErr.details})`;
            if (anyErr.hint) msg += ` - Hint: ${anyErr.hint}`;
            return msg;
        }
        if (anyErr.error_description) return anyErr.error_description;
        try {
            return JSON.stringify(err);
        } catch {
            return String(err);
        }
    }
    return String(err);
}

export default function AviationPanel({
    flightLogs,
    loading,
    onRefresh,
}: AviationPanelProps) {
    const [search, setSearch] = useState("");
    const [editingFlight, setEditingFlight] = useState<FlightLogRow | null>(null);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // CSV Importer state
    const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [csvPreviewCount, setCsvPreviewCount] = useState<number>(0);
    const [csvParsedRows, setCsvParsedRows] = useState<
        Omit<FlightLogRow, "id">[]
    >([]);
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [importError, setImportError] = useState<string | null>(null);
    const [importSuccess, setImportSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filtered flights
    const filteredFlights = useMemo(() => {
        return flightLogs.filter((f) => {
            const term = search.toLowerCase();
            return (
                f.departure_airport.toLowerCase().includes(term) ||
                f.arrival_airport.toLowerCase().includes(term) ||
                (f.aircraft_type || "").toLowerCase().includes(term) ||
                (f.registration || "").toLowerCase().includes(term) ||
                f.flight_date.includes(term) ||
                (f.remarks || "").toLowerCase().includes(term)
            );
        });
    }, [flightLogs, search]);

    // Computed totals
    const metrics = useMemo(() => {
        let totalMin = 0;
        let simMin = 0;
        let dayLandings = 0;
        let nightLandings = 0;

        flightLogs.forEach((f) => {
            totalMin += f.total_minutes || 0;
            simMin += f.synthetic_minutes || 0;
            dayLandings += f.landings_day || 0;
            nightLandings += f.landings_night || 0;
        });

        const totalHours = (totalMin / 60).toFixed(1);
        const flightHours = ((totalMin - simMin) / 60).toFixed(1);
        const simHours = (simMin / 60).toFixed(1);

        return {
            totalHours,
            flightHours,
            simHours,
            flightsCount: flightLogs.length,
            totalLandings: dayLandings + nightLandings,
        };
    }, [flightLogs]);

    const handleCreateFlight = () => {
        setEditingFlight(null);
        setIsEntryModalOpen(true);
    };

    const handleEditFlight = (flight: FlightLogRow) => {
        setEditingFlight(flight);
        setIsEntryModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        setActionLoading(id);
        try {
            const { error } = await supabase.from("flight_logs").delete().eq("id", id);
            if (error) throw error;
            setDeletingId(null);
            onRefresh();
        } catch (err) {
            console.error("Failed to delete flight log:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const processCsvFile = async (file: File) => {
        setCsvFile(file);
        setImportError(null);
        setImportSuccess(null);

        try {
            const text = await file.text();
            const parsed = parseLogbookCsv(text);

            if (parsed.entries.length === 0) {
                setImportError("No valid flight entries found in CSV.");
                return;
            }

            const mappedRows: Omit<FlightLogRow, "id">[] = parsed.entries.map((entry) => {
                const isoDate = normalizeToIsoDate(entry.date);
                const dep = (entry.departure || "ZZZZ").trim().toUpperCase().slice(0, 4);
                const arr = (entry.arrival || "ZZZZ").trim().toUpperCase().slice(0, 4);
                const reg = entry.registration ? entry.registration.trim().toUpperCase().slice(0, 10) : null;
                const offBlock = entry.offBlock ? entry.offBlock.trim() : null;
                const onBlock = entry.onBlock ? entry.onBlock.trim() : null;

                return {
                    flight_date: isoDate,
                    departure_airport: dep,
                    arrival_airport: arr,
                    off_block: offBlock,
                    on_block: onBlock,
                    route: null,
                    unique: generateFlightUniqueKey(
                        dep,
                        arr,
                        reg,
                        isoDate,
                        offBlock
                    ),
                    aircraft_type: (entry.aircraftType || "N/A").trim().toUpperCase().slice(0, 10),
                    registration: reg,
                    pic_name: entry.picName ? entry.picName.trim() : null,
                    total_minutes: Number(entry.totalMinutes) || 0,
                    day_minutes: Number(entry.dayMinutes) || 0,
                    night_minutes: Number(entry.nightMinutes) || 0,
                    single_engine_vfr_minutes: Number(entry.singleEngineVfrMinutes) || 0,
                    single_engine_ifr_minutes: Number(entry.singleEngineIfrMinutes) || 0,
                    multi_engine_vfr_minutes: Number(entry.multiEngineVfrMinutes) || 0,
                    multi_engine_ifr_minutes: Number(entry.multiEngineIfrMinutes) || 0,
                    pic_minutes: Number(entry.picMinutes) || 0,
                    dual_minutes: Number(entry.dualMinutes) || 0,
                    synthetic_minutes: Number(entry.syntheticMinutes) || 0,
                    landings_day: Number(entry.landingsDay) || 0,
                    landings_night: Number(entry.landingsNight) || 0,
                    remarks: entry.remarks ? entry.remarks.trim() : null,
                    is_simulator: Boolean(entry.isSimulator),
                    is_cross_country: Boolean(entry.isCrossCountry),
                    distance_nm: Number(entry.distanceNm) || 0,
                };
            });

            setCsvParsedRows(mappedRows);
            setCsvPreviewCount(mappedRows.length);
        } catch (err: unknown) {
            setImportError("Failed to parse CSV file: " + getErrorMessage(err));
        }
    };

    const handleCommitCsv = async () => {
        if (csvParsedRows.length === 0) return;
        setImporting(true);
        setImportProgress(0);
        setImportError(null);

        try {
            const batchSize = 50;
            const total = csvParsedRows.length;
            for (let i = 0; i < total; i += batchSize) {
                const batch = csvParsedRows.slice(i, i + batchSize);
                const { error } = await supabase
                    .from("flight_logs")
                    .upsert(batch, { onConflict: "unique", ignoreDuplicates: true });
                if (error) throw error;
                setImportProgress(Math.min(100, Math.round(((i + batch.length) / total) * 100)));
            }

            setImportSuccess(`Successfully imported ${total} flight records!`);
            onRefresh();
            setTimeout(() => {
                handleCloseCsvModal();
            }, 1500);
        } catch (err: unknown) {
            setImportError("Import failed: " + getErrorMessage(err));
        } finally {
            setImporting(false);
        }
    };

    const handleCloseCsvModal = () => {
        setIsCsvModalOpen(false);
        setCsvFile(null);
        setCsvParsedRows([]);
        setCsvPreviewCount(0);
        setImportError(null);
        setImportSuccess(null);
        setIsDragging(false);
    };

    return (
        <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl border border-border/80 bg-card">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Total Logged Hours
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-1 font-mono">
                        {metrics.totalHours} <span className="text-xs font-normal text-muted-foreground">hrs</span>
                    </p>
                </div>
                <div className="p-4 rounded-2xl border border-border/80 bg-card">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Aircraft Flight Hours
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-1 font-mono">
                        {metrics.flightHours} <span className="text-xs font-normal text-muted-foreground">hrs</span>
                    </p>
                </div>
                <div className="p-4 rounded-2xl border border-border/80 bg-card">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Simulator (FSTD) Hours
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-1 font-mono">
                        {metrics.simHours} <span className="text-xs font-normal text-muted-foreground">hrs</span>
                    </p>
                </div>
                <div className="p-4 rounded-2xl border border-border/80 bg-card">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Logged Flights & Landings
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-1 font-mono">
                        {metrics.flightsCount}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                            flts / {metrics.totalLandings} ldg
                        </span>
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search flights by ICAO, type, reg, remarks..."
                        className="w-full bg-background border border-input rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setCsvFile(null);
                            setCsvParsedRows([]);
                            setCsvPreviewCount(0);
                            setImportError(null);
                            setImportSuccess(null);
                            setIsCsvModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card text-foreground font-medium text-xs sm:text-sm hover:bg-muted transition cursor-pointer shadow-2xs"
                    >
                        <Upload className="w-4 h-4 text-primary" />
                        <span>Import CSV</span>
                    </button>

                    <button
                        onClick={handleCreateFlight}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-xs sm:text-sm hover:opacity-90 transition cursor-pointer shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Log Flight</span>
                    </button>
                </div>
            </div>

            {/* Flights Table */}
            <div className="border border-border/80 rounded-2xl bg-card overflow-hidden shadow-xs">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <p className="text-xs font-mono">Loading flight logs from Supabase...</p>
                    </div>
                ) : filteredFlights.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground space-y-2">
                        <p className="text-sm font-medium">No flight logs found</p>
                        <p className="text-xs">
                            {search
                                ? "No flights match your search query."
                                : "Log a new flight or import a logbook CSV."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                                <tr>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Route</th>
                                    <th className="py-3 px-4">Aircraft</th>
                                    <th className="py-3 px-4 hidden sm:table-cell">Duration</th>
                                    <th className="py-3 px-4 hidden md:table-cell">Type</th>
                                    <th className="py-3 px-4 hidden lg:table-cell">Remarks</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {filteredFlights.map((f) => {
                                    const totalHours = (f.total_minutes / 60).toFixed(1);
                                    return (
                                        <tr key={f.id} className="hover:bg-muted/20 transition">
                                            <td className="py-3 px-4 font-mono text-xs whitespace-nowrap text-foreground">
                                                {f.flight_date}
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1 font-mono font-bold text-xs text-foreground">
                                                    <span>{f.departure_airport}</span>
                                                    <span className="text-muted-foreground font-normal">→</span>
                                                    <span>{f.arrival_airport}</span>
                                                </div>
                                                {f.route && (
                                                    <div className="text-[10px] text-primary/80 font-mono truncate max-w-[180px]" title={f.route}>
                                                        {f.route}
                                                    </div>
                                                )}
                                                {f.distance_nm > 0 && !f.route && (
                                                    <div className="text-[10px] text-muted-foreground">
                                                        {f.distance_nm} NM
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <div className="font-semibold text-xs text-foreground">
                                                    {f.aircraft_type}
                                                </div>
                                                <div className="text-[10px] font-mono text-muted-foreground">
                                                    {f.registration || "—"}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 hidden sm:table-cell whitespace-nowrap font-mono text-xs">
                                                <div className="text-foreground font-semibold">
                                                    {totalHours}h
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {f.total_minutes}m
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 hidden md:table-cell whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {f.is_simulator && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium">
                                                            SIM
                                                        </span>
                                                    )}
                                                    {f.is_cross_country && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                                                            XC
                                                        </span>
                                                    )}
                                                    {f.single_engine_ifr_minutes > 0 && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                                                            IFR
                                                        </span>
                                                    )}
                                                    {f.multi_engine_vfr_minutes > 0 || f.multi_engine_ifr_minutes > 0 ? (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                                                            ME
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 hidden lg:table-cell text-xs text-muted-foreground max-w-xs truncate">
                                                {f.remarks || "—"}
                                            </td>
                                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleEditFlight(f)}
                                                        title="Edit flight"
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingId(f.id)}
                                                        title="Delete flight"
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* CSV Import Modal */}
            {isCsvModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
                    <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileSpreadsheet className="w-5 h-5 text-primary" />
                                <h3 className="font-bold text-base text-foreground">
                                    Import Logbook CSV
                                </h3>
                            </div>
                            <button
                                onClick={handleCloseCsvModal}
                                className="text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {importError && (
                            <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs">
                                {importError}
                            </div>
                        )}

                        {importSuccess && (
                            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                                {importSuccess}
                            </div>
                        )}

                        <div className="space-y-3">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Upload your standard EASA logbook CSV export (e.g. <span className="font-mono text-foreground font-semibold">logbook_report.csv</span>). Columns will be parsed and validated client-side before inserting into Supabase.
                            </p>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsDragging(true);
                                }}
                                onDragEnter={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsDragging(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsDragging(false);
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsDragging(false);
                                    const files = e.dataTransfer.files;
                                    if (files && files.length > 0) {
                                        const droppedFile = files[0];
                                        if (
                                            droppedFile.name.toLowerCase().endsWith(".csv") ||
                                            droppedFile.type.includes("csv") ||
                                            droppedFile.type.includes("text")
                                        ) {
                                            processCsvFile(droppedFile);
                                        } else {
                                            setImportError("Please drop a valid .csv file.");
                                        }
                                    }
                                }}
                                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                                    isDragging
                                        ? "border-primary bg-primary/10 scale-[1.01]"
                                        : "border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/30"
                                }`}
                            >
                                <Upload
                                    className={`w-8 h-8 mx-auto mb-2 transition-colors ${
                                        isDragging ? "text-primary" : "text-muted-foreground"
                                    }`}
                                />
                                <p className="text-xs font-semibold text-foreground">
                                    {isDragging
                                        ? "Drop your CSV file here..."
                                        : csvFile
                                          ? csvFile.name
                                          : "Click to select or drag & drop CSV file"}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-1">
                                    Supports EASA semicolon or comma delimited logbooks
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept=".csv,text/csv"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            processCsvFile(file);
                                        }
                                        e.target.value = "";
                                    }}
                                />
                            </div>

                            {csvPreviewCount > 0 && (
                                <div className="p-3 rounded-xl border border-border/80 bg-muted/30 text-xs space-y-1">
                                    <div className="flex items-center justify-between font-semibold text-foreground">
                                        <span>Parsed Records Ready</span>
                                        <span className="font-mono text-primary font-bold">
                                            {csvPreviewCount} flights
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        First entry: {csvParsedRows[0]?.flight_date} (
                                        {csvParsedRows[0]?.departure_airport} →{" "}
                                        {csvParsedRows[0]?.arrival_airport})
                                    </p>
                                </div>
                            )}

                            {importing && (
                                <div className="space-y-1.5 pt-2">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Importing to Supabase...</span>
                                        <span className="font-mono">{importProgress}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-primary h-2 transition-all duration-200"
                                            style={{ width: `${importProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                            <button
                                type="button"
                                onClick={handleCloseCsvModal}
                                className="px-3.5 py-1.5 rounded-xl border border-input text-xs hover:bg-muted cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={importing || csvPreviewCount === 0}
                                onClick={handleCommitCsv}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 cursor-pointer disabled:opacity-50"
                            >
                                {importing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                <span>Commit {csvPreviewCount} Flights</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Flight Delete Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
                    <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
                        <div className="flex items-center gap-3 text-destructive">
                            <AlertCircle className="w-6 h-6" />
                            <h3 className="font-bold text-base">Delete Flight Entry</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Are you sure you want to delete this flight record? This cannot be undone.
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="px-3.5 py-1.5 rounded-xl border border-input text-xs font-medium hover:bg-muted cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deletingId)}
                                disabled={actionLoading === deletingId}
                                className="px-4 py-1.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-medium hover:opacity-90 cursor-pointer disabled:opacity-50"
                            >
                                {actionLoading === deletingId ? "Deleting..." : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Entry / Edit Modal */}
            <FlightEntryModal
                isOpen={isEntryModalOpen}
                entry={editingFlight}
                onClose={() => setIsEntryModalOpen(false)}
                onSaved={onRefresh}
            />
        </div>
    );
}
