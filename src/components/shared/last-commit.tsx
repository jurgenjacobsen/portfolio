import { GithubClient, type GithubCommit } from "@/lib/Github";
import { useEffect, useState } from "react";
import { Icon } from "./icon";

export default function LastCommit() {
    const [lastCommit, setLastCommit] = useState<GithubCommit>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const client = new GithubClient();

        client
            .fetchCommits("jurgenjacobsen", "portfolio")
            .then((commits) => {
                if (commits.length > 0) {
                    setLastCommit(commits[0]);
                }
            })
            .catch((err) => console.error("Failed to fetch last commit", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <span className="flex items-center gap-2 text-sm font-normal text-muted-foreground group py-2 px-4 bg-card rounded-xl border border-border overflow-hidden">
            <Icon
                id="github"
                className="size-4 opacity-75 group-hover:opacity-100 transition-opacity hidden xl:block"
            />
            <span className="flex items-center gap-1.5">
                {loading ? (
                    <span className="h-4 w-24 md:w-32 bg-muted animate-pulse rounded-sm" />
                ) : lastCommit ? (
                    <a
                        href={`https://github.com/jurgenjacobsen/portfolio/commit/${lastCommit.sha}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors truncate max-w-54 md:max-w-48"
                        title={lastCommit.commit.message}
                    >
                        {lastCommit.commit.message}
                    </a>
                ) : (
                    <span className="text-xs italic opacity-50">
                        Unavailable
                    </span>
                )}
            </span>
        </span>
    );
}
