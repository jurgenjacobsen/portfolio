import { useEffect, useState } from "react";
import { Icon, type IconId } from "@/components/shared/icon";
import { GithubClient } from "@/lib/Github";

type Platform = 'windows' | 'macos' | 'linux';

interface PlatformDownload {
    url: string;
    assetName: string;
    size?: number;
    downloadCount?: number;
}

interface InstallerProps {
    platform: Platform;
    download?: PlatformDownload | null;
    disableAll?: boolean;
}

function parseGithubRepo(projectId: string): { owner: string; repo: string } | null {
    if (!projectId) return null;
    
    // If it's a URL
    if (projectId.startsWith('http://') || projectId.startsWith('https://')) {
        try {
            const url = new URL(projectId);
            if (url.hostname === 'github.com') {
                const parts = url.pathname.split('/').filter(Boolean);
                if (parts.length >= 2) {
                    return { owner: parts[0], repo: parts[1] };
                }
            }
        } catch (e) {
            console.error('Failed to parse projectId as URL', e);
        }
    }
    
    // If it's owner/repo format
    const parts = projectId.split('/');
    if (parts.length === 2) {
        return { owner: parts[0], repo: parts[1] };
    }
    
    return null;
}

function getPlatformFromFileName(fileName: string): Platform | null {
    const lowerName = fileName.toLowerCase();
    
    // Check macOS
    if (
        lowerName.endsWith('.dmg') ||
        lowerName.endsWith('.pkg') ||
        lowerName.endsWith('.app.zip') ||
        lowerName.includes('mac') ||
        lowerName.includes('macos') ||
        lowerName.includes('osx') ||
        lowerName.includes('darwin')
    ) {
        return 'macos';
    }
    
    // Check Windows
    if (
        lowerName.endsWith('.exe') ||
        lowerName.endsWith('.msi') ||
        lowerName.includes('win') ||
        lowerName.includes('windows')
    ) {
        return 'windows';
    }
    
    // Check Linux
    if (
        lowerName.endsWith('.deb') ||
        lowerName.endsWith('.rpm') ||
        lowerName.endsWith('.appimage') ||
        lowerName.endsWith('.snap') ||
        lowerName.includes('linux') ||
        (lowerName.includes('tar.gz') && (lowerName.includes('amd64') || lowerName.includes('x86_64') || lowerName.includes('arm64')))
    ) {
        return 'linux';
    }
    
    return null;
}

function formatBytes(bytes?: number): string {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `(${parseFloat((bytes / Math.pow(1024, i)).toFixed(1))} ${sizes[i]})`;
}

