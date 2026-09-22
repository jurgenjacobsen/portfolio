import { useState } from "react";
import { supabase, type FlightLogRow, generateFlightUniqueKey } from "@/lib/supabase";
import { AIRPORTS_DATABASE, calculateDistanceNm } from "@/lib/aviation-airports";
import { X, Save, Loader2, Plane } from "lucide-react";

interface FlightEntryModalProps {
    entry: FlightLogRow | null; // null = create new
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
}

function FlightEntryDialog({
    entry,
    onClose,
    onSaved,
}: Omit<FlightEntryModalProps, "isOpen">) {
    const isEdit = Boolean(entry);
    const today = new Date().toISOString().split("T")[0];

    const [flightDate, setFlightDate] = useState(entry?.flight_date || today);
    const [depAirport, setDepAirport] = useState(entry?.departure_airport || "LPVL");
    const [arrAirport, setArrAirport] = useState(entry?.arrival_airport || "LPVL");
    const [offBlock, setOffBlock] = useState(entry?.off_block || "");
    const [onBlock, setOnBlock] = useState(entry?.on_block || "");
    const [route, setRoute] = useState(entry?.route || "");
    const [aircraftType, setAircraftType] = useState(entry?.aircraft_type || "C172");
    const [registration, setRegistration] = useState(entry?.registration || "CS-DLD");
    const [picName, setPicName] = useState(entry?.pic_name || "Self");

    const [totalMinutes, setTotalMinutes] = useState(entry?.total_minutes ?? 60);
    const [dayMinutes, setDayMinutes] = useState(entry?.day_minutes ?? 60);
    const [nightMinutes, setNightMinutes] = useState(entry?.night_minutes ?? 0);
    const [seVfr, setSeVfr] = useState(entry?.single_engine_vfr_minutes ?? 60);
    const [seIfr, setSeIfr] = useState(entry?.single_engine_ifr_minutes ?? 0);
    const [meVfr, setMeVfr] = useState(entry?.multi_engine_vfr_minutes ?? 0);
    const [meIfr, setMeIfr] = useState(entry?.multi_engine_ifr_minutes ?? 0);
    const [picMinutes, setPicMinutes] = useState(entry?.pic_minutes ?? 60);
    const [dualMinutes, setDualMinutes] = useState(entry?.dual_minutes ?? 0);
    const [synthMinutes, setSynthMinutes] = useState(entry?.synthetic_minutes ?? 0);

    const [landingsDay, setLandingsDay] = useState(entry?.landings_day ?? 1);
    const [landingsNight, setLandingsNight] = useState(entry?.landings_night ?? 0);
    const [remarks, setRemarks] = useState(entry?.remarks || "");
    const [isSim, setIsSim] = useState(Boolean(entry?.is_simulator));
    const [isXCountry, setIsXCountry] = useState(Boolean(entry?.is_cross_country));
    const [distanceNm, setDistanceNm] = useState(entry?.distance_nm ?? 0);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Auto calculate distance between airports when departure/arrival changes
    const autoCalcDistance = (dep: string, arr: string) => {
        const d = dep.toUpperCase().trim();
        const a = arr.toUpperCase().trim();
        const ap1 = AIRPORTS_DATABASE[d];
        const ap2 = AIRPORTS_DATABASE[a];
        if (ap1 && ap2 && d !== a) {
            const calculated = calculateDistanceNm(ap1.lat, ap1.lon, ap2.lat, ap2.lon);
            setDistanceNm(calculated);
            setIsXCountry(true);
        } else if (d === a) {
            setDistanceNm(0);
            setIsXCountry(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        const dep = depAirport.trim().toUpperCase();
        const arr = arrAirport.trim().toUpperCase();

        if (!flightDate || !dep || !arr || !aircraftType.trim()) {
            setError("Date, Departure, Arrival, and Aircraft Type are required.");
            setSaving(false);
            return;
        }

        const uniqueKey = generateFlightUniqueKey(
            dep,
            arr,
            registration,
            flightDate,
            offBlock
        );

        // Guard: check if duplicate flight already exists
        try {
            const { data: existingFlight, error: checkError } = await supabase
                .from("flight_logs")
                .select("id, flight_date, departure_airport, arrival_airport, registration, off_block")
                .eq("unique", uniqueKey)
                .maybeSingle();

            if (!checkError && existingFlight && (!isEdit || existingFlight.id !== entry?.id)) {
                setError(
                    `Duplicate flight prevented! A flight on ${existingFlight.flight_date} (${existingFlight.departure_airport} -> ${existingFlight.arrival_airport}, Reg: ${existingFlight.registration || "N/A"}${existingFlight.off_block ? ", Off-block: " + existingFlight.off_block : ""}) is already logged.`
                );
                setSaving(false);
                return;
            }
        } catch {
            // Proceed to save
        }

        const payload: Partial<FlightLogRow> = {
            flight_date: flightDate,
            departure_airport: dep.slice(0, 4),
            arrival_airport: arr.slice(0, 4),
            off_block: offBlock.trim() || null,
            on_block: onBlock.trim() || null,
            route: route.trim().toUpperCase() || null,
            unique: uniqueKey,
            aircraft_type: aircraftType.trim().toUpperCase().slice(0, 10),
            registration: registration.trim().toUpperCase().slice(0, 10) || null,
            pic_name: picName.trim() || null,
            total_minutes: Number(totalMinutes) || 0,
            day_minutes: Number(dayMinutes) || 0,
            night_minutes: Number(nightMinutes) || 0,
            single_engine_vfr_minutes: Number(seVfr) || 0,
            single_engine_ifr_minutes: Number(seIfr) || 0,
            multi_engine_vfr_minutes: Number(meVfr) || 0,
            multi_engine_ifr_minutes: Number(meIfr) || 0,
            pic_minutes: Number(picMinutes) || 0,
            dual_minutes: Number(dualMinutes) || 0,
            synthetic_minutes: Number(synthMinutes) || 0,
            landings_day: Number(landingsDay) || 0,
            landings_night: Number(landingsNight) || 0,
            remarks: remarks.trim() || null,
            is_simulator: isSim,
            is_cross_country: isXCountry,
            distance_nm: Number(distanceNm) || 0,
        };

        try {
            if (isEdit && entry) {
                const { error } = await supabase
                    .from("flight_logs")
                    .update(payload)
                    .eq("id", entry.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("flight_logs").insert(payload);
                if (error) throw error;
            }
            onSaved();
            onClose();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to save flight entry.";
            if (msg.includes("unique") || (err as { code?: string })?.code === "23505") {
                setError("A duplicate flight entry already exists with these exact parameters (Dep, Arr, Registration, Date, Off-Block).");
            } else {
                setError(msg);
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/30">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Plane className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-foreground">
                                {isEdit ? "Edit Flight Log" : "Log New Flight"}
                            </h2>
                            <p className="text-[11px] text-muted-foreground">
                                EASA Compliant Flight Logger
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm">
                    {/* Date, Route & Times */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="space-y-1 col-span-2 sm:col-span-1">
                            <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={flightDate}
                                onChange={(e) => setFlightDate(e.target.value)}
                                className="w-full bg-background border border-input rounded-xl px-3 py-2 text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                Dep (ICAO) *
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={4}
                                value={depAirport}
                                onChange={(e) => {
                                    setDepAirport(e.target.value.toUpperCase());
                                    autoCalcDistance(e.target.value, arrAirport);
                                }}
                                placeholder="LPVL"
                                className="w-full bg-background border border-input rounded-xl px-3 py-2 font-mono uppercase text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                Arr (ICAO) *
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={4}
                                value={arrAirport}
                                onChange={(e) => {
                                    setArrAirport(e.target.value.toUpperCase());
                                    autoCalcDistance(depAirport, e.target.value);
                                }}
                                placeholder="LPVZ"
                                className="w-full bg-background border border-input rounded-xl px-3 py-2 font-mono uppercase text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                Off Block
                            </label>
                            <input
                                type="text"
                                maxLength={5}
                                value={offBlock}
                                onChange={(e) => setOffBlock(e.target.value)}
                                placeholder="10:30"
                                className="w-full bg-background border border-input rounded-xl px-3 py-2 font-mono text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                On Block
                            </label>
                            <input
                                type="text"
                                maxLength={5}
                                value={onBlock}
                                onChange={(e) => setOnBlock(e.target.value)}
                                placeholder="11:45"
                                className="w-full bg-background border border-input rounded-xl px-3 py-2 font-mono text-xs"
                            />
                        </div>
                    </div>

                    {/* Route / Waypoints for Map Plotting */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold uppercase text-muted-foreground flex items-center justify-between">
                            <span>Route / Waypoints (Map Plotting)</span>
                            <span className="text-[10px] text-muted-foreground font-normal lowercase">optional</span>
                        </label>
                        <input
                            type="text"
                            value={route}
                            onChange={(e) => setRoute(e.target.value.toUpperCase())}
                            placeholder="e.g. LPVL DCT NTM DCT LPVZ or LPVL-LPCS-LPPT"
                            className="w-full bg-background border border-input rounded-xl px-3 py-2 font-mono uppercase text-xs"
                        />
                    </div>

                    {/* Aircraft details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                Aircraft Type *
                            </label>
                            <input
                                type="text"
                                required
                                value={aircraftType}
                                onChange={(e) => setAircraftType(e.target.value.toUpperCase())}
                                placeholder="C172"
                                className="w-full bg-background border border-input rounded-xl px-3 py-2 uppercase"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                Registration
                            </label>
                            <input
                                type="text"
                                value={registration}
                                onChange={(e) => setRegistration(e.target.value.toUpperCase())}
                                placeholder="CS-DLD"
                                className="w-full bg-background border border-input rounded-xl px-3 py-2 uppercase font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                PIC Name
                            </label>
                            <input
                                type="text"
                                value={picName}
                                onChange={(e) => setPicName(e.target.value)}
                                placeholder="Self / Instructor"
                                className="w-full bg-background border border-input rounded-xl px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* Durations in Minutes */}
                    <div className="border border-border/80 rounded-xl p-3.5 bg-muted/20 space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                            <span>Durations & Conditions (in Minutes)</span>
                            <span className="font-mono text-primary font-bold">
                                Total: {(totalMinutes / 60).toFixed(1)}h ({totalMinutes}m)
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            <div>
                                <label className="text-[10px] text-muted-foreground">Total Min</label>
                                <input
                                    type="number"
                                    value={totalMinutes}
                                    onChange={(e) => setTotalMinutes(Number(e.target.value))}
                                    className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground">Day Min</label>
                                <input
                                    type="number"
                                    value={dayMinutes}
                                    onChange={(e) => setDayMinutes(Number(e.target.value))}
                                    className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground">Night Min</label>
                                <input
                                    type="number"
                                    value={nightMinutes}
                                    onChange={(e) => setNightMinutes(Number(e.target.value))}
                                    className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground">Distance (NM)</label>
                                <input
                                    type="number"
                                    value={distanceNm}
                                    onChange={(e) => setDistanceNm(Number(e.target.value))}
                                    className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                            <div>
                                <label className="text-[10px] text-muted-foreground">SE VFR Min</label>
                                <input
                                    type="number"
                                    value={seVfr}
                                    onChange={(e) => setSeVfr(Number(e.target.value))}
                                    className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground">SE IFR Min</label>
                                <input
                                    type="number"
                                    value={seIfr}
                                    onChange={(e) => setSeIfr(Number(e.target.value))}
                                    className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground">ME VFR Min</label>
                                <input
                                    type="number"
                                    value={meVfr}
                                    onChange={(e) => setMeVfr(Number(e.target.value))}
                                    className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground">ME IFR Min</label>
                                <input
                                    type="number"
                                    value={meIfr}
                                    onChange={(e) => setMeIfr(Number(e.target.value))}
                                    className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                            <div>
                                <label className="text-[10px] text-muted-foreground">PIC Min</label>
                                <input
                                    type="number"
                                    value={picMinutes}
                                    onChange={(e) => setPicMinutes(Number(e.target.value))}
                                    className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground">Dual (Instr) Min</label>
                                <input
                                    type="number"
                                    value={dualMinutes}
                                    onChange={(e) => setDualMinutes(Number(e.target.value))}
                                    className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground">Synth (Sim) Min</label>
                                <input
                                    type="number"
                                    value={synthMinutes}
                                    onChange={(e) => setSynthMinutes(Number(e.target.value))}
                                    className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Landings & Flags */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                        <div>
                            <label className="text-[10px] text-muted-foreground uppercase font-semibold">
                                Day Landings
                            </label>
                            <input
                                type="number"
                                value={landingsDay}
                                onChange={(e) => setLandingsDay(Number(e.target.value))}
                                className="w-full bg-background border border-input rounded-xl px-3 py-1.5 font-mono"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-muted-foreground uppercase font-semibold">
                                Night Landings
                            </label>
                            <input
                                type="number"
                                value={landingsNight}
                                onChange={(e) => setLandingsNight(Number(e.target.value))}
                                className="w-full bg-background border border-input rounded-xl px-3 py-1.5 font-mono"
                            />
                        </div>

                        <div className="flex flex-col gap-2 sm:col-span-2 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={isSim}
                                    onChange={(e) => setIsSim(e.target.checked)}
                                    className="rounded border-input text-primary h-4 w-4"
                                />
                                <span className="text-xs">Simulator Session</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={isXCountry}
                                    onChange={(e) => setIsXCountry(e.target.checked)}
                                    className="rounded border-input text-primary h-4 w-4"
                                />
                                <span className="text-xs">Cross Country Flight</span>
                            </label>
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                            Remarks / Operational Notes
                        </label>
                        <input
                            type="text"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="e.g. Solo navigation, ILS approach Rwy 17..."
                            className="w-full bg-background border border-input rounded-xl px-3 py-2"
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-xl border border-input hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-5 py-2 text-sm rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                            {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            <span>{isEdit ? "Save Flight Log" : "Add Flight Record"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function FlightEntryModal(props: FlightEntryModalProps) {
    if (!props.isOpen) return null;

    return (
        <FlightEntryDialog
            key={props.entry?.id || "new"}
            {...props}
        />
    );
}
