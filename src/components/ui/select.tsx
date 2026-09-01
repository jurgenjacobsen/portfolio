import { CheckIcon, ChevronDown } from "lucide-react";
import React, {
    useState,
    useRef,
    useEffect,
    useLayoutEffect,
    useId,
    useCallback,
} from "react";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface SelectOption<T = string> {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
    [key: string]: any;
}

export interface SelectTitleProps extends React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode;
}

export function SelectTitle({ children, className, ...props }: SelectTitleProps) {
    return (
        <span className={cn("flex items-center gap-2", className)} {...props}>
            {children}
        </span>
    );
}

export interface SelectProps<T = string> {
    options: (SelectOption<T> | T)[];
    value?: T;
    defaultValue?: T;
    onChange?: (value: T, option: SelectOption<T>) => void;
    onValueChange?: (value: T) => void;
    placeholder?: string;
    title?: React.ReactNode;
    showValue?: boolean;
    disabled?: boolean;
    name?: string;
    id?: string;
    required?: boolean;
    className?: string;
    triggerClassName?: string;
    titleClassName?: string;
    valueClassName?: string;
    menuClassName?: string;
    optionClassName?: string;
    renderTrigger?: (
        selectedOption: SelectOption<T> | undefined,
        isOpen: boolean,
        title?: React.ReactNode
    ) => React.ReactNode;
    renderOption?: (
        option: SelectOption<T>,
        isSelected: boolean,
        isHighlighted: boolean
    ) => React.ReactNode;
}

