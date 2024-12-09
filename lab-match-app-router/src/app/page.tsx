import { Box, Link, Typography } from '@mui/material'
import SearchBar from '@/components/searchBar'
import FlexBox from '@/components/flexBox'
import SearchResults from '@/components/searchResults'
import ClientWrapper from '@/components/clientWrapper'
import styles from "@/styles/Home.module.css";


export default async function Home() {
  return (
    <div className={styles.homeWrapper}>
      <ClientWrapper>
        <Box >
          <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '16px', marginTop: '16px' }}>
              Welcome to LabMatch! Search for the name of the Principal Investigator to see the informamation of their Lab collected
          </Typography >
          <FlexBox >
            <SearchBar/>
          </FlexBox>
          <FlexBox >
            <SearchResults />
          </FlexBox>
          <FlexBox>
            <Typography>If you want to find information on a specific PI that we do not have the data for, input their information <Link href="/submit-author">here</Link></Typography>
          </FlexBox>
          <FlexBox  />
        </Box>
      </ClientWrapper>

    </div>
  )

}