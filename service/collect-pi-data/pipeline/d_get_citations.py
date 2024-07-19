from Bio import Entrez
from time import sleep
import psycopg2
import os
from dotenv import load_dotenv

from pipeline.pipeline_error import PipelineError

load_dotenv()


entrez_email = os.getenv('ENTREZ_EMAIL')
api_key = os.getenv('PUBMED_API_KEY')

insert_rel_pid_citations_sql = '''
    INSERT INTO rel_pid_citations (pid, citation_pids)
    VALUES (%s, %s)
    ON CONFLICT (pid) DO NOTHING;
    '''

def insert_rel_pid_citations(citation_dict, pool):
    try:
        # Connect to the PostgreSQL database
        connection = pool.getconn()
        cursor = connection.cursor()

        for key in citation_dict:
            citations = citation_dict[key].get("citations", [])
            
            cursor.execute(insert_rel_pid_citations_sql, (
                key,
                citations
            ))
            
            connection.commit()
            
                               
    except Exception as error:
        raise PipelineError("Function: insert_rel_pid_citations", 4, error) from error

    finally:
        if connection:
            cursor.close()
            connection.close()
            pool.putconn(connection, close=True)
    return

def fetch_total_citations_in_batch(pids):
    Entrez.email = entrez_email
    Entrez.api_key = api_key
    
    if api_key == "":
        print("NO API KEYE")
        return
    
    pid_to_citation_detail = {}
    
    for pid in pids:
        # Fetch the list of papers that cite the given paper
        handle = Entrez.elink(dbfrom="pubmed", db="pubmed", LinkName="pubmed_pubmed_citedin", id=str(pid))
        
        record = Entrez.read(handle)
        handle.close()

        # Extract the list of cited PMIDs
        cited_pmids = []
        pid_to_citation_detail[str(pid)] = {}
        try:
            # Check if the necessary keys are present and non-empty
            if "LinkSetDb" in record[0] and len(record[0]["LinkSetDb"]) > 0:
                links = record[0]["LinkSetDb"][0].get("Link", [])
                cited_pmids = [link["Id"] for link in links]
                pid_to_citation_detail[str(pid)]["citations"] = [int(pmid) for pmid in cited_pmids]
        except Exception as e:
            raise PipelineError(f"Function: fetch_total_citations_in_batch, Unexpected error processing citations for PID {pid}: {e}. Record: {record}", 4, e) from e

        sleep(0.2)
        
    return pid_to_citation_detail

def get_and_insert_author_article_citations(pubmed_ids, pool):
    batch_size = 100
    batch_count = 0

    for i in range(1, len(pubmed_ids), batch_size):
        batch_count += 1
        batch = pubmed_ids[i:i + batch_size]
        print(batch_count)
        citation_data = fetch_total_citations_in_batch(batch)

        sleep(1)
        insert_rel_pid_citations(citation_data, pool)

    
