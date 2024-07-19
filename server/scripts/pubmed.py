import os
from dotenv import load_dotenv
import psycopg2
from psycopg2 import Error
from psycopg2.pool import SimpleConnectionPool
from datetime import datetime
from xml.etree import ElementTree as ET
import requests
import json
from time import sleep
from urllib.parse import urlencode

entrez_email = os.getenv('ENTREZ_EMAIL')
api_key = os.getenv('PUBMED_API_KEY')

def does_author_name_match(input_name, name_from_article):
    input_name_parts = input_name.split(' ')
    name_from_article_parts = name_from_article.split(' ')
    
    matching_parts_count = sum(1 for part in input_name_parts if part in name_from_article_parts)
    
    # If at least two parts match, return True; otherwise, return False
    return matching_parts_count >= 2

def fetch_pubmed_pi_articles_in_batches(pubmed_ids, author_name):
    batch_size = 100
    articles_total = []
    for i in range(1, len(pubmed_ids), batch_size):

        batch = pubmed_ids[i:i + batch_size]
        articles, has_five = fetch_pubmed_pi_articles_metadata_pid_batch(batch, author_name)
        
        articles_total = articles_total + articles 
        if(has_five):
            return articles
        sleep(0.2)
    return articles_total

def fetch_pubmed_pi_articles_metadata_pid_batch(pubmed_ids, author_name):
    base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?"
    pubmed_ids_str = [str(id) for id in pubmed_ids]
    print(len(pubmed_ids_str))
    params = {
        "db": "pubmed",
        "retmax": 10000,  # Adjust the number as needed to retrieve more results
        "id": ",".join(pubmed_ids_str),
        "retmode": "xml",
        "email": entrez_email,
        "api_key": api_key,
    }
    
    response = requests.get(base_url, params=params)
    
    has_five = False
    if response.status_code == 200:
        root = ET.fromstring(response.content)
        articles = []

        for article in root.findall(".//PubmedArticle"):
            authors_list = [f"{author.findtext('ForeName', '')} {author.findtext('LastName', '')}" for author in article.findall('.//Author')]
            last_author = authors_list[-1]
            
            if does_author_name_match(author_name.lower(), last_author.lower()):
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
                authors_list = article.findall('.//Author')
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
                    "PubMedID": pubmed_id,
                    "Title": title,
                    "DOI": doi.text if(doi is not None) else "no doi found",
                    "Abstract": abstract_text,
                    "Journal": journal,
                    "DatePublished": date_published,
                    "Authors": authors_text
                })
                
                if(len(articles) == 5):
                    has_five = True
                    break
        
        return articles, has_five
    else:
        print("Error:", response.status_code)
        print(response.content)
        print("Error: Unable to fetch data from PubMed.")
        return []
    
    
def is_author_in_pubmed(author_name):
    # Prepare search term for exact author match
    base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?"
    
    # Parameters for the search query
    params = {
        "db": "pubmed",
        "term": f"{author_name}[author]",
        "retmax": 10000,  # Adjust the number as needed to retrieve more results
        "retmode": "json",
        "email": entrez_email,
        "api_key": api_key,
        "sort": "pub date"
    }
    
    url = base_url + urlencode(params)
    
    response = requests.get(url)
    
    obj = {}
    obj["isAuthorInPubmed"] = False
    obj["articleObjects"] = []
    pubmed_ids = []
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        # Extract PubMed IDs from the response
        pubmed_ids = data.get("esearchresult", {}).get("idlist", [])
    else:
        print("Error: Unable to fetch data from PubMed.")
        return obj
    
    if(len(pubmed_ids) == 0):
        return obj
    
    sleep(0.1)
    pi_articles = fetch_pubmed_pi_articles_in_batches(pubmed_ids, author_name)

    if(len(pi_articles) != 0):
        obj["isAuthorInPubmed"] = True
        obj["articleObjects"] = pi_articles
        return obj
    

    return obj
    
    