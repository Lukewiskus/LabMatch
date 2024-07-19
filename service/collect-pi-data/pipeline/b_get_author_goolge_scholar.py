import scholarly
from scholarly import scholarly
import json
import requests
from pipeline.pipeline_error import PipelineError

update_lu_author_query = '''
    UPDATE lu_author
    SET 
        google_h_index = %(google_h_index)s,
        google_h_index5y = %(google_h_index5y)s,
        google_i_index = %(google_i_index)s,
        google_i_index5y = %(google_i_index5y)s,
        google_homepage = %(google_homepage)s,
        google_scholar_id = %(google_scholar_id)s,
        google_cites_per_year = %(google_cites_per_year)s
    WHERE author_id = %(author_id)s;

'''

import json
from scholarly import scholarly

def fetch_author_data(name):
    author = None
    search_query = scholarly.search_author(name)
    try:
        author = next(search_query)
        author = scholarly.fill(author, sections=['basics', 'citations', 'indices', 'counts'])
        return author
    except StopIteration as error:
        raise PipelineError("Function: fetch_author_data", 2, error) from error
    finally:
        return author
        
def get_and_insert_google_scholar_data(name, author_id, pool):
    author = fetch_author_data(name)
    
    if not author:
        name_with_spaces = name.replace('-', ' ')
        author = fetch_author_data(name_with_spaces)
    
    if not author:
        name_arr =  name.split()
        if len(name_arr) == 3:
            name = name_arr[0] + " " + name_arr[2]
        author = fetch_author_data(name)
    if author:
        try:
            author_data = {
                'google_h_index': author['hindex'] if author.get('hindex') else None,
                'google_h_index5y': author['hindex5y'] if author.get('hindex5y') else None,
                'google_i_index': author['i10index'] if author.get('i10index') else None,
                'google_i_index5y': author['i10index5y'] if author.get('i10index5y') else None,
                'google_homepage': author['homepage'] if author.get('homepage') else None,
                'google_scholar_id': author['scholar_id'] if author.get('scholar_id') else None,
                'google_cites_per_year': json.dumps(author['cites_per_year']) if author.get('cites_per_year') else None,
                'author_id': author_id
            }

            connection = None
            
            connection = pool.getconn()
            cursor = connection.cursor()
                        
            cursor.execute(update_lu_author_query, author_data)
            connection.commit()
                
        except Exception as error:
            print(f"Error in get_and_insert_google_scholar_data: {error}")
            raise PipelineError("Function: get_and_insert_google_scholar_data", 2, error) from error

        finally:
            if connection:
                cursor.close()
                pool.putconn(connection)
    else:
        print(f"No author found for name: {name}")
