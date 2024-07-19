CREATE TABLE er_collect_author_data_errors (
  queue_id INT,
  step INT,
  error VARCHAR(255) NOT NULL,
  logged_date_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)