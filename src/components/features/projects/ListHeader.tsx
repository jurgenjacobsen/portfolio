import {
    SearchIcon,
    FilterIcon,
    SortDescIcon,
    ChevronDown,
    X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
    const hasActiveFilters =
        techFilter !== "all" || sortBy !== "newest" || search.trim() !== "";

    const handleClearFilters = () => {
        setSearch("");
        setTechFilter("all");
        setSortBy("newest");
    };

    const techOptions = [
        { value: "all", label: "All Stack" },
        ...availableTags.map((tag) => ({
            value: tag,
            label: tag.charAt(0).toUpperCase() + tag.slice(1),
        })),
    ];

    const sortOptions = [
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "stars", label: "Most Stars" },
        { value: "alphabetical", label: "A-Z" },
    ];

    return (
        <div
            className={cn(
                "grid grid-cols-1 items-center gap-4 w-full animate-in fade-in slide-in-from-bottom-4 delay-200 fill-mode-both relative z-20 transition-all duration-300 ease-in-out",
                hasActiveFilters
                    ? "md:grid-cols-[1fr_1.25fr]"
                    : "md:grid-cols-[1fr_1fr]",
            )}
        >
            {/* Search Input */}
            <div className="relative w-full group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    type="search"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 py-2 rounded-xl bg-muted/30 border-border/50 focus-visible:ring-primary/10 focus-visible:border-primary/20"
                />
            </div>

            {/* Filters and Sorting */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-4 w-full md:w-auto relative z-10 transition-all duration-300 ease-in-out">
                <Select
                    value={techFilter}
                    onChange={(val) => setTechFilter(val)}
                    options={techOptions}
                    placeholder="Technology"
                    className="flex-1 min-w-0"
                    triggerClassName="rounded-xl bg-muted/30 border-border/50 w-full"
                    renderTrigger={(selectedOption, isOpen) => (
                        <>
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FilterIcon className="size-4 text-muted-foreground shrink-0" />
                                <span className="truncate text-sm text-foreground">
                                    {selectedOption
                                        ? selectedOption.label
                                        : "Technology"}
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
                    value={sortBy}
                    onChange={(val) => setSortBy(val)}
                    options={sortOptions}
                    placeholder="Sort by"
                    className="flex-1 min-w-0"
                    triggerClassName="rounded-xl bg-muted/30 border-border/50 w-full"
                    renderTrigger={(selectedOption, isOpen) => (
                        <>
                            <div className="flex items-center gap-2 overflow-hidden">
                                <SortDescIcon className="size-4 text-muted-foreground shrink-0" />
                                <span className="truncate text-sm text-foreground">
                                    {selectedOption
                                        ? selectedOption.label
                                        : "Sort by"}
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
                        "transition-all duration-300 ease-in-out overflow-hidden flex items-center shrink-0",
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
                        className="px-4 py-2 rounded-xl border border-border/50 bg-muted/30 text-muted-foreground hover:text-foreground active:scale-95 transition-all duration-200 font-medium text-xs md:text-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap shadow-xs group"
                    >
                        <X className="size-4 group-hover:rotate-90 transition-transform duration-200" />
                        <span>Clear</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
