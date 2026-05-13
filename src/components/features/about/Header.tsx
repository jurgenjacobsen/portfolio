import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

export default function HeaderCV() {
    return (
        <div className="hidden print:block space-y-4 border-b border-border p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        Jürgen Jacobsen
                    </h1>
                    <p className="text-xl text-primary font-bold uppercase tracking-tight">
                        Software Engineer
                    </p>
                </div>
                <div className="text-right space-y-1">
                    <div className="flex items-center justify-end gap-2 text-muted-foreground">
                        <span className="text-sm font-bold uppercase">
                            jurgen@example.com
                        </span>
                        <MailIcon className="size-4 text-primary" />
                    </div>
                    <div className="flex items-center justify-end gap-2 text-muted-foreground">
                        <span className="text-sm font-bold uppercase">
                            +351 900 000 000
                        </span>
                        <PhoneIcon className="size-4 text-primary" />
                    </div>
                    <div className="flex items-center justify-end gap-2 text-muted-foreground">
                        <span className="text-sm font-bold uppercase">
                            Porto, Portugal
                        </span>
                        <MapPinIcon className="size-4 text-primary" />
                    </div>
                </div>
            </div>
        </div>
    );
}
