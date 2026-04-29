import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";



export default function Footer() {
    return (
        <>
            <footer className="w-full border-t-2 border-border mt-8 py-4 px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <h3 className="font-bold text-lg tracking-tight mb-2">
                            Jürgen Jacobsen
                        </h3>
                        <p className="text-sm font-normal text-muted-foreground">
                            © {new Date().getFullYear()} Jürgen Jacobsen.
                            <br />
                            All rights reserved.
                        </p>

                        <Select>
                            <SelectTrigger className="w-full mt-2">
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="de" disabled>
                                        Deutsch
                                    </SelectItem>
                                    <SelectItem value="pt-br" disabled>
                                        Português
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </footer>
        </>
    );
}
