import * as React from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";

interface ContextMenuContextType {
    isOpen: boolean;
    position: { x: number; y: number };
    openMenu: (x: number, y: number) => void;
    closeMenu: () => void;
}

const ContextMenuContext = React.createContext<ContextMenuContextType | null>(
    null,
);

export function useContextMenu() {
    const context = React.useContext(ContextMenuContext);
    if (!context) {
        throw new Error(
            "ContextMenu subcomponents must be used within a <ContextMenu>",
        );
    }
    return context;
}

export function ContextMenu({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });

    const openMenu = React.useCallback((x: number, y: number) => {
        setPosition({ x, y });
        setIsOpen(true);
    }, []);

    const closeMenu = React.useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <ContextMenuContext.Provider
            value={{ isOpen, position, openMenu, closeMenu }}
        >
            {children}
        </ContextMenuContext.Provider>
    );
}

export function ContextMenuTrigger({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    const { openMenu } = useContextMenu();

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        openMenu(e.clientX, e.clientY);
    };

    return (
        <div onContextMenu={handleContextMenu} className={className} {...props}>
            {children}
        </div>
    );
}

export function ContextMenuContent({
    children,
    className,
    style,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    const { isOpen, position, closeMenu } = useContextMenu();
    const menuRef = React.useRef<HTMLDivElement>(null);
    const [adjustedPos, setAdjustedPos] = React.useState(position);

    // Adjust position if menu overflows the viewport boundaries
    React.useLayoutEffect(() => {
        if (!isOpen || !menuRef.current) return;

        const rect = menuRef.current.getBoundingClientRect();
        let x = position.x;
        let y = position.y;

        if (x + rect.width > window.innerWidth) {
            x = Math.max(8, window.innerWidth - rect.width - 8);
        }
        if (y + rect.height > window.innerHeight) {
            y = Math.max(8, window.innerHeight - rect.height - 8);
        }

        setAdjustedPos({ x, y });
    }, [isOpen, position]);

    // Close on click outside, Escape key, or window scroll/resize
    React.useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (e: PointerEvent | MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                closeMenu();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeMenu();
            }
        };

        const handleScroll = () => {
            closeMenu();
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleScroll);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleScroll);
        };
    }, [isOpen, closeMenu]);

    if (!isOpen || typeof document === "undefined") return null;

    return createPortal(
        <div
            ref={menuRef}
            role="menu"
            data-slot="context-menu-content"
            className={className + " min-w-48 font-medium text-sm bg-card shadow-sm border border-border rounded-lg p-2"}
            style={{
                position: "fixed",
                left: `${adjustedPos.x}px`,
                top: `${adjustedPos.y}px`,
                zIndex: 50,
                ...style,
            }}
            {...props}
        >
            {children}
        </div>,
        document.body,
    );
}

export function ContextMenuGroup({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            role="group"
            data-slot="context-menu-group"
            className={className}
            {...props}
        >
            {children}
        </div>
    );
}

export function ContextMenuItem({
    children,
    onClick,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    const { closeMenu } = useContextMenu();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(e);
        closeMenu();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
            closeMenu();
        }
    };

    return (
        <div
            role="menuitem"
            tabIndex={0}
            data-slot="context-menu-item"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={className + " flex items-center gap-2 not-[disabled]:cursor-pointer py-2 px-4 hover:bg-muted transition-colors duration-300 rounded-md group"}
            {...props}
        >
            {children}
        </div>
    );
}

export function ContextMenuSeparator({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            role="separator"
            data-slot="context-menu-separator"
            className={className + " my-2 border-t border-border"}
            {...props}
        />
    );
}

export function ContextMenuCheckboxItem({
    children,
    checked,
    onCheckedChange,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}) {
    const { closeMenu } = useContextMenu();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        props.onClick?.(e);
        onCheckedChange?.(!checked);
        closeMenu();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            props.onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
            onCheckedChange?.(!checked);
            closeMenu();
        }
    };

    return (
        <div
            role="menuitemcheckbox"
            aria-checked={checked}
            tabIndex={0}
            data-slot="context-menu-checkbox-item"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={className + " not-[disabled]:cursor-pointer py-2 px-4 hover:bg-muted transition-colors duration-300 rounded-md flex items-center justify-between"}
            {...props}
        >
            <span className="flex items-center gap-2">
                {children}
            </span>
            {checked && (
                <span data-slot="indicator">
                    <Check className="w-4 h-4" />
                </span>
            )}
        </div>
    );
}

export function ContextMenuLabel({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div data-slot="context-menu-label" className={className} {...props}>
            {children}
        </div>
    );
}

export function ContextMenuShortcut({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            data-slot="context-menu-shortcut"
            className={className}
            {...props}
        >
            {children}
        </span>
    );
}
