CREATE TABLE rel_pid_citations (
  pid INT PRIMARY KEY,
  citation_pids INT[],
  create_date_utc TIMESTAMP DEFAULT current_timestamp,
  last_modified_date_utc TIMESTAMP
)
