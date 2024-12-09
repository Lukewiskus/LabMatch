import FlexBox from '@/components/flexBox';
import CircleProgress from '@/components/circleProgress';
import AuthorInfo from '@/components/author/authorInfo';
import { notFound } from 'next/navigation';


const fetchAuthorData = async (id: string) => {
    const response = await fetch(`${process.env.URL}/api/get/author?id=${encodeURIComponent(id)}`)
  
    if (!response.ok) {
      return null; // Handle API errors gracefully
    }
  
    return response.json();
  };
  
const AuthorPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  console.log(id)

  const author = await fetchAuthorData(id);

  if (!author) {
    notFound(); // Display a 404 page if the author isn't found
  }

  return (
    <div style={{ width: '100%', padding: '16px', marginTop: "100px" }}>
      <AuthorInfo author={author} />
    </div>
  );
};

export default AuthorPage;
