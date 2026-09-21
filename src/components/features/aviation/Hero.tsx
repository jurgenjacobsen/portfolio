import HeroMap from "./HeroMap";
import type { AviationLogbookData } from "@/lib/logbook-parser";

interface AviationHeroProps {
    data: AviationLogbookData;
}

export default function AviationHero({ data }: AviationHeroProps) {
    return <HeroMap data={data} />;
}