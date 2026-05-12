import { SearchIcon, FilterIcon, SortDescIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Select,
    SelectLabel,
} from "@/components/ui/select";

interface ListHeaderProps {
    search: string;
    setSearch: (val: string) => void;
    techFilter: string;
    setTechFilter: (val: string) => void;
    availableTags: string[];
    sortBy: string;
    setSortBy: (val: string) => void;
}

export default function ListHeader({
    search,
    setSearch,
    techFilter,
    setTechFilter,
    availableTags,
    sortBy,
    setSortBy,
}: ListHeaderProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 w-full">
            {/* Search Input */}
            <div className="relative w-full group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    type="search"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-10 rounded-xl bg-muted/30 border-border/50 focus-visible:ring-primary/10 focus-visible:border-primary/20"
                />
            </div>

            {/* Filters and Sorting */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto">
                <Select value={techFilter} onValueChange={setTechFilter}>
                    <SelectTrigger className="flex-1 h-10 rounded-xl bg-muted/30 border-border/50">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <FilterIcon className="size-3.5 text-muted-foreground shrink-0" />
                            <SelectValue
                                placeholder="Technology"
                                className="truncate"
                            />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Technologies</SelectLabel>
                            <SelectItem value="all">All Stack</SelectItem>
                            {availableTags.map((tag) => (
                                <SelectItem key={tag} value={tag}>
                                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="flex-1 h-10 rounded-xl bg-muted/30 border-border/50">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <SortDescIcon className="size-3.5 text-muted-foreground shrink-0" />
                            <SelectValue
                                placeholder="Sort by"
                                className="truncate"
                            />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort options</SelectLabel>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="stars">Most Stars</SelectItem>
                            <SelectItem value="alphabetical">A-Z</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
