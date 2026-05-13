import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { LastCommit, Icon } from "@/components/shared";

export default function Footer() {
    return (
        <>
            <footer className="w-full border-t-2 border-border mt-8 py-4 px-8 no-print">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <h3 className="font-bold text-lg tracking-tight mb-2">
                            Jürgen Jacobsen
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Jürgen Jacobsen.
                            <br />
                            All rights reserved.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg tracking-tight mb-2">
                            Settings
                        </h3>
                        <Select>
                            <SelectTrigger className="w-full mt-2 cursor-pointer">
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem
                                        value="en"
                                        className="cursor-pointer"
                                    >
                                        English
                                    </SelectItem>
                                    <SelectItem
                                        value="de"
                                        disabled
                                        className="cursor-pointer"
                                    >
                                        Deutsch
                                    </SelectItem>
                                    <SelectItem
                                        value="pt-br"
                                        disabled
                                        className="cursor-pointer"
                                    >
                                        Português
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg tracking-tight mb-2">
                            Last commit
                        </h3>
                        <LastCommit />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg tracking-tight mb-2">
                            Resources
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/rss.xml"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                                >
                                    <Icon id="RssIcon" className="w-4 h-4" />
                                    RSS Feed
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
}
