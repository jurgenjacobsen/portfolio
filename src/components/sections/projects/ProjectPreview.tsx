import { Link } from "react-router-dom";
import type { ProjectProps } from "@/pages/Projects";
import ProjectTag from "@/components/ui/project-tag";
import { StarIcon } from "lucide-react";

export default function ProjectPreview({ project }: { project: ProjectProps }) {
    return (
        <Link 
            to={`/projects/${project.slug}`}
            className="group block bg-card rounded-xl p-6 shadow-md"
        >
            <div className="relative aspect-video mb-4 overflow-hidden rounded-lg bg-muted">
                {project.image ? (
                    <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground italic text-sm">
                        No preview image
                    </div>
                )}
                {project.stars !== undefined && project.stars > 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm border border-border text-[10px] font-bold">
                        <StarIcon className="size-3 fill-yellow-500 text-yellow-500" />
                        <span>{project.stars}</span>
                    </div>
                )}
            </div>
            
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                {project.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-auto text-[10px] font-semibold">
                {project.tags.slice(0, 2).map((tag, i) => (
                    <ProjectTag 
                        key={i} 
                        tag={tag} 
                        icon={tag}
                    />
                ))}
                {project.tags.length > 2 && (
                    <span className="text-muted-foreground self-center ml-1">
                        +{project.tags.length - 2}
                    </span>
                )}
            </div>
        </Link>
    );
}
