export interface GithubRepo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    homepage: string | null;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string | null;
    forks_count: number;
    open_issues_count: number;
    topics: string[];
    visibility: string;
    default_branch: string;
}

export class GithubClient {
    private token: string | undefined;
    private baseUrl: string;
    constructor(token?: string) {
        this.token = import.meta.env.VITE_GITHUB_TOKEN || token;
        this.baseUrl = "https://api.github.com";
    }

    async fetchRepos(username: string): Promise<GithubRepo[]> {
        const headers: HeadersInit = {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        };
        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }
        const res = await fetch(
            `${this.baseUrl}/users/${username}/repos?sort=updated&per_page=100`,
            { headers },
        );
        if (!res.ok) {
            throw new Error(`GitHub API error: ${res.status}`);
        }
        return await res.json();
    }

    async fetchRepo(owner: string, repo: string): Promise<GithubRepo> {
        const headers: HeadersInit = {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        };
        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }
        const res = await fetch(`${this.baseUrl}/repos/${owner}/${repo}`, {
            headers,
        });
        if (!res.ok) {
            throw new Error(`GitHub API error: ${res.status}`);
        }
        return await res.json();
    }
}
