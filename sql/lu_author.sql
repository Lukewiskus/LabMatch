CREATE TABLE lu_author (
  author_id SERIAL PRIMARY KEY,
  google_scholar_id VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  affiliation VARCHAR(255),
  email VARCHAR(255),
  lab_id INT,
  h_index REAL,
  google_h_index REAL,
  google_h_index5y REAL,
  google_i_index REAL,
  google_i_index5y REAL,
  google_homepage VARCHAR(255),
  google_cites_per_year VARCHAR(255),
	create_date_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_date_utc TIMESTAMP 
);
