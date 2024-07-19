CREATE TABLE lu_collect_author_data_queue (
  queue_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  create_date_utc TIMESTAMP NOT NULL,
  completed_date_utc TIMESTAMP,
  step INT,
  author_id INT
)