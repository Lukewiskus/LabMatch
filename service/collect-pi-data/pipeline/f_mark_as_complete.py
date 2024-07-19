from psycopg2 import Error
from pipeline.pipeline_error import PipelineError

sql_query = """
            UPDATE lu_collect_author_data_queue
            SET completed_date_utc = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
            WHERE queue_id = %s;
            """
                    
def mark_as_complete(queue_id, pool):
    connection = None
    try:

        connection = pool.getconn()

        cursor = connection.cursor()
        
        cursor.execute(sql_query, (queue_id, ))  
        connection.commit()

    except (Exception, Error) as error:
        raise PipelineError("Function: mark_as_complete", 6, error) from error

    finally:
        if connection:
            cursor.close()
            connection.close()
            pool.putconn(connection, close=True)