export interface Airport {
    icao: string;
    iata?: string;
    name: string;
    city: string;
    country: string;
    lat: number;
    lon: number;
}

export const AIRPORTS_DATABASE: Record<string, Airport> = {
    LPVL: {
        icao: "LPVL",
        name: "Vilar de Luz Aerodrome",
        city: "Maia / Porto",
        country: "Portugal",
        lat: 41.2828,
        lon: -8.5194,
    },
    LPVZ: {
        icao: "LPVZ",
        iata: "VSE",
        name: "Viseu Aerodrome",
        city: "Viseu",
        country: "Portugal",
        lat: 40.7256,
        lon: -7.8892,
    },
    LPBG: {
        icao: "LPBG",
        iata: "BGC",
        name: "Bragança Aerodrome",
        city: "Bragança",
        country: "Portugal",
        lat: 41.8578,
        lon: -6.7072,
    },
    LPVR: {
        icao: "LPVR",
        iata: "VRL",
        name: "Vila Real Aerodrome",
        city: "Vila Real",
        country: "Portugal",
        lat: 41.2742,
        lon: -7.7206,
    },
    LEVX: {
        icao: "LEVX",
        iata: "VGO",
        name: "Vigo Airport",
        city: "Vigo",
        country: "Spain",
        lat: 42.2318,
        lon: -8.6268,
    },
    LEAS: {
        icao: "LEAS",
        iata: "OVD",
        name: "Asturias Airport",
        city: "Asturias / Oviedo",
        country: "Spain",
        lat: 43.5636,
        lon: -6.0346,
    },
    LEZL: {
        icao: "LEZL",
        iata: "SVQ",
        name: "Sevilla Airport",
        city: "Sevilla",
        country: "Spain",
        lat: 37.4180,
        lon: -5.8931,
    },
    LEGR: {
        icao: "LEGR",
        iata: "GRX",
        name: "Granada Airport",
        city: "Granada",
        country: "Spain",
        lat: 37.1887,
        lon: -3.7772,
    },
    LEPP: {
        icao: "LEPP",
        iata: "PNA",
        name: "Pamplona Airport",
        city: "Pamplona",
        country: "Spain",
        lat: 42.7700,
        lon: -1.6463,
    },
    LERS: {
        icao: "LERS",
        iata: "REU",
        name: "Reus Airport",
        city: "Reus / Tarragona",
        country: "Spain",
        lat: 41.1474,
        lon: 1.1672,
    },
    LEXJ: {
        icao: "LEXJ",
        iata: "SDR",
        name: "Santander Airport",
        city: "Santander",
        country: "Spain",
        lat: 43.4271,
        lon: -3.8200,
    },
    LELN: {
        icao: "LELN",
        iata: "LEN",
        name: "León Airport",
        city: "León",
        country: "Spain",
        lat: 42.5890,
        lon: -5.6556,
    },
    LPPR: {
        icao: "LPPR",
        iata: "OPO",
        name: "Porto Airport",
        city: "Porto",
        country: "Portugal",
        lat: 41.2481,
        lon: -8.6814,
    },
    LPPT: {
        icao: "LPPT",
        iata: "LIS",
        name: "Lisbon Airport",
        city: "Lisbon",
        country: "Portugal",
        lat: 38.7742,
        lon: -9.1342,
    },
    LPCS: {
        icao: "LPCS",
        iata: "CAT",
        name: "Cascais Aerodrome",
        city: "Cascais / Lisbon",
        country: "Portugal",
        lat: 38.7256,
        lon: -9.3553,
    },
    LPFR: {
        icao: "LPFR",
        iata: "FAO",
        name: "Faro Airport",
        city: "Faro / Algarve",
        country: "Portugal",
        lat: 37.0144,
        lon: -7.9659,
    },
    LPBR: {
        icao: "LPBR",
        iata: "BGZ",
        name: "Braga Aerodrome",
        city: "Braga",
        country: "Portugal",
        lat: 41.5872,
        lon: -8.4450,
    },
    LPCO: {
        icao: "LPCO",
        iata: "CBP",
        name: "Coimbra Aerodrome",
        city: "Coimbra",
        country: "Portugal",
        lat: 40.1583,
        lon: -8.4700,
    },
    LPPM: {
        icao: "LPPM",
        iata: "PRM",
        name: "Portimão Aerodrome",
        city: "Portimão",
        country: "Portugal",
        lat: 37.1492,
        lon: -8.5839,
    },
    LPMA: {
        icao: "LPMA",
        iata: "FNC",
        name: "Funchal Airport",
        city: "Madeira / Funchal",
        country: "Portugal",
        lat: 32.6978,
        lon: -16.7744,
    },
    LPPD: {
        icao: "LPPD",
        iata: "PDL",
        name: "Ponta Delgada Airport",
        city: "Ponta Delgada",
        country: "Portugal",
        lat: 37.7412,
        lon: -25.6979,
    },
    LEMD: {
        icao: "LEMD",
        iata: "MAD",
        name: "Madrid-Barajas Airport",
        city: "Madrid",
        country: "Spain",
        lat: 40.4983,
        lon: -3.5676,
    },
    LEBL: {
        icao: "LEBL",
        iata: "BCN",
        name: "Barcelona Airport",
        city: "Barcelona",
        country: "Spain",
        lat: 41.2974,
        lon: 2.0833,
    },
};

/**
 * Calculates great-circle distance between two coordinate pairs in Nautical Miles.
 */
export function calculateDistanceNm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const R = 3440.065; // Earth radius in Nautical Miles
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}
