'use client';

import { Box, Typography, Divider, Link } from '@mui/material';
import FlexBox from '@/components/flexBox';
import CitationChart from '@/components/charts/citationChart';
import BarChart  from '@/components/charts/barChart';

type AuthorInfoProps = {
  author: {
    name?: string;
    create_date_utc?: string;
    last_modified_date_utc?: string;
    affiliation?: string;
    google_homepage?: string;
    h_index?: number;
    google_h_index?: number;
    google_h_index5y?: number;
    google_i_index?: number;
    google_i_index5y?: number;
    google_cites_per_year?: Record<string, number>;
    google_scholar_id?: string;
    total_pubmed_publications?: number;
    dates_published?: Record<string, number>;
  };
};

const AuthorInfo: React.FC<AuthorInfoProps> = ({ author }) => {
  const googleScholarUrl = `https://scholar.google.com/citations?user=${author?.google_scholar_id ?? ''}`;
  const linkToPubmed = `https://pubmed.ncbi.nlm.nih.gov/?term=${author?.name?.replace(/\s+/g, '+')}`;

  if (!author) return null;

  return (
    <FlexBox>
      <Box sx={{ marginLeft: '16px', paddingLeft: '8px' }}>
        {/* Author Name */}
        {author.name && (
          <Typography variant="h3" component="h1" gutterBottom>
            {author.name}
          </Typography>
        )}

        <FlexBox sx={{mb: "16px"}}>
        {/* PubMed Link */}
        {author.name && (
          <Typography variant="body1">
            <Link href={linkToPubmed} target="_blank" rel="noopener">
              PubMed
            </Link>
          </Typography>
        )}

        {/* Google Scholar Link */}
        {author.google_scholar_id && (
          <>
            <Typography variant="body1">
              <Link href={googleScholarUrl} target="_blank" rel="noopener noreferrer">
                Google Scholar Profile
              </Link>
            </Typography>
          </>
        )}

        </FlexBox>
        <Divider />

        {/* Dates */}
        <Box>
          {author.create_date_utc && (
            <Typography variant="body1">
              <strong>Date Added To Our Database:</strong>{' '}
              {new Date(author.create_date_utc).toLocaleString()}
            </Typography>
          )}
          {author.last_modified_date_utc && (
            <Typography variant="body1">
              <strong>Last Modified Date:</strong>{' '}
              {new Date(author.last_modified_date_utc).toLocaleString()}
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />
        </Box>

        {/* Affiliation */}
        {author.affiliation && (
          <>
            <Typography variant="h6" component="h2" gutterBottom>
              {author.affiliation}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Lab Homepage */}
        {author.google_homepage && (
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

        {/* H-Index and Citation Data */}
        <Box>
          {author.h_index && (
            <Typography variant="body1">
              <strong>H-Index:</strong> {author.h_index}
            </Typography>
          )}
          {(author.google_h_index || author.google_h_index5y || author.google_i_index || author.google_i_index5y) && (
            <>
              <Typography variant="body1">
                <strong>Google H-Index:</strong> {author.google_h_index}
              </Typography>
              <Typography variant="body1">
                <strong>Google H-Index (5 years):</strong> {author.google_h_index5y}
              </Typography>
              <Typography variant="body1">
                <strong>Google i10-Index:</strong> {author.google_i_index}
              </Typography>
              <Typography variant="body1">
                <strong>Google i10-Index (5 years):</strong> {author.google_i_index5y}
              </Typography>
              {author.google_cites_per_year && (
                <CitationChart data={author.google_cites_per_year} />
              )}
            </>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* PubMed Publications */}
        <Box>
          {author.total_pubmed_publications && (
            <Typography variant="body1">
              <strong>Total PubMed Publications:</strong> {author.total_pubmed_publications}
            </Typography>
          )}
        </Box>

        {/* Publication Dates */}
        <Box>
          {author.dates_published && <BarChart data={author.dates_published} />}
        </Box>
      </Box>
    </FlexBox>
  );
};

export default AuthorInfo;
