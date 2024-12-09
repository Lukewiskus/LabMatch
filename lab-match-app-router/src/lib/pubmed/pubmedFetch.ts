import { PaperData } from '@/interfaces/PaperData';
import axios from 'axios';
import xml2js from 'xml2js';

export async function fetchTopFivePIArticles(
  researcherName: string
): Promise<PaperData[]> {
  const BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
  try {
    // Step 1: Search for articles by investigator name
    const searchUrl = `${BASE_URL}esearch.fcgi?db=pubmed&term=${encodeURIComponent(
      researcherName
    )}[Author - Last]&retmode=json&retmax=1000`;

    const searchResponse = await axios.get(searchUrl);
    const searchData = searchResponse.data;

    const pmids = searchData.esearchresult?.idlist;

    if (!pmids || pmids.length === 0) {
      console.log("No articles found for the given principal investigator.");
      return [];
    }

    // Step 2: Fetch detailed article information using PMIDs
    const topFive = pmids.slice(0, 5);
    const efetchUrl = `${BASE_URL}efetch.fcgi?db=pubmed&id=${topFive.join(
      ","
    )}&retmode=xml`;
    const fetchResponse = await axios.get(efetchUrl, { responseType: 'text' });
    const xmlData = fetchResponse.data;
    const formattedData : PaperData[] = await formatData(xmlData);
    return formattedData;
  } catch (error) {
    console.error("An error occurred while fetching articles:", error);
    return [];
  }
}

// Helper function to parse and format XML data
async function formatData(xmlData: string): Promise<PaperData[]> {
  const parser = new xml2js.Parser({ explicitArray: false });

  try {
    const result = await parser.parseStringPromise(xmlData);
    const articles = result.PubmedArticleSet?.PubmedArticle || [];

    return articles.map((article: any) => {
      const citation = article.MedlineCitation;
      const articleData = citation?.Article || {};
      const journalInfo = articleData?.Journal?.JournalIssue?.PubDate || {};
      const articleTitle = articleData?.ArticleTitle || "";
      const abstractText = articleData?.Abstract?.AbstractText || "";
      const authorList = articleData?.AuthorList?.Author || [];
      const keywordList = citation?.KeywordList?.Keyword || [];
      const pmid = citation.PMID?._ || "";
      const url = `https://pubmed.ncbi.nlm.nih.gov/${pmid}`;
      console.log(articleTitle)
      return {
        PMID: parseInt(pmid, 10),
        title: articleTitle,
        slug: articleTitle?.toLowerCase().replace(/\s+/g, "-"),
        abstract: Array.isArray(abstractText) ? abstractText.join(" ") : abstractText,
        authors: Array.isArray(authorList)
          ? authorList.map(
              (author: any) =>
                `${author.ForeName || ""} ${author.LastName || ""}`.trim()
            )
          : [],
        journal: articleData?.Journal?.Title || "",
        pubdate: new Date(
          journalInfo.Year || journalInfo.MedlineDate || new Date()
        ),
        keywords: Array.isArray(keywordList)
          ? keywordList.map((keyword: any) => keyword._ || keyword)
          : [],
        url,
        affiliations: Array.isArray(authorList)
          ? authorList.map((author: any) => author.Affiliation || "").filter(Boolean)
          : [],
      } as PaperData;
    });
  } catch (error) {
    console.error("Error parsing XML data:", error);
    return [];
  }
}


const normalizeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\b[a-z]\./g, "") // Remove single-letter middle initials (e.g., "J. Doe" → "J Doe")
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();

function sleep(ms : number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}