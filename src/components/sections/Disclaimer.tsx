import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ConstructionIcon, InfoIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DisclaimerProps {
    excludedPaths?: string[];
}

export default function Disclaimer({ excludedPaths = [] }: DisclaimerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const hasSeenDisclaimer = localStorage.getItem("hasSeenDisclaimer");

        // If they haven't seen it, show it
        if (!hasSeenDisclaimer) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem("hasSeenDisclaimer", "true");
        setIsOpen(false);
    };

    // Check if current path is excluded
    const isExcluded = excludedPaths.includes(location.pathname);

    if (isExcluded) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-100">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <ConstructionIcon className="size-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            Development Notice
                        </span>
                    </div>
                    <DialogTitle className="text-2xl">
                        Work in Progress
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        This website is currently under active development. Some
                        features might be incomplete and some data displayed may
                        be placeholders.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50 my-2">
                    <InfoIcon className="size-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs font-medium leading-relaxed">
                        I'm constantly improving the experience. Thank you for
                        your patience and for visiting my portfolio!
                    </p>
                </div>
                <DialogFooter className="mt-4">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto rounded-xl font-bold"
                        onClick={handleClose}
                    >
                        I Understand
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