function Installer({ platform, download, disableAll }: InstallerProps) {
    const getIcon = (): IconId => {
        if (!platform || !['windows', 'macos', 'linux'].includes(platform)) return "AlertCircle";
        switch (platform) {
            case 'windows':
                return "windowsicon";
            case 'macos':
                return "appleicon";
            case 'linux':
                return "linuxicon";
            default:
                return "AlertCircle";
        }    
    }

    const isDisabled = disableAll || !download;

    return (
        <div className="border border-border rounded-xl p-6 group flex flex-col justify-between h-full bg-card transition-all duration-300">
            <div className="flex justify-center items-center gap-4 mb-4">
                <Icon id={getIcon()} className="w-10 h-10 fill-primary" />
                <span className="text-lg font-bold">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </span>
            </div>
            
            <div className="text-center mb-4 flex-1 min-h-14 flex flex-col justify-center">
                {download ? (
                    <div className="text-xs text-muted-foreground truncate w-full px-2" title={download.assetName}>
                        <div className="font-semibold text-foreground truncate">{download.assetName}</div>
                        <div className="mt-1 flex items-center justify-center gap-2">
                            <span>{formatBytes(download.size)}</span>
                            {download.downloadCount !== undefined && download.downloadCount > 0 && (
                                <>
                                    <span className="font-light">•</span>
                                    <span>{download.downloadCount.toLocaleString()} download{download.downloadCount !== 1 ? 's' : ''}</span>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground">
                        Not available for this platform
                    </div>
                )}
            </div>
            
            {download ? (
                <a 
                    href={download.url}
                    download
                    className={`
                        group inline-flex shrink-0 justify-center items-center rounded-lg font-semibold
                        whitespace-nowrap transition-all cursor-pointer text-center
                        w-full py-1 px-4 bg-primary hover:bg-primary/75 text-primary-foreground duration-300
                        ${isDisabled ? 'pointer-events-none opacity-50' : ''}
                    `}
                >
                    <span>Download</span>
                </a>
            ) : (
                <button 
                    disabled
                    className="
                        group inline-flex shrink-0 justify-center items-center rounded-lg font-semibold
                        disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap transition-all
                        w-full py-1 px-4 bg-muted text-muted-foreground duration-300"
                >
                    <span>Unavailable</span>
                </button>
            )}
        </div>
    )
}

type DownloadOptions = {
    projectId: string;
    hideUnavailable?: boolean; // By default true, it will hide platforms that are not available for download.
    disableAll?: boolean; // By default false, it will disable all download buttons.
};

export default function Download(props: DownloadOptions) {
    const { projectId, hideUnavailable = true, disableAll = false } = props;

    const [downloads, setDownloads] = useState<Record<Platform, PlatformDownload | null>>({
        windows: null,
        macos: null,
        linux: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tagName, setTagName] = useState<string>("");

    useEffect(() => {
        let active = true;

        async function fetchReleases() {
            if (!projectId) {
                setLoading(false);
                return;
            }

            const repo = parseGithubRepo(projectId);
            if (!repo) {
                setError("Invalid GitHub repository ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const client = new GithubClient();
                const latestRelease = await client.fetchLatestRelease(repo.owner, repo.repo);

                if (!active) return;

                setTagName(latestRelease.tag_name);

                const detected: Record<Platform, PlatformDownload | null> = {
                    windows: null,
                    macos: null,
                    linux: null,
                };

                if (latestRelease.assets && latestRelease.assets.length > 0) {
                    latestRelease.assets.forEach((asset) => {
                        const platform = getPlatformFromFileName(asset.name);
                        if (platform) {
                            const existing = detected[platform];
                            let replace = false;
                            if (!existing) {
                                replace = true;
                            } else {
                                const ext = asset.name.split('.').pop()?.toLowerCase();
                                const oldExt = existing.assetName.split('.').pop()?.toLowerCase();
                                if (platform === 'macos' && ext === 'dmg' && oldExt !== 'dmg') replace = true;
                                if (platform === 'windows' && ext === 'exe' && oldExt !== 'exe') replace = true;
                                if (platform === 'linux' && (ext === 'appimage' || ext === 'deb') && (oldExt !== 'appimage' && oldExt !== 'deb')) replace = true;
                            }

                            if (replace) {
                                detected[platform] = {
                                    url: asset.browser_download_url,
                                    assetName: asset.name,
                                    size: asset.size,
                                    downloadCount: asset.download_count,
                                };
                            }
                        }
                    });
                }

                setDownloads(detected);
            } catch (err: any) {
                console.error("Error loading GitHub releases:", err);
                if (active) {
                    setError("Could not fetch release downloads.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        fetchReleases();

        return () => {
            active = false;
        };
    }, [projectId]);

    const availablePlatforms: Platform[] = ['windows', 'macos', 'linux'];
    const displayedPlatforms = hideUnavailable
        ? availablePlatforms.filter((platform) => downloads[platform] !== null)
        : availablePlatforms;

    if (loading) {
        return (
            <div className="bg-background border border-border rounded-xl p-6 flex flex-col items-center justify-center gap-4 animate-pulse">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-muted-foreground">Checking for latest downloads...</span>
            </div>
        );
    }

    if (error) {
        // Find owner and repo to link directly to release page as fallback
        const repo = parseGithubRepo(projectId);
        const fallbackUrl = repo ? `https://github.com/${repo.owner}/${repo.repo}/releases` : '#';

        return (
            <div className="bg-background border border-border rounded-xl p-6 text-center mt-6">
                <Icon id="AlertCircle" className="w-10 h-10 text-destructive mx-auto mb-2" />
                <h4 className="font-bold text-foreground">Downloads Unavailable</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                    We had trouble fetching direct downloads from GitHub.
                </p>
                <a
                    href={fallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                    <span>View releases on GitHub</span>
                    <Icon id="ExternalLink" className="w-4 h-4" />
                </a>
            </div>
        );
    }

    if (displayedPlatforms.length === 0) {
        return null; // Don't show anything if no platforms are available
    }

    return (
        <div className="mt-6 bg-background border border-border rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 border-b border-border pb-4">
                <div>
                    <h3 className="text-lg font-black tracking-tight text-foreground">Available Downloads</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Grab the official build compiled for your system.
                    </p>
                </div>
                {tagName && (
                    <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary self-start sm:self-auto">
                        <Icon id="Tag" className="w-3 h-3" />
                        Latest: {tagName}
                    </span>
                )}
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-${displayedPlatforms.length} gap-4`}>
                {displayedPlatforms.map((platform) => (
                    <Installer
                        key={platform}
                        platform={platform}
                        download={downloads[platform]}
                        disableAll={disableAll}
                    />
                ))}
            </div>
        </div>
    );
}