import { PaperData } from "@/interfaces/PaperData";
import FlexBox from "../flexBox";
import { Box, Grid } from "@mui/material";
import InvestigatorArticleCard from "./InvestigatorArticleCard";

interface ArticleGridProps {
    papers: PaperData[];
  }


  const InvestigatorArticleGrid: React.FC<ArticleGridProps> = ({ papers }) => {


    return (
        <FlexBox>
        <Box sx={{ width: "100%", padding: 3 }}>
          <Grid container spacing={3}>
            {papers?.map((article, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <InvestigatorArticleCard paper={article} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </FlexBox>
    );
  };
  
  
  export default InvestigatorArticleGrid;
  