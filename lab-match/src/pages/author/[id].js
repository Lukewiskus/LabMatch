// pages/author/[id].js

import BackButton from '@/components/backButton';
import CenterBox from '@/components/centerBox';
import FlexBox from '@/components/flexBox';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircleProgress from '@/components/circleProgress';
import AuthorInfo from '@/components/authorInfo';

// Example API function to fetch author data
const fetchAuthorData = async (id) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/author?id=${encodeURIComponent(id)}`);
  const data = await response.json();
  return data;
};

const AuthorPage = ({isDrawerOpen}) => {
  const router = useRouter();
  const { id } = router.query;
  const [author, setAuthor] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        fetchAuthorData(id)
        .then((data) => {
            console.log(data)
          setAuthor(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching author data:', error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <CircleProgress />
    );
  }

  if (!author) {
    return <p>No author found</p>;
  }

  return (
    <div style={{width: "100%", padding: "16px"}}>
        <div  style={{width: "50%", margin: "0 auto"}}>
          <BackButton />
          <FlexBox />
        </div>
        <AuthorInfo author={author} />
    </div>
  );
};

export default AuthorPage;
