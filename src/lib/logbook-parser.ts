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
    if (!clean || !clean.includes(":")) return 0;
    const [hrs, mins] = clean.split(":").map(Number);
    return (hrs || 0) * 60 + (mins || 0);
}

export function minutesToDecimalHours(minutes: number): number {
    return Math.round((minutes / 60) * 10) / 10;
}

export function formatMinutes(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins.toString().padStart(2, "0")}m`;
}

function parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === "," && !inQuotes) {
            result.push(current.trim().replace(/^"|"$/g, ""));
            current = "";
        } else {
            current += char;
        }
    }
    result.push(current.trim().replace(/^"|"$/g, ""));
    return result;
}

export function parseLogbookCsv(csvContent: string): AviationLogbookData {
    const lines = csvContent
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

    if (lines.length <= 1) {
        return createEmptyLogbookData();
    }

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

    // Header index 0, start from 1
    for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        if (cols.length < 10) continue;

        const date = cols[0] || "";
        const dep = cols[1] || "";
        const offBlock = cols[2] || "";
        const arr = cols[3] || "";
        const onBlock = cols[4] || "";
        const aircraft = cols[5] || "";
        const registration = cols[6] || "";
        const picName = cols[7] || "";
        const totalStr = cols[8] || "";
        const dayStr = cols[9] || "";
        const nightStr = cols[10] || "";
        const seVfrStr = cols[11] || "";
        const seIfrStr = cols[12] || "";
        const meVfrStr = cols[13] || "";
        const meIfrStr = cols[14] || "";
        const picStr = cols[15] || "";
        const dualStr = cols[19] || "";
        const simStr = cols[20] || "";
        const landingsDay = parseInt(cols[22] || "0", 10) || 0;
        const landingsNight = parseInt(cols[23] || "0", 10) || 0;
        const remarks = cols[24] || "";

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

        const isSim = simMins > 0 || aircraft.toUpperCase().includes("AL250") || aircraft.toUpperCase().includes("SIM");
        const effectiveDuration = isSim ? simMins : totalMins;

        if (isSim) {
            totalSimMinutes += simMins;
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
        const isCrossCountry = Boolean(dep && arr && dep !== arr);

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
            syntheticMinutes: simMins,
            landingsDay,
            landingsNight,
            remarks,
            distanceNm,
            isSimulator: isSim,
            isCrossCountry,
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
