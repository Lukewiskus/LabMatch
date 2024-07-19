from psycopg2 import Error
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

log_error_into_db_query = """
INSERT INTO er_collect_author_data_errors (queue_id, step, error)
VALUES (%s, %s, %s);
""" 
def log_error_into_db(queue_id, error, pool):
    connection = None

    connection = pool.getconn()

    cursor = connection.cursor()
    
    cursor.execute(log_error_into_db_query, (queue_id, -1, str(error)))  
    connection.commit()

    if connection:
        cursor.close()
        connection.close()
        pool.putconn(connection, close=True)

delete_inserted_info_query_author = """
    DELETE FROM lu_author WHERE author_id = %s
"""

delete_inserted_info_query_rel = """
    DELETE FROM rel_author_pids WHERE author_id = %s
"""
def delete_inserted_info(author_id, pool):
    connection = None

    connection = pool.getconn()

    cursor = connection.cursor()
    
    cursor.execute(delete_inserted_info_query_author, (author_id,))
    
    cursor.execute(delete_inserted_info_query_rel, (author_id,))
    
    connection.commit()
    connection.commit()


    if connection:
        cursor.close()
        connection.close()
        pool.putconn(connection, close=True)

mark_as_incomplete_query = """
            UPDATE lu_collect_author_data_queue
            SET completed_date_utc = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
            WHERE queue_id = %s;
"""
def mark_as_incomplete(queue_id, pool):
    connection = None

    connection = pool.getconn()

    cursor = connection.cursor()
    
    cursor.execute(mark_as_incomplete_query, (queue_id, ))  
    connection.commit()

    if connection:
        cursor.close()
        connection.close()
        pool.putconn(connection, close=True)


def proccess_error(queue_id, author_id, error, pool):
    logger.log(logging.ERROR, f"queue_id: {queue_id}, author_id {author_id}, error: {error}")
    log_error_into_db(queue_id, error, pool)
    delete_inserted_info(author_id, pool)
    mark_as_incomplete(queue_id, pool)
    update_queue_step(queue_id, -1, pool)


sql_update_queue_step_query = """
    UPDATE lu_collect_author_data_queue
    SET step = %s
    WHERE queue_id = %s;
"""
        
def update_queue_step(queue_id, step, pool):
    connection = None
    try:
        connection = pool.getconn()
        cursor = connection.cursor()
        cursor.execute(sql_update_queue_step_query, (step, queue_id))  # Corrected order of parameters
        connection.commit()
    except (Exception, Error) as error:
        print("Error while updating queue step", error)
        if connection:
            pool.putconn(connection)
        
    finally:
        if connection:
            pool.putconn(connection)
            
            
def mark_author_in_db(queue_id, pool):
    mark_as_incomplete(queue_id, pool)
    update_queue_step(queue_id, -2, pool)
