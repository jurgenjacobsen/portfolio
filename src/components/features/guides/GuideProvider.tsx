import type { ReactNode } from "react";
import { GuideContext, type GuideContextValue } from "./GuideContext";

export interface GuideProviderProps extends GuideContextValue {
    children: ReactNode;
}

export function GuideProvider({
    children,
    ...value
}: GuideProviderProps) {
    return (
        <GuideContext value={value}>
            {children}
        </GuideContext>
    );
}

export default GuideProvider;
