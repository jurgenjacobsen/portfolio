import { SearchIcon, FilterIcon, SortDescIcon, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

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
                <Select
                    value={techFilter}
                    onChange={(val) => setTechFilter(val)}
                    options={techOptions}
                    placeholder="Technology"
                    className="flex-1"
                    triggerClassName="h-10 rounded-xl bg-muted/30 border-border/50 w-full"
                    renderTrigger={(selectedOption, isOpen) => (
                        <>
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FilterIcon className="size-3.5 text-muted-foreground shrink-0" />
                                <span className="truncate text-sm text-foreground">
                                    {selectedOption ? selectedOption.label : "Technology"}
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
                    className="flex-1"
                    triggerClassName="h-10 rounded-xl bg-muted/30 border-border/50 w-full"
                    renderTrigger={(selectedOption, isOpen) => (
                        <>
                            <div className="flex items-center gap-2 overflow-hidden">
                                <SortDescIcon className="size-3.5 text-muted-foreground shrink-0" />
                                <span className="truncate text-sm text-foreground">
                                    {selectedOption ? selectedOption.label : "Sort by"}
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
            </div>
        </div>
    );
}
