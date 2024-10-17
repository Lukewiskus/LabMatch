export interface SearchAuthorResults {
    affiliation: string | null;
    author_id: number; 
    create_date_utc: string; 
    email: string | null; 
    google_cites_per_year: string; //
    google_h_index: number; 
    google_h_index5y: number; 
    google_homepage: string; 
    google_i_index: number; 
    google_i_index5y: number; 
    google_scholar_id: string;
    h_index: number;
    lab_id: number | null; 
    last_modified_date_utc: string | null; 
    name: string; 
}