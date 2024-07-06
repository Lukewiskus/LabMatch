import os
from dotenv import load_dotenv
import psycopg2
from psycopg2 import Error
from psycopg2.pool import SimpleConnectionPool


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
                    select * from lu_author where name Ilike %s;
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
            obj["name"] = row[1]
            obj["h-index"] = row[4]
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