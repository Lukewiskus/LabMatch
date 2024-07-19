import psycopg2
import requests
from urllib.parse import urlencode
from time import sleep
from pipeline.pipeline_error import PipelineError

check_author_exists_query = '''
    SELECT author_id FROM lu_author WHERE name = %s;
'''

insert_author_into_database_query = ''' INSERT INTO lu_author (name, create_date_utc)
                                        VALUES (%s, CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
                                        RETURNING author_id;
                                    '''
                                    
update_queue_with_author_id_query = """
            UPDATE lu_collect_author_data_queue
            SET author_id = %s
            WHERE queue_id = %s;
            """


def insert_author_into_database(name, queue_id, pool):
    try:
        connection = pool.getconn()

        cursor = connection.cursor()
        
        cursor.execute(check_author_exists_query, (name,))
        existing_author = cursor.fetchone()

        if existing_author:
            # Author already exists
            return -1
        
        cursor.execute(insert_author_into_database_query, (name, ))
        author_id = cursor.fetchone()[0]

        connection.commit()
        
        cursor.execute(update_queue_with_author_id_query, (author_id, queue_id))
        connection.commit()
        
        return author_id
    except Exception as error:
        print(f"Error connecting to the database insert author: {error}")
        raise PipelineError("Function: insert_author_into_database", 1, error) from error
    finally:
        if connection:
            cursor.close()
            connection.close()
            pool.putconn(connection, close=True)
    
    return - 1

def search_pubmed_by_author(author_name, pool):
    # Base URL for the Entrez E-utilities
    base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?"
    
    # Parameters for the search query
    params = {
        "db": "pubmed",
        "term": f"{author_name}[author]",
        "retmax": 10000,  # Adjust the number as needed to retrieve more results
        "retmode": "json"
    }
    
    # Construct the URL with parameters
    url = base_url + urlencode(params)
    
    # Make the request to PubMed
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        # Extract PubMed IDs from the response
        pubmed_ids = data.get("esearchresult", {}).get("idlist", [])
        pubmed_ids_int = [int(pubmed_id) for pubmed_id in pubmed_ids]

        return pubmed_ids, pubmed_ids_int
    else:
        print("Error: Unable to fetch data from PubMed.")
        raise PipelineError("Function: search_pubmed_by_author", 1, f"response code: {response.status_code}")

collect_and_input_author_pids_query = ''' INSERT INTO rel_author_pids (author_id, pids, create_date_utc)
                                           VALUES(%s, %s, CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
                                    '''

def collect_and_input_author_pids(name, author_id, pool):
    try:
        pubmed_ids_str, pubmed_ids_int = search_pubmed_by_author(name, pool)
        sleep(0.2)
        # Get a connection from the pool
        connection = pool.getconn()

        # Create a cursor to perform database operations
        cursor = connection.cursor()
        
        cursor.execute(collect_and_input_author_pids_query, (author_id, pubmed_ids_int))

        connection.commit()
        
        return pubmed_ids_str
    except Exception as error:
        print(f"Error connecting to the database collect_and_input_author_pids: {error}")
        raise PipelineError("Function: collect_and_input_author_pids", 1, error)
    finally:
        if connection:
            cursor.close()
            connection.close()
            pool.putconn(connection, close=True)

def create_author_and_insert_pi_pids(name, queue_id, pool):
    author_id = insert_author_into_database(name, queue_id, pool)
    if author_id == -1:
        return -1, []
    
    pubmed_ids = collect_and_input_author_pids(name, author_id, pool)    
    return author_id, pubmed_ids