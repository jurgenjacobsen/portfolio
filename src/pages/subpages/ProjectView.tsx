import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { SectionCard } from "@/components/shared";
import type { ProjectProps } from "../Projects";
import remarkGfmPlugin from "remark-gfm";
const remarkGfm = (remarkGfmPlugin as any).default || remarkGfmPlugin;
import ProjectViewHeader from "@/components/features/projects/ProjectViewHeader";
import ProjectPreview from "@/components/features/projects/ProjectPreview";
import { GithubClient } from "@/lib/Github";
import Download from "@/components/features/projects/Download";

function parseFrontMatter(text: string): { attributes: any; body: string } {
    const regex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = text.match(regex);
    
    const attributes: any = {};
    let body = text;
    
    if (match) {
        const yamlSection = match[1];
        body = match[2];
        
        const lines = yamlSection.split('\n');
        for (const line of lines) {
            const trimLine = line.trim();
            if (!trimLine || trimLine.startsWith('#')) continue;
            
            const colonIndex = trimLine.indexOf(':');
            if (colonIndex !== -1) {
                const key = trimLine.substring(0, colonIndex).trim();
                let val = trimLine.substring(colonIndex + 1).trim();
                
                // Remove optional surrounding quotes
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.substring(1, val.length - 1);
                }
                
                // Parse values
                if (val.toLowerCase() === 'true') {
                    attributes[key] = true;
                } else if (val.toLowerCase() === 'false') {
                    attributes[key] = false;
                } else if (val.toLowerCase() === 'null' || val === '~') {
                    attributes[key] = null;
                } else if (val.startsWith('[') && val.endsWith(']')) {
                    attributes[key] = val
                        .substring(1, val.length - 1)
                        .split(',')
                        .map(item => item.trim())
                        .filter(Boolean);
                } else {
                    if (val.includes('#') && !val.includes('://')) {
                        const cleanVal = val.split('#')[0].trim();
                        attributes[key] = cleanVal === '' ? null : cleanVal;
                    } else {
                        attributes[key] = val;
                    }
                }
            }
        }
    }
    
    return { attributes, body };
}

export default function ProjectView() {
    const { projectSlug } = useParams();
    const [content, setContent] = useState("");
    const [metadata, setMetadata] = useState<ProjectProps | null>(null);
    const [projects, setProjects] = useState<ProjectProps[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getLatestDate = (date1?: string, date2?: string) => {
        if (!date1) return date2 || "";
        if (!date2) return date1 || "";
        return new Date(date1) > new Date(date2) ? date1 : date2;
    };

    const getEarliestDate = (date1?: string, date2?: string) => {
        if (!date1) return date2 || "";
        if (!date2) return date1 || "";
        return new Date(date1) < new Date(date2) ? date1 : date2;
    };

    async function fetchProjectData() {
        try {
            const response = await fetch(`/projects/${projectSlug}.md`);
            if (!response.ok) return navigate("/projects");

            const rawText = await response.text();
            const { attributes, body } = parseFrontMatter(rawText);
            const project = attributes as ProjectProps;

            let finalMetadata = { ...project };

            if (project.github && project.github.startsWith("https://github.com")) {
                try {
                    const parsedUrl = new URL(project.github);
                    const isGithubHost =
                        parsedUrl.hostname === "github.com" &&
                        parsedUrl.protocol === "https:";
                    if (isGithubHost) {
                        const params = parsedUrl.pathname
                            .split("/")
                            .filter(Boolean);
                        if (params.length >= 2) {
                            const owner = params[0];
                            const repo = params[1];

                            const github = new GithubClient();
                            const repoData = await github.fetchRepo(
                                owner,
                                repo,
                            );

                            const githubCreated = repoData.created_at;
                            const githubUpdated =
                                repoData.pushed_at || repoData.updated_at;

                            finalMetadata = {
                                ...project,
                                stars: repoData.stargazers_count,
                                createdAt: getEarliestDate(
                                    githubCreated,
                                    project.createdAt,
                                ),
                                updatedAt: getLatestDate(
                                    githubUpdated,
                                    project.updatedAt,
                                ),
                            };
                        }
                    }
                } catch (error) {
                    console.error("Error fetching github data:", error);
                }
            }

            setMetadata(finalMetadata);
            setContent(body);
        } catch (err) {
            console.error("Error loading markdown:", err);
            navigate("/projects");
        }
    }

    async function fetchProjects() {
        try {
            const response = await fetch("/projects/_.json");
            if (!response.ok) return;
            const data = await response.json();
            setProjects(data);
        } catch (err) {
            console.error("Error loading projects:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjectData();
        fetchProjects();
        window.scrollTo(0, 0);
    }, [projectSlug]);

    const recommendations = useMemo(() => {
        if (!metadata) return [];
        return projects
            .filter((p) => p.slug !== projectSlug)
            .map((p) => ({
                project: p,
                score: p.tags.filter((t) => metadata.tags.includes(t)).length,
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((item) => item.project);
    }, [projects, metadata, projectSlug]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <ProjectViewHeader metadata={metadata!} />

            <SectionCard>
                <article className="prose dark:prose-invert lg:prose-base max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </article>
                {metadata?.github && !metadata.downloads?.hideDownloads && 
                    <Download 
                        projectId={metadata.github} 
                        hideUnavailable={metadata.downloads?.hideUnavailable} 
                        disableAll={metadata.downloads?.disableAll} 
                    />}
            </SectionCard>

            {recommendations.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center gap-4 px-2">
                        <h2 className="text-2xl font-black tracking-tight">
                            Recommended Projects
                        </h2>
                        <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendations.map((project) => (
                            <ProjectPreview
                                key={project.slug}
                                project={project}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
