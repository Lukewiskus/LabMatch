import { Box, Typography, Divider, Link } from '@mui/material';
import BarChart from './barChart';
import CitationChart from './citationChart';
import CenterBox from './centerBox';

const AuthorInfo = ({ author }) => {
const googleScholarUrl = `https://scholar.google.com/citations?user=${author?.google_scholar_id ?? ""}`;

const linkToPubmed = `https://pubmed.ncbi.nlm.nih.gov/?term=${author?.name?.replace(/\s+/g, '+')}`;
  return (
    <>
        {author ? <>
        <CenterBox>
            <Box sx={{ marginLeft: "16px", paddingLeft: "8px" }}>
                    {author?.name && (
                        <Typography variant="h3" component="h1" gutterBottom>
                            {author.name}
                        </Typography>
                    )}

                    {author?.name && (
                        <Typography variant='p'>
                            <Link href={linkToPubmed} target="_blank" rel="noopener">
                                Author On Pubmed
                            </Link>
                        </Typography>
                    )}

                <Box>
                    {author?.create_date_utc && (
                        <Typography variant="body1"><strong>Date Added To Our Database:</strong> {new Date(author.create_date_utc).toLocaleString()}</Typography>
                    )}
                    {author?.last_modified_date_utc && (
                        <Typography variant="body1"><strong>Last Modified Date:</strong> {new Date(author.last_modified_date_utc).toLocaleString()}</Typography>
                    )}
                    <Divider sx={{ my: 2 }} />
                </Box>

                {author?.affiliation && (
                    <>
                        <Typography variant="h6" component="h2" gutterBottom>
                            {author.affiliation}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                    </>
                )}

                    

                {author?.google_homepage && (
                    <>
                    <Box>
                        <Typography variant="body1">
                            <strong>Lab Homepage:</strong>{' '}
                            <Link href={author.google_homepage} target="_blank" rel="noopener">
                                {author.google_homepage}
                            </Link>
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    </>
                )}



                <Box>
                    {author?.h_index && (
                        <Typography variant="body1"><strong>H-Index:</strong> {author.h_index}</Typography>
                    )}
                    {( author?.google_h_index || author?.google_h_index5y || author?.google_i_index || author?.google_i_index5y || author?.google_cites_per_year) && (
                        <>
                            <Typography variant="body1"><strong>Google H-Index:</strong> {author.google_h_index}</Typography>
                            <Typography variant="body1"><strong>Google H-Index (5 years):</strong> {author.google_h_index5y}</Typography>
                            <Typography variant="body1"><strong>Google i10-Index:</strong> {author.google_i_index}</Typography>
                            <Typography variant="body1"><strong>Google i10-Index (5 years):</strong> {author.google_i_index5y}</Typography>
                            <CitationChart data={author.google_cites_per_year}></CitationChart>


                        </>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                    {author?.google_scholar_id && (
                        <>
                        <Typography variant="body1">
                            <Link href={googleScholarUrl} target="_blank" rel="noopener noreferrer">
                                Google Scholar Profile
                            </Link>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        </>

                    )}
                </Box>

                <Box>
                    {author?.total_pubmed_publications && (
                        <Typography variant="body1"><strong>Total Pubmed Publications:</strong> {author.total_pubmed_publications}</Typography>
                    )}
                </Box>

                <Box>
                    {author?.dates_published && (
                        <BarChart data={author.dates_published} />
                    )}
                </Box>
            </Box>
        </CenterBox>
    </> : <></>}
    </>

  );
};

export default AuthorInfo;
