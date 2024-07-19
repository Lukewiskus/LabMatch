// pages/author/[id].js

import BackButton from '@/components/backButton';
import CenterBox from '@/components/centerBox';
import Box from '@mui/material/Box';
import React, { useState, useEffect } from 'react';
import styles from "@/styles/authorPage.module.css";
import FlexBox from '@/components/flexBox';
import { CircularProgress, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import ArticleTable from '@/components/articleTable';
import AuthorInfo from '@/components/authorInfo';


//Meaning of state
// 0 = Not yet submited
// 1 = Submited author is in database, do not procceed
// 2 = Submited Author is not in database, now checking pubmed
// 3 = Author not in pubmed, must show that to user so they can restart to 0
// 4 = Author is in Pubmed, show them their top 5 articles, if they cancel it goes to 0
// 5 = Is the correct author, submit their name for proccessing

const SubmitAuthorPage = ({isDrawerOpen}) => {
    const [firstName, setFirstName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [lastName, setLastName] = useState('');
    const [submitionState, setSubmitionState] = useState(0)
    const [isInputDisabled, setIsInputDisabled] = useState(false)
    const [articleArray, setArticleArray] = useState([])
    const [loading, setLoading] = useState(true);
    const [queueId, setQueueId] = useState("");
    const [step, setStep] = useState(0)
    const [author, setAuthor] = useState({});
    const [intervalId, setIntervalId] = useState(-1)
    function getAuthorName() {
        return middleInitial === "" ? `${firstName.trim()} ${lastName.trim()}` : `${firstName.trim()} ${middleInitial.trim()} ${lastName.trim()}`;
    }

    const fetchAuthorData = async (id) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get_author_from_queue_id?queue_id=${encodeURIComponent(id)}`);
        const data = await response.json();
        return data;
      };

    async function PollStep(queueIdToCheck) {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get_queue_step?queue_id=${encodeURIComponent(queueIdToCheck)}`).then((response) => response.json())
        .then(data => {
            console.log(data)
            setStep(data["step"])

           if(step == 7) {
               setSubmitionState(6)
           }
       })
       .catch((error) => {
       console.error('Error fetching data:', error);
       });
    }

    useEffect(() => {
        if(submitionState == 2) {
            CheckPubMed(getAuthorName())
        }
        if(submitionState == 3) {
            setFirstName("")
            setMiddleInitial("")
            setLastName("")
        }
        if(submitionState == 5 && step == 0){
            handleStartCollectingAuthorData()
        }
        if(submitionState != 5 && intervalId != -1) {
            return () => {
                clearInterval(intervalId);
                setIntervalId(-1)
              };
        }


        if(step == 7) {
            console.log(queueId)
            fetchAuthorData(queueId)
                .then((data) => {
                    console.log(data)
                    setAuthor(data);
                })
                .catch((error) => {
                    console.error('Error fetching author data:', error);
                });
            clearInterval(intervalId)
            setIntervalId(-1)
            setSubmitionState(6)
  
        }

        if(step == -1) {
            setLoading(false)
            clearInterval(intervalId)
            setIntervalId(-1)
        }
        if(step == -2) {
            clearInterval(intervalId)
            setIntervalId(-1)
            setLoading(false)
        }
    }, [submitionState, step])


    async function handleStartCollectingAuthorData() {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/put_author_name_into_queue?authorName=${encodeURIComponent(getAuthorName())}`)
        .then((response) => response.json())
         .then(data => {
            setQueueId(data["author_queue_id"])
            const id = setInterval(() => {
                PollStep(data["author_queue_id"]);
            }, 3000);
            setIntervalId(id)
         })
        .catch((error) => {
            console.error('Error Inserting author into queue:', error);
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(isInputDisabled) {
            return
        }

        setSubmitionState(0)
        setIsInputDisabled(true)
        setLoading(true)

        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/is-author-in-db?authorName=${encodeURIComponent(getAuthorName())}`)
            .then((response) => response.json())
             .then(data => {
                const isAuthorInDb = data["isAuthorInDb"]
                if(isAuthorInDb) {
                    setSubmitionState(1)
                    setLoading(false)
                    setIsInputDisabled(false)
                } else {
                    setSubmitionState(2)
                }
            })
            .catch((error) => {
            console.error('Error fetching data:', error);
            });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && getAuthorName() != "") {
          handleSubmit(event);
        }
      };

    async function CheckPubMed() {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/is-author-in-pubmed?authorName=${encodeURIComponent(getAuthorName())}`)
        .then((response) => response.json())
         .then(data => {
            const isAuthorInPubmed = data["isAuthorInPubmed"]
            setArticleArray(data["articleObjects"])
            if(isAuthorInPubmed) {
                setSubmitionState(4)
            } else {
                setSubmitionState(3)
                setIsInputDisabled(false)
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }

    function handleCancel() {
        setFirstName("")
        setMiddleInitial("")
        setLastName("")
        setArticleArray()
        setIsInputDisabled(false)
        setSubmitionState(0)
        setStep(0)
    }


  return (
    <div style={{padding: "16px"}}>
        <BackButton />
    <div style={{width: "75%", margin: "0 auto"}}>
        <CenterBox>
            <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '16px' }}>
            Enter the name of a Principal Investigator not currently in our database, and we will search PubMed to collect relevant information on them.
            </Typography>
            <FlexBox>
                <form onSubmit={handleSubmit} className={styles.searchForm}>
                    <FlexBox flex_gap='32px' sx={{marginBottom: "16px"}}>
                        <Typography sx={{width: "100px"}}>First Name*</Typography>
                        <input
                            type="text"
                            disabled={isInputDisabled}
                            value={firstName}
                            onChange={(event) => {setFirstName(event.target.value);}} 
                            placeholder="First Name..."
                            className={styles.searchInput}
                            required
                        />
                    </FlexBox>
                    <FlexBox flex_gap='32px' sx={{marginBottom: "16px"}}>
                        <Typography sx={{width: "100px"}}>Middle Initial*</Typography>
                        <input
                            type="text"
                            disabled={isInputDisabled}
                            value={middleInitial}
                            onChange={(event) => {setMiddleInitial(event.target.value);}} 
                            placeholder="Middle Initial..."
                            className={styles.searchInput}
                            
                        />
                    </FlexBox>
                    <FlexBox flex_gap='32px' sx={{marginBottom: "16px"}}>
                        <Typography sx={{width: "100px"}}>Last Name*</Typography>
                        <input
                            type="text"
                            disabled={isInputDisabled}
                            value={lastName}
                            onChange={(event) => {setLastName(event.target.value);}}
                            onKeyPress={handleKeyPress}
                            placeholder="Last Name..."
                            className={styles.searchInput}
                            required
                        />
                    </FlexBox>
                    <CenterBox>
                        <Button disabled={isInputDisabled} variant='contained' type='submit'>Submit</Button>
                    </CenterBox>
                </form>
            </FlexBox>

            {submitionState == 1 ? <p>Author is already in database, please try searching for another author</p> :
             submitionState == 2 ? 
             <>
                <CenterBox><p> Author not in our database, checking now to see if they are in Pubmed</p></CenterBox> 
                {loading ? <FlexBox>
                    <CircularProgress />
                    </FlexBox> : 
                    <></>}
             </> :
             submitionState == 3 ? <CenterBox><p>Author not found in PubMed database, please enter a new author name</p></CenterBox> :
             submitionState == 4 ? <div>
                <CenterBox>
                    <p>Author found on pubmed. Here are their 5 most recent articles. If this is the person you want to colelct data on, press continue, else cancel</p>
                    <FlexBox>
                    <Button onClick={() => {
                            setSubmitionState(5)
                            }
                        }
                    variant="contained">Continue</Button>
                    <Button onClick={() => {handleCancel()}}>Cancel</Button>
                    </FlexBox>
                    <ArticleTable articleArray={articleArray} />
                </CenterBox>
             </div> :
             submitionState == 5 ? 
                <> 
                    <CenterBox>
                        {loading ? <>
                            <CenterBox>
                                <CircularProgress />
                            </CenterBox></> : <></>}

                    {step == 0 ? <p>PI in queue to be proccesed</p> :
                        step == 1 ? <p>Collecting research articles pubmed IDs</p> :
                        step == 2 ? <p>Collecting PI details </p> :
                        step == 3 ? <p>collecting article information</p> :
                        step == 4 ? <p>Collecting citation details of all PI articles</p> :
                        step == 5 ? <p>Calculating H-index</p> :
                        step == 6 ? <p>Marking as complete</p> :
                        step == 7 ? <p>Collected all author data</p> :
                        step == -1 ? 
                        <>
                            <p>Error proccessing request. Try again later</p>
                            <CenterBox>
                                <Button variant="contained" onClick={() => {handleCancel()}}>Try Again</Button>
                            </CenterBox>
                        </> :
                        step == -2 ? 
                        <>
                            <p>Author already in database</p>
                            <CenterBox>
                                <Button variant="contained" onClick={() => {handleCancel()}}>Try Again</Button>
                            </CenterBox>
                        </> : <></>}
                    
                    </CenterBox></> :
             submitionState == 6 ? <>
             <div style={{padding: "16px"}}>
                <div style={{width: "75%", margin: "0 auto"}}>
                    <AuthorInfo author={author} /> 
                </div>
            </div></> : <></> }
            
        </CenterBox>

        
    </div>
</div>
  );
};

export default SubmitAuthorPage;
