CREATE TABLE lu_article (
    pid INT PRIMARY KEY,                    
    title VARCHAR(255),             
    abstract TEXT,
    journal_title VARCHAR(255),                  
    journal_id INT,          
    doi VARCHAR(255),          
    date_published VARCHAR,      
    authors VARCHAR[],         
    create_date_utc TIMESTAMP DEFAULT current_timestamp,     
    last_modified_date_utc TIMESTAMP
);