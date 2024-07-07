// pages/author/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Example API function to fetch author data
const fetchAuthorData = async (id) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/author?id=${encodeURIComponent(id)}`);
  const data = await response.json();
  return data;
};

const AuthorPage = () => {
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
    return <p>Loading...</p>;
  }

  if (!author) {
    return <p>No author found</p>;
  }

  return (
    <div>
      <h1>{author.name}</h1>
      <p>HIndex: {author.hindex}</p>
    </div>
  );
};

export default AuthorPage;
