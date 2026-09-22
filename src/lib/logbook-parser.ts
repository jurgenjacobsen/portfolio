import { AIRPORTS_DATABASE, calculateDistanceNm } from "./aviation-airports";

export interface LogbookEntry {
    id: string;
    date: string;
    departure: string;
    arrival: string;
    offBlock: string;
    onBlock: string;
    aircraftType: string;
    registration: string;
    picName: string;
    totalMinutes: number;
    dayMinutes: number;
    nightMinutes: number;
    singleEngineVfrMinutes: number;
    singleEngineIfrMinutes: number;
    multiEngineVfrMinutes: number;
    multiEngineIfrMinutes: number;
    picMinutes: number;
    dualMinutes: number;
    syntheticMinutes: number;
    landingsDay: number;
    landingsNight: number;
    remarks: string;
    distanceNm: number;
    isSimulator: boolean;
    isCrossCountry: boolean;
    route?: string;
}

export interface FlightTypeStat {
    key: string;
    label: string;
    description: string;
    minutes: number;
    hoursDecimal: number;
    hoursFormatted: string;
    flightsCount: number;
    percentOfTotal: number;
}

export interface FlightRoute {
    fromIcao: string;
    toIcao: string;
    fromCoords: [number, number];
    toCoords: [number, number];
    flightCount: number;
    distanceNm: number;
    aircraftTypes: string[];
}

export interface AviationLogbookData {
    entries: LogbookEntry[];
    totalHoursDecimal: number;
    totalHoursFormatted: string;
    aircraftHoursDecimal: number;
    simulatorHoursDecimal: number;
    totalFlightsCount: number;
    aircraftFlightsCount: number;
    simulatorSessionsCount: number;
    totalDistanceNm: number;
    airportsVisitedCount: number;
    totalLandingsDay: number;
    totalLandingsNight: number;
    uniqueAirports: {
        icao: string;
        name: string;
        city: string;
        country: string;
        lat: number;
        lon: number;
        operationsCount: number;
    }[];
    routes: FlightRoute[];
    typeStats: FlightTypeStat[];
}

export function parseTimeToMinutes(timeStr?: string): number {
    if (!timeStr) return 0;
    const clean = timeStr.trim().replace(/^"|"$/g, "");
    if (!clean) return 0;
    if (clean.includes(":")) {
        const [hrs, mins] = clean.split(":").map((v) => Number(v) || 0);
        return (hrs || 0) * 60 + (mins || 0);
    }
    const normalized = clean.replace(",", ".");
    const num = Number(normalized);
    if (!isNaN(num) && num > 0) {
        if (clean.includes(".") || clean.includes(",")) {
            return Math.round(num * 60);
        }
        if (num <= 24) {
            return Math.round(num * 60);
        }
        return Math.round(num);
    }
    return 0;
}

export function minutesToDecimalHours(minutes: number): number {
    return Math.round((minutes / 60) * 10) / 10;
}

