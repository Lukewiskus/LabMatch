from pipeline.b_get_author_goolge_scholar import get_and_insert_google_scholar_data
import os
from dotenv import load_dotenv
from psycopg2 import Error
from psycopg2.pool import SimpleConnectionPool
from datetime import datetime
from xml.etree import ElementTree as ET
import time


load_dotenv()

db_config = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT'),
}


pool = SimpleConnectionPool(1, 10, **db_config)


def main():
    get_and_insert_google_scholar_data("Luigi Ferrucci", 101, pool)

main()