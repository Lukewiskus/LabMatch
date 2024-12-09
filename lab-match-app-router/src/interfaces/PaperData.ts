export interface PaperData {
    PMID: number;
    title: string;
    slug: string;
    abstract: string;
    authors: string[];
    journal: string;
    pubdate: Date;
    keywords: string[];
    url: string;
    affiliations: string[];
};