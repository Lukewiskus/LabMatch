from pipeline.b_get_author_goolge_scholar import get_and_insert_google_scholar_data
import os
from dotenv import load_dotenv
from psycopg2 import Error
from psycopg2.pool import SimpleConnectionPool
from datetime import datetime
from xml.etree import ElementTree as ET
from time import sleep


load_dotenv()

db_config = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT'),
}


pool = SimpleConnectionPool(1, 10, **db_config)


select_all_null_from_lu_author = '''
    select name, author_id from lu_author la where google_scholar_id is null 
'''

def get_all_null_google_scholar_authors():
    try:
        connection = pool.getconn()
        cursor = connection.cursor()

        cursor.execute(select_all_null_from_lu_author)
        
        # Fetch all results
        rows = cursor.fetchall()
    
    except Exception as error:
        print(f"error {error}")
    
    finally:
        if connection:
            cursor.close()
            connection.close()
            pool.putconn(connection, close=True)

    return rows

def main():
    rows = get_all_null_google_scholar_authors()
    
    for row in rows:
        name_arr =  row[0].split()
        name = row[0]
        if len(row[0].split()) == 3:
            name = name_arr[0] + " " + name_arr[2]
        get_and_insert_google_scholar_data(name, row[1], pool)
        sleep(0.3)
main()