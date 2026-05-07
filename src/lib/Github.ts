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

export interface GithubCommit {
    sha: string;
    node_id: string;
    commit: {
        author: {
            name: string;
            email: string;
            date: string;
        }
        committer: {
            name: string;
            email: string;
            date: string;
        }
        message: string;
        tree: {
            sha: string;
            url: string;
        }
        url: string;
    };
    url: string;
    author: {
        login: string;
        id: number;
        avatar_url: string;
        url: string;
        type: string;
        site_admin: boolean;
        user_view_type: string;
    };
    parents: {
        sha: string;
        url: string;        
    }[];
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

    async fetchCommits(owner: string, repo: string): Promise<GithubCommit[]> {
        const headers: HeadersInit = {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        };
        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }
        const res = await fetch(
            `${this.baseUrl}/repos/${owner}/${repo}/commits?per_page=1`,
            { headers },
        );
        if (!res.ok) {
            throw new Error(`GitHub API error: ${res.status}`);
        }
        return await res.json();
    }
}
