export interface HeadingItem {
    id: string;
    text: string;
    level: number;
}

export interface GuideItem {
    title: string;
    slug: string;
    section: string;
    sectionId: string;
    topic: string;
    topicId: string;
    order: number;
    description: string;
    readTime: string;
    updatedAt: string;
    tags: string[];
    filePath: string;
    headings?: HeadingItem[];
}

export interface TopicNode {
    id: string;
    title: string;
    order: number;
    guides: GuideItem[];
}

export interface SectionNode {
    id: string;
    title: string;
    order: number;
    topics: TopicNode[];
}

export interface GuidesIndexData {
    sections: SectionNode[];
    bySlug: Record<string, GuideItem>;
    guides: GuideItem[];
}
