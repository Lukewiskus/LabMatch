CREATE TABLE rel_author_pids (
  author_id int,
  pids int[],  -- Array of integers
  create_date_utc timestamp not null,
  last_modified_date_utc timestamp
);