import os
from dotenv import load_dotenv
from psycopg2 import Error
from psycopg2.pool import SimpleConnectionPool
from datetime import datetime
from xml.etree import ElementTree as ET
import time
from pipeline.a_create_author_and_insert_pi_pids import create_author_and_insert_pi_pids
from pipeline.b_get_author_goolge_scholar import get_and_insert_google_scholar_data
from pipeline.c_get_article_details import get_and_insert_article_details
from pipeline.d_get_citations import get_and_insert_author_article_citations
from pipeline.e_calculate_pubmed_hindex import calculate_and_insert_h_index
from pipeline.f_mark_as_complete import mark_as_complete
from pipeline.pipeline_error import PipelineError
from helper import proccess_error, update_queue_step, mark_author_in_db

load_dotenv()

db_config = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT'),
}


pool = SimpleConnectionPool(1, 10, **db_config)

def poll_database():
    connection = None
    try:

        connection = pool.getconn()

        cursor = connection.cursor()

        sql_query = """
                    SELECT queue_id, name
                    FROM lu_collect_author_data_queue
                    WHERE completed_date_utc IS NULL
                    ORDER BY queue_id ASC  -- Optional: order by queue_id ascending to get the smallest queue_id
                    LIMIT 1; 
                    """
        
        cursor.execute(sql_query)  

        row = cursor.fetchone()
        if row:
            queue_id, name = row
            process_task(queue_id, name)
        
    except (Exception, Error) as error:
        print("Error while fetching data from PostgreSQL poll_database:", error)

    finally:
        if connection is not None:
            pool.putconn(connection)

def process_task(queue_id, author_name):
    try:
        print(f'Author Name To Collect Data For: {author_name}, queue_id: {queue_id}')
        author_id = None
        # ===== Step 1 ===== #
        print("step 1")
        update_queue_step(queue_id, 1, pool)
        author_id, pubmed_ids = create_author_and_insert_pi_pids(author_name, queue_id, pool)
        if author_id == -1:
            print("author name already in database")
            mark_author_in_db(queue_id, pool)
            return
         # ===== Step 1 ===== #
        
         # ===== Step 2 ===== #
        update_queue_step(queue_id, 2, pool)
        print("step 2")
        get_and_insert_google_scholar_data(author_name, author_id, pool)
         # ===== Step 2 ===== #

         # ===== Step 3 ===== #
        update_queue_step(queue_id, 3, pool)
        print("step 3")
        get_and_insert_article_details(pubmed_ids, pool)
         # ===== Step 3 ===== #

         # ===== Step 4 ===== #
        update_queue_step(queue_id, 4, pool)
        print("step 4")
        get_and_insert_author_article_citations(pubmed_ids, pool)
         # ===== Step 4 ===== #

         # ===== Step 5 ===== #
        update_queue_step(queue_id, 5, pool)
        print("step 5")
        calculate_and_insert_h_index(author_id, pubmed_ids, pool)
        # ===== Step 5 ===== #
        
        # ===== Step 6 ===== #
        print("step 6")
        update_queue_step(queue_id, 6, pool)
        mark_as_complete(queue_id, pool)
        # ===== Step 6 ===== #

        # ===== Step 7 ===== #
        update_queue_step(queue_id, 7, pool)
        print("step 7 - Complete")
        # ===== Step 7 ===== #

    except PipelineError as e:
        proccess_error(queue_id, author_id, e, pool)
    except Exception as e:
        proccess_error(queue_id, author_id, e, pool)

if __name__ == '__main__':
    while True:
        poll_database()
        time.sleep(10) 
