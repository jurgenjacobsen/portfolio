import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import fm from "front-matter";
import { SectionCard } from "@/components/ui";
import type { ProjectProps } from "./Projects";
import remarkGfm from 'remark-gfm';
import ProjectViewHeader from "@/components/sections/projects/ProjectViewHeader";
import ProjectPreview from "@/components/sections/projects/ProjectPreview";

export default function ProjectView() {
    const { projectSlug } = useParams();
    const [content, setContent] = useState("");
    const [metadata, setMetadata] = useState<ProjectProps | null>(null);
    const [projects, setProjects] = useState<ProjectProps[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    async function fetchProjectData() {
        try {
            const response = await fetch(`/projects/${projectSlug}.md`);
            if (!response.ok) return navigate("/projects");
            
            const rawText = await response.text();
            const { attributes, body } = fm(rawText);
            
            setMetadata(attributes as ProjectProps);
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
            .filter(p => p.slug !== projectSlug)
            .map(p => ({
                project: p,
                score: p.tags.filter(t => metadata.tags.includes(t)).length
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.project);
    }, [projects, metadata, projectSlug]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <ProjectViewHeader metadata={metadata!} />
            
            <SectionCard>
                <article className="prose dark:prose-invert lg:prose-base max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </article>
            </SectionCard>

            {recommendations.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center gap-4 px-2">
                        <h2 className="text-2xl font-black tracking-tight">Recommended Projects</h2>
                        <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendations.map((project) => (
                            <ProjectPreview key={project.slug} project={project} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}