import { createClient } from "@supabase/supabase-js";

// Support both standard VITE_ prefixes and NEXT_PUBLIC_ prefixes
const supabaseUrl =
    (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
    (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined) ||
    "";

const supabaseAnonKey =
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
    (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined) ||
    (import.meta.env.SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
    "";

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        "Supabase credentials not fully configured in client environment. Supabase requests may fail."
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

export interface ProjectRow {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    content: string;
    created_at: string;
    updated_at: string;
    tags: string[];
    highlight: boolean;
    image: string | null;
    github: string | null;
    link: string | null;
    downloads: {
        hideUnavailable?: boolean;
        disableAll?: boolean;
        hideDownloads?: boolean;
    } | null;
    stars: number;
    inserted_at?: string;
}

export interface GuideSectionRow {
    id: string;
    title: string;
    order_index: number;
    created_at?: string;
}

export interface GuideRow {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    content: string;
    section_id: string | null;
    topic: string | null;
    order_index: number;
    reading_time_minutes: number;
    tags: string[];
    created_at?: string;
    updated_at: string;
}

export interface FlightLogRow {
    id: string;
    flight_date: string;
    departure_airport: string;
    arrival_airport: string;
    off_block: string | null;
    on_block: string | null;
    aircraft_type: string;
    registration: string | null;
    pic_name: string | null;
    total_minutes: number;
    day_minutes: number;
    night_minutes: number;
    single_engine_vfr_minutes: number;
    single_engine_ifr_minutes: number;
    multi_engine_vfr_minutes: number;
    multi_engine_ifr_minutes: number;
    pic_minutes: number;
    dual_minutes: number;
    synthetic_minutes: number;
    landings_day: number;
    landings_night: number;
    remarks: string | null;
    is_simulator: boolean;
    is_cross_country: boolean;
    distance_nm: number;
    route?: string | null;
    unique?: string | null;
    created_at?: string;
}

export function generateFlightUniqueKey(
    depAirport: string,
    arrAirport: string,
    registration?: string | null,
    flightDate?: string | null,
    offBlock?: string | null
): string {
    const dep = (depAirport || "").trim().toUpperCase();
    const arr = (arrAirport || "").trim().toUpperCase();
    const reg = (registration || "NOREG").trim().toUpperCase();
    const date = (flightDate || "").trim();
    const time = (offBlock || "").replace(/[^0-9]/g, "").trim();
    return `${dep}_${arr}_${reg}_${date}_${time || "0000"}`;
}
