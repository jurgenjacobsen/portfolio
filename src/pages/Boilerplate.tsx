import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import SectionCard from '@/components/shared/section-card';

export default function Boilerplate() {
    const [isCopied, setIsCopied] = useState(false);
    const command = 'Invoke-WebRequest -Uri "https://jurgen.fyi/boilerplate/updater.ps1" -OutFile "updater.ps1"; .\\updater.ps1';

    const handleCopy = async () => {
        try {
        await navigator.clipboard.writeText(command);
        setIsCopied(true);
        
        // Revert the icon back to 'Copy' after 2 seconds
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
        } catch (err) {
        console.error('Failed to copy text: ', err);
        }
    };

    return (
        <main>
            <SectionCard className="space-y-8">
                <div className="relative group bg-card p-4 rounded-lg border border-border">
        
                {/* Copy Button */}
                <button
                    onClick={handleCopy}
                    className="cursor-pointer absolute top-3 right-3 p-2 rounded transition-all"
                    title="Copy command"
                >
                    {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>

                {/* Your original structure */}
                <code>
                    <pre className="text-muted-foreground text-xs uppercase tracking-wider mb-2 font-sans font-semibold">
                        Boilerplate
                    </pre>
                    <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap pr-10">
                        {command}
                    </p>
                </code>
            </div>
            </SectionCard>
        </main>
    );
}