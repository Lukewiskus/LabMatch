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

import xml.dom.minidom
from urllib.parse import urlencode

# Load environment variables from .env file
load_dotenv()

# Database connection parameters
db_config = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT'),
}


pool = SimpleConnectionPool(1, 10, **db_config)


def search_entities(query):
    connection = None
    try:
        # Get a connection from the pool
        connection = pool.getconn()

        # Create a cursor to perform database operations
        cursor = connection.cursor()

        # SQL query with parameterized query for search
        
        sql_query = """
                    select * from lu_author where name Ilike %s LIMIT 50;
                    """
        
        # Replace with your actual table name and column

        # Execute the SQL query with the search_query as parameter
        cursor.execute(sql_query, (f'%{query}%', ))  # Note the use of tuple for parameters

        # Fetch all rows from the result set
        rows = cursor.fetchall()

        # Print fetched rows
        
        retval = []
        for index, row in enumerate(rows):  # Use enumerate to get index and row
            obj = {}
            obj["authorId"] = row[0]
            obj["name"] = row[2]
            obj["h_index"] = row[6]
            retval.append(obj)

        return retval  # Return the rows fetched

    except (Exception, Error) as error:
        print("Error while fetching data from PostgreSQL:", error)
        return None

    finally:
        # Release the connection back to the pool
        if connection:
            pool.putconn(connection)
            print("PostgreSQL connection is returned to the pool")
            

def get_year(date_str):
    parts = date_str.split()
    if len(parts) == 0:
        return None  # Return None if the string is empty or has no parts
    return parts[-1]  # Return the last part which should be the year
   
def get_author_details(id):
    connection = None
    try:
        # Get a connection from the pool
        connection = pool.getconn()

        # Create a cursor to perform database operations
        cursor = connection.cursor()

        # SQL query with parameterized query for search
        
        sql_query = """
                    SELECT 
                        la.author_id, 
                        la.google_scholar_id, 
                        la.name, 
                        la.affiliation, 
                        la.email, 
                        la.lab_id, 
                        la.h_index, 
                        la.google_h_index, 
                        la.google_h_index5y,
                        la.google_i_index, 
                        la.google_i_index5y, 
                        la.google_homepage, 
                        la.google_cites_per_year, 
                        la.create_date_utc, 
                        la.last_modified_date_utc, 
                        COUNT(rap.pids),
                        ARRAY_AGG(lar.date_published) AS dates_published
                    FROM 
                        lu_author AS la
                    JOIN 
                        rel_author_pids AS rap ON la.author_id = rap.author_id
                    JOIN 
                        LATERAL unnest(rap.pids) AS unnested_pid(pid) ON true
                    JOIN 
                        lu_article AS lar ON unnested_pid.pid = lar.pid
                    WHERE 
                        la.author_id = %s
                    GROUP BY 
                        la.author_id, 
                        la.google_scholar_id, 
                        la.name, 
                        la.affiliation, 
                        la.email, 
                        la.lab_id, 
                        la.h_index, 
                        la.google_h_index, 
                        la.google_h_index5y,
                        la.google_i_index, 
                        la.google_i_index5y, 
                        la.google_homepage, 
                        la.google_cites_per_year, 
                        la.create_date_utc, 
                        la.last_modified_date_utc;
                    """

        cursor.execute(sql_query, (id, )) 

        rows = cursor.fetchall()

        row = rows[0]

        obj = {}
        
        scholar_id = row[1]
        
        obj["authorId"] = row[0]
        obj["name"] = row[2]
        obj["affiliation"] = row[3]
        obj["email"] = row[4]
        obj["lab_id"] = row[5]
        obj["h_index"] = row[6]
        
        if scholar_id is not None:
            obj["google_scholar_id"] = scholar_id
            obj["google_h_index"] = row[7]
            obj["google_h_index5y"] = row[8]
            obj["google_i_index"] = row[9]
            obj["google_i_index5y"] = row[10]
            obj["google_homepage"] = row[11]
            if row[12] is not None:
                clean_string =  row[12].replace("\\", "")
                citation_obj = json.loads(clean_string)
                obj["google_cites_per_year"] = citation_obj
            else:
                obj["google_cites_per_year"] = None
        obj["create_date_utc"] = row[13]
        obj["last_modified_date_utc"] = row[14]
        obj["total_pubmed_publications"] = row[15]
        obj["dates_published"] = [get_year(date)for date in row[16]]
        return obj 

    except (Exception, Error) as error:
        print("Error while fetching data from PostgreSQL:", error)
        return None

    finally:
        # Release the connection back to the pool
        if connection:
            pool.putconn(connection)
            print("PostgreSQL connection is returned to the pool")
    
    
