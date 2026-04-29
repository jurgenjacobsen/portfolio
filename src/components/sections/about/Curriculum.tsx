import {
    BriefcaseIcon,
    GraduationCapIcon,
    Code2Icon,
    CalendarIcon,
} from "lucide-react";
import { SectionCard } from "@/components/ui";

const EXPERIENCE = [
    {
        title: "Full-Stack Engineer",
        company: "Freelance / Self-Employed",
        period: "2023 - Present",
        description:
            "Building scalable web applications using React, NestJS, and PostgreSQL. Focused on delivering high-performance solutions and intuitive user interfaces.",
        tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    },
    {
        title: "Software Developer",
        company: "Tech Solutions Inc.",
        period: "2021 - 2023",
        description:
            "Developed and maintained enterprise-level applications. Collaborated with cross-functional teams to implement new features and optimize existing systems.",
        tags: [".NET", "C#", "SQL Server", "Angular"],
    },
];

const EDUCATION = [
    {
        degree: "B.Sc. in Computer Science",
        school: "University of Technology",
        period: "2018 - 2021",
        description:
            "Focused on software engineering principles, algorithms, and data structures.",
    },
];

const SKILLS = [
    {
        category: "Frontend",
        items: ["React", "Vue.js", "TypeScript", "Tailwind CSS", "Next.js"],
    },
    {
        category: "Backend",
        items: ["Node.js", "NestJS", "Go", ".NET", "C#", "Python"],
    },
    {
        category: "Database",
        items: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Supabase"],
    },
    {
        category: "Tools",
        items: ["Docker", "Git", "Vite", "Postman", "Linux", "Vercel"],
    },
];

export default function Curriculum() {
    return (
        <SectionCard className="space-y-12">
            {/* Experience Section */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <BriefcaseIcon className="size-6 text-primary" />
                    <h2 className="text-2xl font-black tracking-tight uppercase">
                        Experience
                    </h2>
                </div>
                <div className="grid gap-8">
                    {EXPERIENCE.map((job, index) => (
                        <div
                            key={index}
                            className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-border"
                        >
                            <div className="absolute left-[-1] top-2 size-2 rounded-full bg-primary" />
                            <div className="space-y-2">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                                    <h3 className="text-xl font-bold">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-bold uppercase tracking-wider">
                                        <CalendarIcon className="size-3.5" />
                                        {job.period}
                                    </div>
                                </div>
                                <p className="text-primary font-bold text-sm uppercase tracking-tight">
                                    {job.company}
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    {job.description}
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {job.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase tracking-widest text-muted-foreground border border-border/50"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education Section */}
            <section className="space-y-8 pt-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                    <GraduationCapIcon className="size-6 text-primary" />
                    <h2 className="text-2xl font-black tracking-tight uppercase">
                        Education
                    </h2>
                </div>
                <div className="grid gap-8">
                    {EDUCATION.map((edu, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                                <h3 className="text-xl font-bold">
                                    {edu.degree}
                                </h3>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm font-bold uppercase tracking-wider">
                                    <CalendarIcon className="size-3.5" />
                                    {edu.period}
                                </div>
                            </div>
                            <p className="text-primary font-bold text-sm uppercase tracking-tight">
                                {edu.school}
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                {edu.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills Section */}
            <section className="space-y-8 pt-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                    <Code2Icon className="size-6 text-primary" />
                    <h2 className="text-2xl font-black tracking-tight uppercase">
                        Skills
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SKILLS.map((skillGroup, index) => (
                        <div
                            key={index}
                            className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border/50"
                        >
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary">
                                {skillGroup.category}
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {skillGroup.items.map((skill) => (
                                    <span
                                        key={skill}
                                        className="text-sm font-medium text-foreground"
                                    >
                                        {skill}
                                        {skillGroup.items.indexOf(skill) !==
                                            skillGroup.items.length - 1 && (
                                            <span className="text-muted-foreground ml-1.5">
                                                •
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </SectionCard>
    );
}
