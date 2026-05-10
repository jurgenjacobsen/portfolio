import { Icon, type IconId } from "./icon";

export default function ProjectTag({
        tag, j, icon, title, className, style
    }: {
        tag: string;
        j?: number;
        icon?: string;
        title?: string;
        className?: string;
        style?: React.CSSProperties;
    }) {
    return (
        <span
            key={j}
            className={"px-3 md:px-4 py-1 rounded-full bg-primary/5 border border-border text-primary flex items-center gap-2 whitespace-nowrap" + " " + className}
            title={title}
            style={style}
        >
            { icon && <Icon id={icon as IconId} className="size-3 shrink-0" /> }
            <span className="truncate max-w-30 md:max-w-35">{ tag }</span>
        </span>
    )
}