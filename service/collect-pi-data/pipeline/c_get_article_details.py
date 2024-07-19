from time import sleep
import psycopg2
import os
from dotenv import load_dotenv
import requests
from datetime import datetime
from xml.etree import ElementTree as ET
from pipeline.pipeline_error import PipelineError

load_dotenv()

entrez_email = os.getenv('ENTREZ_EMAIL')
api_key = os.getenv('PUBMED_API_KEY')
            
insert_author_query = """
    INSERT INTO lu_article (pid, title, abstract, journal_title, journal_id, doi, date_published, authors)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (pid) DO NOTHING;
"""

def input_batch_into_lu_article(data, pool):
    try:
        # Connect to the PostgreSQL database
        connection = pool.getconn()
 
        cursor = connection.cursor()

        for article in data:
            authors = article['Authors'].split('; ')

            cursor.execute(insert_author_query, (
                article['PubMedID'],
                article['Title'],
                article['Abstract'],
                article['Journal'],
                None, 
                article['DOI'],
                article['DatePublished'],
                authors
            ))
            
            connection.commit()
            
    except Exception as error:
        raise PipelineError("Function: input_batch_into_lu_article", 3, error) from error

    finally:
        if connection:
            cursor.close()
            connection.close()
            pool.putconn(connection, close=True)
            
def fetch_pubmed_metadata_pid_batch(pubmed_ids):
    base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?"
    
    
    params = {
        "db": "pubmed",
        "id": ",".join(pubmed_ids),
        "retmode": "xml",
        "email": entrez_email,
        "api_key": api_key
    }
    
    try:
        response = requests.get(base_url, params=params)
        
        if response.status_code == 200:
            root = ET.fromstring(response.content)
            articles = []
            for article in root.findall(".//PubmedArticle"):
                pubmed_id = article.find(".//PMID").text
                doi = article.find(".//ArticleId[@IdType='doi']")
                title = article.find(".//ArticleTitle")
                
                if title.text is not None:
                    title = title.text[:254]
                else:
                    title = ""
                    
                abstract = article.find(".//AbstractText")
                abstract_text = abstract.text if abstract is not None else "No abstract available"
                journal = article.find(".//Journal/Title")
                
                if journal.text is not None:
                    journal = journal.text[:254]
                else:
                    journal = ""
                    
                year = article.find(".//PubDate/Year")
                month = article.find(".//PubDate/Month")
                day = article.find(".//PubDate/Day")
                year = year.text if year is not None else ""
                month = month.text if month is not None else ""
                day = day.text if day is not None else ""
                
                date_parts = [part.strip() if part is not None else "" for part in [month, day, year]]
                date_published = " ".join(date_parts).strip()
                
                # Extract authors
                authors_list = article.findall(".//Author")
                authors = []
                for author in authors_list:
                    last_name = author.find(".//LastName")
                    first_name = author.find(".//ForeName")
                    initials = author.find(".//Initials")
                    author_name = f"{first_name.text if first_name is not None else ''} {last_name.text if last_name is not None else ''} {initials.text if initials is not None else ''}".strip()
                    if author_name:
                        authors.append(author_name)
                authors_text = "; ".join(authors) if authors else "No authors available"
                
                articles.append({
                    "PubMedID": pubmed_id[:254],
                    "Title": title[:254],
                    "DOI": doi.text[:254] if(doi is not None) else "no doi found",
                    "Abstract": abstract_text,
                    "Journal": journal[:254],
                    "DatePublished": date_published[:254],
                    "Authors": authors_text[:254]
                })
            
            return articles
        else:
            print("Error:", response.status_code)
            print("Error: Unable to fetch data from PubMed.")
            return []
    except Exception as error:
        raise PipelineError("Function: fetch_pubmed_metadata_pid_batch", 3, error) from error
        
def get_and_insert_article_details(pubmed_ids, pool):
    batch_size = 300
    batch_count = 0

    for i in range(1, len(pubmed_ids), batch_size):
        batch_count += 1
        batch = pubmed_ids[i:i + batch_size]
        
        # Process the current batch

        data = fetch_pubmed_metadata_pid_batch(batch)
        sleep(.2)
        if data == []:
            print(f"no citations for batch {batch_count}")
            continue
    
        input_batch_into_lu_article(data, pool)


 