export function formatMinutes(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins.toString().padStart(2, "0")}m`;
}

export function detectCsvDelimiter(content: string): string {
    const firstLine = content.split(/\r?\n/)[0] || "";
    let commas = 0;
    let semicolons = 0;
    let tabs = 0;
    let inQuotes = false;

    for (let i = 0; i < firstLine.length; i++) {
        const c = firstLine[i];
        if (c === '"') {
            if (inQuotes && firstLine[i + 1] === '"') {
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (!inQuotes) {
            if (c === ";") semicolons++;
            else if (c === ",") commas++;
            else if (c === "\t") tabs++;
        }
    }

    if (semicolons > commas && semicolons > tabs) return ";";
    if (tabs > commas && tabs > semicolons) return "\t";
    return ",";
}

export function parseCsvRows(content: string, customDelimiter?: string): string[][] {
    const clean = content.replace(/^\uFEFF/, "");
    const delimiter = customDelimiter || detectCsvDelimiter(clean);
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = "";
    let inQuotes = false;
    let i = 0;

    while (i < clean.length) {
        const char = clean[i];

        if (char === '"') {
            if (inQuotes && clean[i + 1] === '"') {
                currentCell += '"';
                i += 2;
                continue;
            }
            inQuotes = !inQuotes;
            i++;
            continue;
        }

        if (!inQuotes) {
            if (char === delimiter) {
                currentRow.push(currentCell.trim());
                currentCell = "";
                i++;
                continue;
            }

            if (char === "\r") {
                if (clean[i + 1] === "\n") i++;
                currentRow.push(currentCell.trim());
                if (currentRow.some((c) => c.length > 0)) {
                    rows.push(currentRow);
                }
                currentRow = [];
                currentCell = "";
                i++;
                continue;
            }

            if (char === "\n") {
                currentRow.push(currentCell.trim());
                if (currentRow.some((c) => c.length > 0)) {
                    rows.push(currentRow);
                }
                currentRow = [];
                currentCell = "";
                i++;
                continue;
            }
        }

        currentCell += char;
        i++;
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some((c) => c.length > 0)) {
            rows.push(currentRow);
        }
    }

    return rows;
}

const COLUMN_ALIASES: Record<string, string[]> = {
    date: ["date", "flight_date", "flightdate", "utc_date", "data"],
    departure: ["departure_airport_name", "departure_airport", "departure", "dep_airport", "dep", "from", "origin", "ad_dep", "aerodrome_departure"],
    offBlock: ["off_block", "offblock", "block_off", "out", "dep_time", "departure_time", "time_out", "hora_partida"],
    arrival: ["arrival_airport_name", "arrival_airport", "arrival", "arr_airport", "arr", "to", "dest", "destination", "ad_arr", "aerodrome_arrival"],
    onBlock: ["on_block", "onblock", "block_on", "in", "arr_time", "arrival_time", "time_in", "hora_chegada"],
    aircraftType: ["type_of_aircraft", "aircraft_type", "type", "aircraft", "model", "ac_type", "tipo_aeronave", "airplane_type"],
    registration: ["registration", "aircraft_registration", "regr", "reg", "tail_number", "tail", "callsign", "ident", "matricula", "reg_nr", "registration_number"],
    picName: ["name_of_pilot_in_command", "pilot_in_command", "pic_name", "pic", "commander", "pilot", "piloto_comandante"],
    total: ["total", "total_time", "flight_time", "duration", "time_total", "tempo_total"],
    day: ["day", "day_time", "day_flight_time", "tempo_diurno"],
    night: ["night", "night_time", "night_flight_time", "tempo_noturno"],
    seVfr: ["single_engine_vfr", "se_vfr", "sevfr", "se_vfr_time"],
    seIfr: ["single_engine_ifr", "se_ifr", "seifr", "se_ifr_time"],
    meVfr: ["multi_engine_vfr", "me_vfr", "mevfr", "me_vfr_time"],
    meIfr: ["multi_engine_ifr", "me_ifr", "meifr", "me_ifr_time"],
    picTime: ["pilot_in_command_time", "pic_time", "pic_duration", "time_pic"],
    coPilot: ["co_pilot", "copilot", "sic", "sic_time"],
    multiPilot: ["multi_pilot", "multipilot", "mp", "mp_time"],
    instructor: ["flight_instructor", "fi", "instructor_time"],
    dual: ["dual", "dual_received", "instruction", "dual_time", "duplo_comando"],
    sim: ["synthetic_training", "synthetic", "sim", "simulator", "fstd", "fstd_time", "synthetic_time", "treino_sintetico"],
    landingsDay: ["landings_day", "day_landings", "landings_d", "ldgs_day", "day_ldgs", "aterragens_dia"],
    landingsNight: ["landings_night", "night_landings", "landings_n", "ldgs_night", "night_ldgs", "aterragens_noite"],
    remarks: ["remarks_and_endorsements", "remarks", "endorsements", "notes", "comments", "observacoes"],
    route: ["route", "waypoints", "flight_route", "routing", "rota"],
};

const DEFAULT_COLUMN_INDEXES: Record<string, number> = {
    date: 0,
    departure: 1,
    offBlock: 2,
    arrival: 3,
    onBlock: 4,
    aircraftType: 5,
    registration: 6,
    picName: 7,
    total: 8,
    day: 9,
    night: 10,
    seVfr: 11,
    seIfr: 12,
    meVfr: 13,
    meIfr: 14,
    picTime: 15,
    coPilot: 16,
    multiPilot: 17,
    instructor: 18,
    dual: 19,
    sim: 20,
    landingsDay: 22,
    landingsNight: 23,
    remarks: 24,
    route: -1,
};

function buildColumnIndexMap(headerRow: string[]): Record<string, number> {
    const map: Record<string, number> = {};
    const normalizedHeaders = headerRow.map((h) =>
        h.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/^_+|_+$/g, "")
    );

    for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
        let foundIndex = -1;
        for (let i = 0; i < normalizedHeaders.length; i++) {
            const h = normalizedHeaders[i];
            if (aliases.includes(h)) {
                foundIndex = i;
                break;
            }
        }
        if (foundIndex === -1) {
            for (let i = 0; i < normalizedHeaders.length; i++) {
                const h = normalizedHeaders[i];
                if (aliases.some((alias) => h.includes(alias) || alias.includes(h))) {
                    foundIndex = i;
                    break;
                }
            }
        }

        map[key] = foundIndex !== -1 ? foundIndex : (DEFAULT_COLUMN_INDEXES[key] ?? -1);
    }

    return map;
}

export function parseLogbookCsv(csvContent: string): AviationLogbookData {
    const rows = parseCsvRows(csvContent);

    if (rows.length <= 1) {
        return createEmptyLogbookData();
    }

    const headerRow = rows[0];
    const colMap = buildColumnIndexMap(headerRow);
    const getVal = (row: string[], key: string): string => {
        const idx = colMap[key];
        if (idx === undefined || idx < 0 || idx >= row.length) return "";
        return (row[idx] || "").replace(/^"|"$/g, "").trim();
    };

    const entries: LogbookEntry[] = [];
    const airportOps: Record<string, number> = {};
    const routeMap: Record<string, FlightRoute> = {};

    let totalAircraftMinutes = 0;
    let totalSimMinutes = 0;
    let totalDayMinutes = 0;
    let totalNightMinutes = 0;
    let totalPicMinutes = 0;
    let totalDualMinutes = 0;
    let totalSeVfr = 0;
    let totalSeIfr = 0;
    let totalMeVfr = 0;
    let totalMeIfr = 0;
    let totalLandingsDay = 0;
    let totalLandingsNight = 0;
    let totalCrossCountryMinutes = 0;
    let totalEstDistance = 0;

    let countPic = 0;
    let countDual = 0;
    let countDay = 0;
    let countNight = 0;
    let countSeVfr = 0;
    let countSeIfr = 0;
    let countMeVfr = 0;
    let countMeIfr = 0;
    let countSim = 0;
    let countXc = 0;

    // Header index 0, start from row 1
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 3) continue;

        const date = getVal(row, "date");
        const rawDep = getVal(row, "departure");
        const offBlock = getVal(row, "offBlock");
        const rawArr = getVal(row, "arrival");
        const onBlock = getVal(row, "onBlock");
        const aircraft = getVal(row, "aircraftType");
        const registration = getVal(row, "registration");
        const picName = getVal(row, "picName");
        const totalStr = getVal(row, "total");
        const dayStr = getVal(row, "day");
        const nightStr = getVal(row, "night");
        const seVfrStr = getVal(row, "seVfr");
        const seIfrStr = getVal(row, "seIfr");
        const meVfrStr = getVal(row, "meVfr");
        const meIfrStr = getVal(row, "meIfr");
        const picStr = getVal(row, "picTime");
        const dualStr = getVal(row, "dual");
        const simStr = getVal(row, "sim");
        const landingsDay = parseInt(getVal(row, "landingsDay") || "0", 10) || 0;
        const landingsNight = parseInt(getVal(row, "landingsNight") || "0", 10) || 0;
        const remarks = getVal(row, "remarks");
        const route = getVal(row, "route");

        const totalMins = parseTimeToMinutes(totalStr);
        const simMins = parseTimeToMinutes(simStr);
        const dayMins = parseTimeToMinutes(dayStr);
        const nightMins = parseTimeToMinutes(nightStr);
        const picMins = parseTimeToMinutes(picStr);
        const dualMins = parseTimeToMinutes(dualStr);
        const seVfrMins = parseTimeToMinutes(seVfrStr);
        const seIfrMins = parseTimeToMinutes(seIfrStr);
        const meVfrMins = parseTimeToMinutes(meVfrStr);
        const meIfrMins = parseTimeToMinutes(meIfrStr);

        const isSim =
            simMins > 0 ||
            aircraft.toUpperCase().includes("AL250") ||
            aircraft.toUpperCase().includes("SIM") ||
            aircraft.toUpperCase().includes("FNPT") ||
            aircraft.toUpperCase().includes("FSTD");

        const effectiveDuration = isSim ? (simMins > 0 ? simMins : totalMins) : totalMins;
        const simDuration = isSim ? (simMins > 0 ? simMins : totalMins) : simMins;

        const dep = rawDep || (isSim ? "ZZZZ" : "");
        const arr = rawArr || (isSim ? "ZZZZ" : "");

        if (isSim) {
            totalSimMinutes += simDuration;
            countSim++;
        } else {
            totalAircraftMinutes += totalMins;
        }

        if (dayMins > 0) {
            totalDayMinutes += dayMins;
            countDay++;
        }
        if (nightMins > 0) {
            totalNightMinutes += nightMins;
            countNight++;
        }
        if (picMins > 0) {
            totalPicMinutes += picMins;
            countPic++;
        }
        if (dualMins > 0) {
            totalDualMinutes += dualMins;
            countDual++;
        }
        if (seVfrMins > 0) {
            totalSeVfr += seVfrMins;
            countSeVfr++;
        }
        if (seIfrMins > 0) {
            totalSeIfr += seIfrMins;
            countSeIfr++;
        }
        if (meVfrMins > 0) {
            totalMeVfr += meVfrMins;
            countMeVfr++;
        }
        if (meIfrMins > 0) {
            totalMeIfr += meIfrMins;
            countMeIfr++;
        }

        totalLandingsDay += landingsDay;
        totalLandingsNight += landingsNight;

        let distanceNm = 0;
        const isCrossCountry = Boolean(dep && arr && dep !== arr && !isSim);

        if (dep && arr) {
            airportOps[dep] = (airportOps[dep] || 0) + 1;
            airportOps[arr] = (airportOps[arr] || 0) + 1;

            const depAirport = AIRPORTS_DATABASE[dep];
            const arrAirport = AIRPORTS_DATABASE[arr];

            if (depAirport && arrAirport) {
                if (dep !== arr) {
                    distanceNm = calculateDistanceNm(
                        depAirport.lat,
                        depAirport.lon,
                        arrAirport.lat,
                        arrAirport.lon,
                    );
                    totalEstDistance += distanceNm;
                    totalCrossCountryMinutes += totalMins;
                    countXc++;

                    // Aggregate route
                    const routeKey = `${dep}->${arr}`;
                    const revRouteKey = `${arr}->${dep}`;
                    const targetKey = routeMap[revRouteKey] ? revRouteKey : routeKey;

                    if (!routeMap[targetKey]) {
                        routeMap[targetKey] = {
                            fromIcao: dep,
                            toIcao: arr,
                            fromCoords: [depAirport.lat, depAirport.lon],
                            toCoords: [arrAirport.lat, arrAirport.lon],
                            flightCount: 1,
                            distanceNm,
                            aircraftTypes: [aircraft].filter(Boolean),
                        };
                    } else {
                        routeMap[targetKey].flightCount++;
                        if (
                            aircraft &&
                            !routeMap[targetKey].aircraftTypes.includes(aircraft)
                        ) {
                            routeMap[targetKey].aircraftTypes.push(aircraft);
                        }
                    }
                } else {
                    // Local flight: estimate ~45 NM per hour based on C152 / C172 cruise speed
                    distanceNm = Math.round((totalMins / 60) * 45);
                    totalEstDistance += distanceNm;
                }
            }
        }

        entries.push({
            id: `flight-${i}`,
            date,
            departure: dep,
            arrival: arr,
            offBlock,
            onBlock,
            aircraftType: aircraft,
            registration,
            picName,
            totalMinutes: effectiveDuration,
            dayMinutes: dayMins,
            nightMinutes: nightMins,
            singleEngineVfrMinutes: seVfrMins,
            singleEngineIfrMinutes: seIfrMins,
            multiEngineVfrMinutes: meVfrMins,
            multiEngineIfrMinutes: meIfrMins,
            picMinutes: picMins,
            dualMinutes: dualMins,
            syntheticMinutes: simDuration,
            landingsDay,
            landingsNight,
            remarks,
            distanceNm,
            isSimulator: isSim,
            isCrossCountry,
            route: route || undefined,
        });
    }

    const totalAllMinutes = totalAircraftMinutes + totalSimMinutes;

    // Unique airports list
    const uniqueAirports = Object.keys(airportOps)
        .filter((icao) => AIRPORTS_DATABASE[icao])
        .map((icao) => {
            const info = AIRPORTS_DATABASE[icao];
            return {
                icao,
                name: info.name,
                city: info.city,
                country: info.country,
                lat: info.lat,
                lon: info.lon,
                operationsCount: airportOps[icao],
            };
        })
        .sort((a, b) => b.operationsCount - a.operationsCount);

    // Flight type stats table
    const typeStats: FlightTypeStat[] = [
        {
            key: "pic",
            label: "Pilot-in-Command (PIC)",
            description: "Solo flights, student command, and pilot-in-command cross-country",
            minutes: totalPicMinutes,
            hoursDecimal: minutesToDecimalHours(totalPicMinutes),
            hoursFormatted: formatMinutes(totalPicMinutes),
            flightsCount: countPic,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalPicMinutes / totalAllMinutes) * 100) : 0,
        },
        {
            key: "dual",
            label: "Dual",
            description: "Flight training with certified commercial flight instructors (FI)",
            minutes: totalDualMinutes,
            hoursDecimal: minutesToDecimalHours(totalDualMinutes),
            hoursFormatted: formatMinutes(totalDualMinutes),
            flightsCount: countDual,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalDualMinutes / totalAllMinutes) * 100) : 0,
        },
        {
            key: "day",
            label: "Day Flight Time",
            description: "Operations conducted during daylight hours",
            minutes: totalDayMinutes,
            hoursDecimal: minutesToDecimalHours(totalDayMinutes),
            hoursFormatted: formatMinutes(totalDayMinutes),
            flightsCount: countDay,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalDayMinutes / totalAllMinutes) * 100) : 0,
        },
        {
            key: "night",
            label: "Night Flight Time",
            description: "Nighttime training with cross-country navigation and landings",
            minutes: totalNightMinutes,
            hoursDecimal: minutesToDecimalHours(totalNightMinutes),
            hoursFormatted: formatMinutes(totalNightMinutes),
            flightsCount: countNight,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalNightMinutes / totalAllMinutes) * 100) : 0,
        },
        {
            key: "se_ifr",
            label: "Single-Engine IFR",
            description: "Instrument flight rules in single-engine aircraft",
            minutes: totalSeIfr,
            hoursDecimal: minutesToDecimalHours(totalSeIfr),
            hoursFormatted: formatMinutes(totalSeIfr),
            flightsCount: countSeIfr,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalSeIfr / totalAllMinutes) * 100) : 0,
        },
        {
            key: "se_vfr",
            label: "Single-Engine VFR",
            description: "Visual flight rules navigation, maneuvers, and circuit patterns",
            minutes: totalSeVfr,
            hoursDecimal: minutesToDecimalHours(totalSeVfr),
            hoursFormatted: formatMinutes(totalSeVfr),
            flightsCount: countSeVfr,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalSeVfr / totalAllMinutes) * 100) : 0,
        },
        {
            key: "me_ifr",
            label: "Multi-Engine IFR",
            description: "Multi-engine instrument rating flights in Tecnam P2006T (P06T)",
            minutes: totalMeIfr,
            hoursDecimal: minutesToDecimalHours(totalMeIfr),
            hoursFormatted: formatMinutes(totalMeIfr),
            flightsCount: countMeIfr,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalMeIfr / totalAllMinutes) * 100) : 0,
        },
        {
            key: "me_vfr",
            label: "Multi-Engine VFR",
            description: "Multi-engine conversion and asymmetric handling",
            minutes: totalMeVfr,
            hoursDecimal: minutesToDecimalHours(totalMeVfr),
            hoursFormatted: formatMinutes(totalMeVfr),
            flightsCount: countMeVfr,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalMeVfr / totalAllMinutes) * 100) : 0,
        },
        {
            key: "synthetic",
            label: "Synthetic Flight Training",
            description: "EASA certified simulators (ALSIM AL250 & A320 JOC/MCC)",
            minutes: totalSimMinutes,
            hoursDecimal: minutesToDecimalHours(totalSimMinutes),
            hoursFormatted: formatMinutes(totalSimMinutes),
            flightsCount: countSim,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalSimMinutes / totalAllMinutes) * 100) : 0,
        },
        {
            key: "xc",
            label: "Cross-Country Navigation",
            description: "Flights connecting separate departure and destination aerodromes",
            minutes: totalCrossCountryMinutes,
            hoursDecimal: minutesToDecimalHours(totalCrossCountryMinutes),
            hoursFormatted: formatMinutes(totalCrossCountryMinutes),
            flightsCount: countXc,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalCrossCountryMinutes / totalAllMinutes) * 100) : 0,
        }
    ];

    // Sort entries so latest flights come first (descending by date and time)
    entries.sort((a, b) => {
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

    return {
        entries,
        totalHoursDecimal: minutesToDecimalHours(totalAllMinutes),
        totalHoursFormatted: formatMinutes(totalAllMinutes),
        aircraftHoursDecimal: minutesToDecimalHours(totalAircraftMinutes),
        simulatorHoursDecimal: minutesToDecimalHours(totalSimMinutes),
        totalFlightsCount: entries.length,
        aircraftFlightsCount: entries.length - countSim,
        simulatorSessionsCount: countSim,
        totalDistanceNm: totalEstDistance,
        airportsVisitedCount: uniqueAirports.length,
        totalLandingsDay,
        totalLandingsNight,
        uniqueAirports,
        routes: Object.values(routeMap),
        typeStats,
    };
}

function createEmptyLogbookData(): AviationLogbookData {
    return {
        entries: [],
        totalHoursDecimal: 0,
        totalHoursFormatted: "0h 00m",
        aircraftHoursDecimal: 0,
        simulatorHoursDecimal: 0,
        totalFlightsCount: 0,
        aircraftFlightsCount: 0,
        simulatorSessionsCount: 0,
        totalDistanceNm: 0,
        airportsVisitedCount: 0,
        totalLandingsDay: 0,
        totalLandingsNight: 0,
        uniqueAirports: [],
        routes: [],
        typeStats: [],
    };
}

export interface FlightRowInput {
    id?: string;
    flight_date?: string;
    departure_airport?: string;
    arrival_airport?: string;
    off_block?: string | null;
    on_block?: string | null;
    aircraft_type?: string;
    registration?: string | null;
    pic_name?: string | null;
    total_minutes?: number;
    day_minutes?: number;
    night_minutes?: number;
    single_engine_vfr_minutes?: number;
    single_engine_ifr_minutes?: number;
    multi_engine_vfr_minutes?: number;
    multi_engine_ifr_minutes?: number;
    pic_minutes?: number;
    dual_minutes?: number;
    synthetic_minutes?: number;
    landings_day?: number;
    landings_night?: number;
    remarks?: string | null;
    is_simulator?: boolean;
    is_cross_country?: boolean;
    distance_nm?: number;
    route?: string | null;
}

export function buildLogbookDataFromRows(rows: FlightRowInput[]): AviationLogbookData {
    if (!rows || rows.length === 0) return createEmptyLogbookData();

    let totalAircraftMinutes = 0;
    let totalSimMinutes = 0;
    let totalDayMinutes = 0;
    let totalNightMinutes = 0;
    let totalPicMinutes = 0;
    let totalDualMinutes = 0;
    let totalSeVfr = 0;
    let totalSeIfr = 0;
    let totalMeVfr = 0;
    let totalMeIfr = 0;
    let totalCrossCountryMinutes = 0;
    let totalLandingsDay = 0;
    let totalLandingsNight = 0;
    let totalEstDistance = 0;

    const airportOps: Record<string, number> = {};
    const routeMap: Record<string, FlightRoute> = {};

    let countPic = 0;
    let countDual = 0;
    let countDay = 0;
    let countNight = 0;
    let countSeVfr = 0;
    let countSeIfr = 0;
    let countMeVfr = 0;
    let countMeIfr = 0;
    let countSim = 0;
    let countXc = 0;

    const entries: LogbookEntry[] = [];

    rows.forEach((row, i) => {
        const dep = (row.departure_airport || "").toUpperCase();
        const arr = (row.arrival_airport || "").toUpperCase();
        const aircraft = row.aircraft_type || "";
        const registration = row.registration || "";
        const picName = row.pic_name || "";
        const offBlock = row.off_block || "";
        const onBlock = row.on_block || "";
        const remarks = row.remarks || "";

        const totalMins = Number(row.total_minutes) || 0;
        const simMins = Number(row.synthetic_minutes) || 0;
        const dayMins = Number(row.day_minutes) || 0;
        const nightMins = Number(row.night_minutes) || 0;
        const picMins = Number(row.pic_minutes) || 0;
        const dualMins = Number(row.dual_minutes) || 0;
        const seVfrMins = Number(row.single_engine_vfr_minutes) || 0;
        const seIfrMins = Number(row.single_engine_ifr_minutes) || 0;
        const meVfrMins = Number(row.multi_engine_vfr_minutes) || 0;
        const meIfrMins = Number(row.multi_engine_ifr_minutes) || 0;
        const landingsDay = Number(row.landings_day) || 0;
        const landingsNight = Number(row.landings_night) || 0;

        const isSim =
            Boolean(row.is_simulator) ||
            simMins > 0 ||
            aircraft.toUpperCase().includes("SIM") ||
            aircraft.toUpperCase().includes("AL250") ||
            aircraft.toUpperCase().includes("FNPT") ||
            aircraft.toUpperCase().includes("FSTD");
        const effectiveDuration = isSim ? (simMins > 0 ? simMins : totalMins) : totalMins;
        const simDuration = isSim ? (simMins > 0 ? simMins : totalMins) : simMins;

        if (isSim) {
            totalSimMinutes += simDuration;
            countSim++;
        } else {
            totalAircraftMinutes += totalMins;
        }

        if (dayMins > 0) {
            totalDayMinutes += dayMins;
            countDay++;
        }
        if (nightMins > 0) {
            totalNightMinutes += nightMins;
            countNight++;
        }
        if (picMins > 0) {
            totalPicMinutes += picMins;
            countPic++;
        }
        if (dualMins > 0) {
            totalDualMinutes += dualMins;
            countDual++;
        }
        if (seVfrMins > 0) {
            totalSeVfr += seVfrMins;
            countSeVfr++;
        }
        if (seIfrMins > 0) {
            totalSeIfr += seIfrMins;
            countSeIfr++;
        }
        if (meVfrMins > 0) {
            totalMeVfr += meVfrMins;
            countMeVfr++;
        }
        if (meIfrMins > 0) {
            totalMeIfr += meIfrMins;
            countMeIfr++;
        }

        totalLandingsDay += landingsDay;
        totalLandingsNight += landingsNight;

        let distanceNm = Number(row.distance_nm) || 0;
        const isCrossCountry = Boolean(row.is_cross_country || (dep && arr && dep !== arr));

        if (dep && arr) {
            airportOps[dep] = (airportOps[dep] || 0) + 1;
            airportOps[arr] = (airportOps[arr] || 0) + 1;

            const depAirport = AIRPORTS_DATABASE[dep];
            const arrAirport = AIRPORTS_DATABASE[arr];

            if (depAirport && arrAirport) {
                if (dep !== arr) {
                    if (!distanceNm) {
                        distanceNm = calculateDistanceNm(
                            depAirport.lat,
                            depAirport.lon,
                            arrAirport.lat,
                            arrAirport.lon
                        );
                    }
                    totalEstDistance += distanceNm;
                    totalCrossCountryMinutes += totalMins;
                    countXc++;

                    const routeKey = `${dep}->${arr}`;
                    const revRouteKey = `${arr}->${dep}`;
                    const targetKey = routeMap[revRouteKey] ? revRouteKey : routeKey;

                    if (!routeMap[targetKey]) {
                        routeMap[targetKey] = {
                            fromIcao: dep,
                            toIcao: arr,
                            fromCoords: [depAirport.lat, depAirport.lon],
                            toCoords: [arrAirport.lat, arrAirport.lon],
                            flightCount: 1,
                            distanceNm,
                            aircraftTypes: [aircraft].filter(Boolean),
                        };
                    } else {
                        routeMap[targetKey].flightCount++;
                        if (aircraft && !routeMap[targetKey].aircraftTypes.includes(aircraft)) {
                            routeMap[targetKey].aircraftTypes.push(aircraft);
                        }
                    }
                } else {
                    if (!distanceNm) {
                        distanceNm = Math.round((totalMins / 60) * 45);
                    }
                    totalEstDistance += distanceNm;
                }
            } else if (distanceNm) {
                totalEstDistance += distanceNm;
            }
        }

        // Format date to DD.MM.YYYY if ISO YYYY-MM-DD
        let formattedDate = row.flight_date || "";
        if (formattedDate.includes("-")) {
            const [y, m, d] = formattedDate.split("-");
            formattedDate = `${d}.${m}.${y}`;
        }

        entries.push({
            id: row.id || `flight-${i}`,
            date: formattedDate,
            departure: dep,
            arrival: arr,
            offBlock,
            onBlock,
            aircraftType: aircraft,
            registration,
            picName,
            totalMinutes: effectiveDuration,
            dayMinutes: dayMins,
            nightMinutes: nightMins,
            singleEngineVfrMinutes: seVfrMins,
            singleEngineIfrMinutes: seIfrMins,
            multiEngineVfrMinutes: meVfrMins,
            multiEngineIfrMinutes: meIfrMins,
            picMinutes: picMins,
            dualMinutes: dualMins,
            syntheticMinutes: simDuration,
            landingsDay,
            landingsNight,
            remarks,
            distanceNm,
            isSimulator: isSim,
            isCrossCountry,
            route: row.route || undefined,
        });
    });

    const totalAllMinutes = totalAircraftMinutes + totalSimMinutes;

    const uniqueAirports = Object.keys(airportOps)
        .filter((icao) => AIRPORTS_DATABASE[icao])
        .map((icao) => {
            const info = AIRPORTS_DATABASE[icao];
            return {
                icao,
                name: info.name,
                city: info.city,
                country: info.country,
                lat: info.lat,
                lon: info.lon,
                operationsCount: airportOps[icao],
            };
        })
        .sort((a, b) => b.operationsCount - a.operationsCount);

    const typeStats: FlightTypeStat[] = [
        {
            key: "pic",
            label: "Pilot-in-Command (PIC)",
            description: "Solo flights, student command, and pilot-in-command cross-country",
            minutes: totalPicMinutes,
            hoursDecimal: minutesToDecimalHours(totalPicMinutes),
            hoursFormatted: formatMinutes(totalPicMinutes),
            flightsCount: countPic,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalPicMinutes / totalAllMinutes) * 100) : 0,
        },
        {
            key: "dual",
            label: "Dual",
            description: "Flight training with certified commercial flight instructors (FI)",
            minutes: totalDualMinutes,
            hoursDecimal: minutesToDecimalHours(totalDualMinutes),
            hoursFormatted: formatMinutes(totalDualMinutes),
            flightsCount: countDual,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalDualMinutes / totalAllMinutes) * 100) : 0,
        },
        {
            key: "day",
            label: "Day Flight Time",
            description: "Visual and instrument operations during civil daylight hours",
            minutes: totalDayMinutes,
            hoursDecimal: minutesToDecimalHours(totalDayMinutes),
            hoursFormatted: formatMinutes(totalDayMinutes),
            flightsCount: countDay,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalDayMinutes / totalAllMinutes) * 100) : 0,
        },
        {
            key: "night",
            label: "Night Flight Time",
            description: "Night rating training, night cross-country navigation, and night solo flights",
            minutes: totalNightMinutes,
            hoursDecimal: minutesToDecimalHours(totalNightMinutes),
            hoursFormatted: formatMinutes(totalNightMinutes),
            flightsCount: countNight,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalNightMinutes / totalAllMinutes) * 100) : 0,
        },
        {
            key: "se_vfr",
            label: "Single-Engine VFR",
            description: "Visual flight rules navigation on single-engine piston aircraft",
            minutes: totalSeVfr,
            hoursDecimal: minutesToDecimalHours(totalSeVfr),
            hoursFormatted: formatMinutes(totalSeVfr),
            flightsCount: countSeVfr,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalSeVfr / totalAllMinutes) * 100) : 0,
        },
        {
            key: "se_ifr",
            label: "Single-Engine IFR",
            description: "Instrument flight rules, standard instrument departures, and ILS approaches",
            minutes: totalSeIfr,
            hoursDecimal: minutesToDecimalHours(totalSeIfr),
            hoursFormatted: formatMinutes(totalSeIfr),
            flightsCount: countSeIfr,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalSeIfr / totalAllMinutes) * 100) : 0,
        },
        {
            key: "me_vfr",
            label: "Multi-Engine VFR",
            description: "Visual navigation and asymmetric handling on multi-engine piston aircraft",
            minutes: totalMeVfr,
            hoursDecimal: minutesToDecimalHours(totalMeVfr),
            hoursFormatted: formatMinutes(totalMeVfr),
            flightsCount: countMeVfr,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalMeVfr / totalAllMinutes) * 100) : 0,
        },
        {
            key: "me_ifr",
            label: "Multi-Engine IFR",
            description: "Multi-engine instrument rating training and instrument procedures",
            minutes: totalMeIfr,
            hoursDecimal: minutesToDecimalHours(totalMeIfr),
            hoursFormatted: formatMinutes(totalMeIfr),
            flightsCount: countMeIfr,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalMeIfr / totalAllMinutes) * 100) : 0,
        },
        {
            key: "sim",
            label: "Synthetic Training Device (FSTD)",
            description: "EASA-certified flight synthetic training devices (AL250 / FNPT II)",
            minutes: totalSimMinutes,
            hoursDecimal: minutesToDecimalHours(totalSimMinutes),
            hoursFormatted: formatMinutes(totalSimMinutes),
            flightsCount: countSim,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalSimMinutes / totalAllMinutes) * 100) : 0,
        },
        {
            key: "xc",
            label: "Cross-Country Navigation",
            description: "Flights connecting separate departure and destination aerodromes",
            minutes: totalCrossCountryMinutes,
            hoursDecimal: minutesToDecimalHours(totalCrossCountryMinutes),
            hoursFormatted: formatMinutes(totalCrossCountryMinutes),
            flightsCount: countXc,
            percentOfTotal: totalAllMinutes > 0 ? Math.round((totalCrossCountryMinutes / totalAllMinutes) * 100) : 0,
        },
    ];

    entries.sort((a, b) => {
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

    return {
        entries,
        totalHoursDecimal: minutesToDecimalHours(totalAllMinutes),
        totalHoursFormatted: formatMinutes(totalAllMinutes),
        aircraftHoursDecimal: minutesToDecimalHours(totalAircraftMinutes),
        simulatorHoursDecimal: minutesToDecimalHours(totalSimMinutes),
        totalFlightsCount: entries.length,
        aircraftFlightsCount: entries.length - countSim,
        simulatorSessionsCount: countSim,
        totalDistanceNm: totalEstDistance,
        airportsVisitedCount: uniqueAirports.length,
        totalLandingsDay,
        totalLandingsNight,
        uniqueAirports,
        routes: Object.values(routeMap),
        typeStats,
    };
}
