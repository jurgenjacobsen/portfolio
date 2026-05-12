import React from "react";

interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export default function SectionCard({
    children,
    className,
    ...props
}: SectionCardProps) {
    return (
        <section
            // We combine your base styles with any extra className passed in
            className={`bg-card rounded-xl border border-border p-4 md:p-8 mt-6 shadow-md ${className || ""}`}
            {...props}
        >
            {children}
        </section>
    );
}
