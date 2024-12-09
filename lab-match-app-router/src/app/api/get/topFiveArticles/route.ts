import { fetchTopFivePIArticles } from '@/lib/pubmed/pubmedFetch';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { FourK } from '@mui/icons-material';

const prisma = new PrismaClient();

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const firstName = searchParams.get('firstName') || '';
    const middleInitial = searchParams.get('middleInitial') || '';
    const lastName = searchParams.get('lastName') || '';

    const fullName = middleInitial === "" ? `${firstName.trim()} ${lastName.trim()}` : `${firstName.trim()} ${middleInitial.trim()} ${lastName.trim()}`;

    console.log(fullName)
    const existingAuthor = await prisma.lu_author.findFirst({
        where: {
          name: fullName,
        },
      });

      if (existingAuthor) {
        // Author exists, return their database record
        return NextResponse.json({
            authorAlreadyInDb: true,
        });
      }

    try {
        // Fetch articles
        const articles = await fetchTopFivePIArticles(fullName);

        if(articles.length == 0) {
            return NextResponse.json({articles: []})
        }
        // Sanitize the data
        const sanitizedArticles = articles.map((article) => ({
            ...article,
            abstract: typeof article.abstract === 'string' ? article.abstract : '',
            authors: Array.isArray(article.authors) ? article.authors : article.authors ? [article.authors] : [],
            affiliations: Array.isArray(article.affiliations) ? article.affiliations : article.affiliations ? [article.affiliations] : [],
            keywords: Array.isArray(article.keywords) ? article.keywords : article.keywords ? [article.keywords] : [],
        }));
        

        return NextResponse.json({
            authorAlreadyInDb: false,
            articles: sanitizedArticles});
    } catch (error) {
        console.error("Error fetching articles:", error);
        return NextResponse.json({ error: "Failed to fetch articles" });
    }
};
