"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Button,
  Collapse,
  Box,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { PaperData } from "@/interfaces/PaperData";
import FlexBox from "../flexBox";

interface ArticleCardProps {
  paper: PaperData;
}

const InvestigatorArticleCard: React.FC<ArticleCardProps> = ({ paper }) => {
    const [expandAuthors, setExpandAuthors] = useState(false)
    const [expandAbstract, setExpandAbstract] = useState(false);
    const [expandAffiliation, setExpandAffiliation] = useState(false);

  return (
    <Card sx={{ margin: 2 }}>
        <CardHeader
        title={paper.title}
        subheader={`Published in ${paper.journal} on ${new Date(
          paper.pubdate
        ).toLocaleDateString()}`}
      />
      <CardContent>
      <Typography variant="body2" color="text.secondary" gutterBottom>
          PMID: {paper.PMID}
        </Typography>
        {/* Authors */}
        <Box>
            <Collapse in={expandAuthors} timeout="auto" unmountOnExit>
                <Typography variant="body2" color="text.secondary">
                Authors: {paper.authors.join(", ")}
                </Typography>
            </Collapse>
            {!expandAuthors && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                    >
                    Authors: {paper.authors.length > 5
                        ? `${paper.authors.slice(0, 5).join(", ")}...`
                        : paper.authors.join(", ")}
                </Typography>
            )}
            {paper.authors.length > 5 && (
            <Button
                size="small"
                endIcon={<ExpandMoreIcon />}
                onClick={() => setExpandAuthors(!expandAuthors)}>
                {expandAuthors ? "Show Less" : "Show More"}
            </Button>
            )}

        </Box>
         {/* Abstract Section */}
         {paper.abstract.length > 0 && (
         <Box>
            <Typography variant="subtitle2" gutterBottom>
            Abstract:
            </Typography>
            <Collapse in={expandAbstract} timeout="auto" unmountOnExit>
            <Typography variant="body2" color="text.secondary">
                {paper.abstract}
            </Typography>
            </Collapse>
            {!expandAbstract && (
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
            >
                {paper.abstract.slice(0, 100)}...
            </Typography>
            )}
            <Button
            size="small"
            endIcon={<ExpandMoreIcon />}
            onClick={() => setExpandAbstract(!expandAbstract)}
            >
            {expandAbstract ? "Show Less" : "Show More"}
            </Button>
        </Box>)}

        <Box sx={{ marginTop: 2 }}>
          <Link href={paper.url} passHref target="_blank">
            Read More
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};


export default InvestigatorArticleCard;
