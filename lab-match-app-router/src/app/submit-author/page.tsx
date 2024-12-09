import FlexBox from "@/components/flexBox";
import { AuthorInputForm } from "@/components/submitAuthor/authorInputForm";
import { AuthorValidationFlow } from "@/components/submitAuthor/authorValidationFlow";
import { SubmitAuthorContextProvider } from "@/context/SubmitAuthorContext";
import { Box, Typography } from "@mui/material";

// app/about/page.tsx
export default function SubmitAuthorPage() {
    return (
      <div>
        <Box sx={{marginTop: "100px"}}>
          <FlexBox>
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '16px' }}>
            Enter the name of a Principal Investigator not currently in our database, and we will search PubMed to collect relevant information on them.
            </Typography>
          </FlexBox>
          <SubmitAuthorContextProvider>
            <AuthorInputForm />
            <AuthorValidationFlow />
          </SubmitAuthorContextProvider>
        </Box>
      </div>
    );
  }
  