export function Select<T extends string | number = string>({
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    onValueChange,
    placeholder = "Select an option",
    title,
    showValue = title === undefined,
    disabled = false,
    name,
    id,
    required = false,
    className,
    triggerClassName,
    titleClassName,
    valueClassName,
    menuClassName,
    optionClassName,
    renderTrigger,
    renderOption,
}: SelectProps<T>) {
    const generatedId = useId();
    const selectId = id || generatedId;
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Normalize options to uniform SelectOption<T>[] objects
    const normalizedOptions: SelectOption<T>[] = options.map((opt) => {
        if (typeof opt === "object" && opt !== null && "value" in opt) {
            return opt as SelectOption<T>;
        }
        return {
            value: opt as T,
            label: String(opt),
        };
    });

    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(
        defaultValue
    );
    const currentValue = isControlled ? controlledValue : uncontrolledValue;

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [placement, setPlacement] = useState<"bottom" | "top">("bottom");

    const selectedOption = normalizedOptions.find(
        (opt) => opt.value === currentValue
    );

    // Calculate whether dropdown should appear below or above trigger button
    const updatePlacement = useCallback(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight =
            window.innerHeight || document.documentElement.clientHeight;

        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        const menuHeight = listRef.current
            ? listRef.current.offsetHeight
            : 220;
        const margin = 8;

        if (spaceBelow < menuHeight + margin && spaceAbove > spaceBelow) {
            setPlacement("top");
        } else {
            setPlacement("bottom");
        }
    }, []);

    useIsomorphicLayoutEffect(() => {
        if (isOpen) {
            updatePlacement();
        }
    }, [isOpen, updatePlacement]);

    // Handle outside click, scroll, and resize events
    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event: MouseEvent | TouchEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        const handleScrollOrResize = () => {
            updatePlacement();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        window.addEventListener("resize", handleScrollOrResize);
        window.addEventListener("scroll", handleScrollOrResize, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            window.removeEventListener("resize", handleScrollOrResize);
            window.removeEventListener("scroll", handleScrollOrResize, true);
        };
    }, [isOpen, updatePlacement]);

    // Scroll highlighted item into view if list is scrollable
    useEffect(() => {
        if (isOpen && highlightedIndex >= 0 && listRef.current) {
            const item = listRef.current.children[
                highlightedIndex
            ] as HTMLElement | undefined;
            if (item) {
                item.scrollIntoView({ block: "nearest" });
            }
        }
    }, [isOpen, highlightedIndex]);

    const handleSelect = useCallback(
        (option: SelectOption<T>) => {
            if (option.disabled || disabled) return;

            if (!isControlled) {
                setUncontrolledValue(option.value);
            }

            if (onChange) {
                onChange(option.value, option);
            }

            if (onValueChange) {
                onValueChange(option.value);
            }

            setIsOpen(false);
        },
        [disabled, isControlled, onChange, onValueChange]
    );

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (disabled) return;

        switch (event.key) {
            case "Enter":
            case " ":
                event.preventDefault();
                if (isOpen) {
                    if (
                        highlightedIndex >= 0 &&
                        highlightedIndex < normalizedOptions.length
                    ) {
                        const opt = normalizedOptions[highlightedIndex];
                        if (!opt.disabled) {
                            handleSelect(opt);
                        }
                    }
                } else {
                    setIsOpen(true);
                }
                break;

            case "ArrowDown":
                event.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                    setHighlightedIndex(0);
                } else {
                    setHighlightedIndex((prev) => {
                        const next = prev + 1;
                        return next >= normalizedOptions.length ? 0 : next;
                    });
                }
                break;

            case "ArrowUp":
                event.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                    setHighlightedIndex(normalizedOptions.length - 1);
                } else {
                    setHighlightedIndex((prev) => {
                        const next = prev - 1;
                        return next < 0 ? normalizedOptions.length - 1 : next;
                    });
                }
                break;

            case "Escape":
                if (isOpen) {
                    event.preventDefault();
                    setIsOpen(false);
                }
                break;

            case "Tab":
                if (isOpen) {
                    setIsOpen(false);
                }
                break;

            default:
                break;
        }
    };

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            {/* Hidden native input for HTML form submissions */}
            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={currentValue !== undefined ? String(currentValue) : ""}
                    required={required}
                    disabled={disabled}
                />
            )}

            {/* Select Trigger Button */}
            <button
                type="button"
                id={selectId}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby={selectId}
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
                onKeyDown={handleKeyDown}
                className={cn(
                    "bg-card px-4 py-2 rounded-xl border border-border/75 font-normal text-muted-foreground flex gap-2 items-center cursor-pointer justify-between transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
                    disabled && "opacity-50 cursor-not-allowed",
                    triggerClassName
                )}
            >
                {renderTrigger ? (
                    renderTrigger(selectedOption, isOpen, title)
                ) : (
                    <>
                        {title ? (
                            <>
                                <SelectTitle className={titleClassName}>
                                    {title}
                                </SelectTitle>
                                {showValue && (
                                    <span className={valueClassName}>
                                        {selectedOption
                                            ? selectedOption.label
                                            : placeholder}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className={valueClassName}>
                                {selectedOption ? selectedOption.label : placeholder}
                            </span>
                        )}
                        <span aria-hidden="true">
                            <ChevronDown
                                className={cn(
                                    "size-4 stroke-muted-foreground transition-transform duration-200",
                                    isOpen && "rotate-180"
                                )}
                            />
                        </span>
                    </>
                )}
            </button>

            {/* Dropdown Options Menu */}
            {isOpen && (
                <ul
                    ref={listRef}
                    role="listbox"
                    aria-labelledby={selectId}
                    tabIndex={-1}
                    className={cn(
                        "absolute left-0 w-full z-50 bg-card rounded-xl border border-border/75 p-2 shadow-lg max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-150 ease-out",
                        placement === "bottom"
                            ? "top-full mt-2 origin-top slide-in-from-top-2"
                            : "bottom-full mb-2 origin-bottom slide-in-from-bottom-2",
                        menuClassName
                    )}
                >
                    {normalizedOptions.map((option, index) => {
                        const isSelected = option.value === currentValue;
                        const isHighlighted = index === highlightedIndex;

                        return (
                            <li
                                key={String(option.value)}
                                role="option"
                                aria-selected={isSelected}
                                aria-disabled={option.disabled}
                                onClick={() => handleSelect(option)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                className={cn(
                                    "transition-colors duration-200 rounded-lg hover:bg-muted px-3 py-2 flex items-center justify-between gap-2 cursor-pointer text-sm font-medium",
                                    isSelected && "bg-muted/50 text-foreground font-semibold",
                                    isHighlighted && !isSelected && "bg-muted/30",
                                    option.disabled &&
                                        "opacity-50 cursor-not-allowed pointer-events-none",
                                    optionClassName
                                )}
                            >
                                {renderOption ? (
                                    renderOption(option, isSelected, isHighlighted)
                                ) : (
                                    <>
                                        <span className="truncate">{option.label}</span>
                                        {isSelected && (
                                            <span aria-hidden="true" className="shrink-0">
                                                <CheckIcon className="size-4" />
                                            </span>
                                        )}
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

Select.Title = SelectTitle;

export default Select;
