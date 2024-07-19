import { useRouter } from 'next/navigation'  // Usage: App router
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';


const BackButton = () => {
  const router = useRouter()

  return (
    <div>
        <IconButton onClick={() => router.back()}>
            <ArrowBackIcon />
        </IconButton>
    </div>

  )
}

export default BackButton