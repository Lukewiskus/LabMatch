import psycopg2
from pipeline.pipeline_error import PipelineError


select_pid_citation_rows_from_db_query = """
                                        SELECT cardinality(citation_pids) AS citation_count
                                        FROM rel_pid_citations
                                        WHERE pid = ANY(%s);
                                    """

def select_pid_citation_rows_from_db(pubmed_ids, pool):
    try:
        connection = pool.getconn()
        cursor = connection.cursor()
        pubmed_ids_int = [int(pubmed_id) for pubmed_id in pubmed_ids]

        cursor.execute(select_pid_citation_rows_from_db_query, (pubmed_ids_int,))
        
        # Fetch all results
        rows = cursor.fetchall()
    except Exception as error:
        raise PipelineError("Function: select_pid_citation_rows_from_db", 5, error) from error

    finally:
        if connection:
            cursor.close()
            connection.close()
            pool.putconn(connection, close=True)

    return rows

def calculate_h_index(rows):
    # Extract citation counts
    citation_counts = [pub[0] for pub in rows]
    
    # Sort citation counts in descending order
    citation_counts.sort(reverse=True)
    
    # Calculate the h-index
    h_index = 0
    for i, citations in enumerate(citation_counts):
        if citations >= i + 1:
            h_index = i + 1
        else:
            break
    
    return h_index


update_lu_author_h_index_sql_query = """
    UPDATE lu_author 
    SET h_index = %s 
    WHERE author_id = %s
    """
    
def update_lu_author_h_index(author_id, h_index, pool):
    try:
        connection = pool.getconn()
        cursor = connection.cursor()
        cursor.execute(update_lu_author_h_index_sql_query, (h_index, str(author_id)))
        connection.commit()
    except psycopg2.Error as e:
        raise PipelineError("Function: update_lu_author_h_index", 5, e) from e
    
    finally:
        if connection:
            cursor.close()
            connection.close()
            pool.putconn(connection, close=True)

def calculate_and_insert_h_index(author_id, pubmed_ids, pool):
    #iterate through rel pid_citations, get a dict of pid to citations
    rows = select_pid_citation_rows_from_db(pubmed_ids, pool)
    
    #iterate through that array and calcualte h-index
    h_index = calculate_h_index(rows)
    
    #save to lu_author
    update_lu_author_h_index(author_id, h_index, pool)
    