def is_author_in_database(authorName):
    connection = None
    try:
        # Get a connection from the pool
        connection = pool.getconn()

        # Create a cursor to perform database operations
        cursor = connection.cursor()

        # SQL query with parameterized query for search
        
        sql_query = """
                    SELECT count(name) FROM lu_author WHERE LOWER(name) = LOWER(%s);
                    """
        
        # Replace with your actual table name and column

        # Execute the SQL query with the search_query as parameter
        cursor.execute(sql_query, (authorName, ))  # Note the use of tuple for parameters

        # Fetch all rows from the result set
        rows = cursor.fetchall()

        row = rows[0]
        obj = {}
        
        obj["isAuthorInDb"] = row[0] > 0

        return obj  # Return the rows fetched

    except (Exception, Error) as error:
        print("Error while fetching data from PostgreSQL:", error)
        return None

    finally:
        # Release the connection back to the pool
        if connection:
            pool.putconn(connection)
            print("PostgreSQL connection is returned to the pool")
            
def insert_author_name_into_queue(authorName):
    connection = None
    try:
        # Get a connection from the pool
        connection = pool.getconn()

        # Create a cursor to perform database operations
        cursor = connection.cursor()

        # SQL query with parameterized query for search
        
        sql_query = """
                    INSERT INTO lu_collect_author_data_queue (name, step, create_date_utc)
                    VALUES (%s, 0, CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
                    RETURNING queue_id;
                    """
        
        # Replace with your actual table name and column

        # Execute the SQL query with the search_query as parameter
        cursor.execute(sql_query, (authorName, ))  # Note the use of tuple for parameters
        
        queue_id = cursor.fetchone()[0]
        
        connection.commit()
        return queue_id

    except (Exception, Error) as error:
        print("Error while fetching data from PostgreSQL:", error)


    finally:
        # Release the connection back to the pool
        if connection:
            pool.putconn(connection)
            print("PostgreSQL connection is returned to the pool")
            
def get_queue_id_step(queue_id):
    connection = None
    try:
        # Get a connection from the pool
        connection = pool.getconn()

        # Create a cursor to perform database operations
        cursor = connection.cursor()

        # SQL query with parameterized query for search
        
        sql_query = """
                    select step from lu_collect_author_data_queue 
                    where queue_id = %s;
                    """
        
        # Replace with your actual table name and column

        # Execute the SQL query with the search_query as parameter
        cursor.execute(sql_query, (queue_id, ))  # Note the use of tuple for parameters
        
        step = cursor.fetchone()[0]

        connection.commit()
        return step

    except (Exception, Error) as error:
        print("Error while fetching data from PostgreSQL:", error)


    finally:
        # Release the connection back to the pool
        if connection:
            pool.putconn(connection)

get_author_using_queue_id_query = """
            SELECT author_id FROM lu_collect_author_data_queue WHERE queue_id = %s;
            """
                    
def get_author_using_queue_id(queue_id):
    connection = None
    try:

        connection = pool.getconn()

        cursor = connection.cursor()
        
        cursor.execute(get_author_using_queue_id_query, (queue_id, ))
        
        author_id = cursor.fetchone()[0]

        connection.commit()
        
        print(author_id)
        
        author_data = get_author_details(author_id)
        
        return author_data
    except (Exception, Error) as error:
        print("Error while fetching data from PostgreSQL:", error)


    finally:
        # Release the connection back to the pool
        if connection:
            pool.putconn(connection)
