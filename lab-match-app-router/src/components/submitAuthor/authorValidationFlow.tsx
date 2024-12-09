"use client"
import { useSubmitAuthorContext } from "@/context/SubmitAuthorContext";
import FlexBox from "../flexBox"
import CircleProgress from "../circleProgress";
import '@/styles/authorValidationFlow.scss'
import InvestigatorArticleGrid from "./InvestigatorArticleGrid";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";


const VALIDATION_STEPS = {
    NONE: 0,
    SHOW_ARTICLES: 1,
    COLLECTING_DATA: 2,
    AUTHOR_ALREADY_IN_DB : 3,
    NO_ARTICLES: 4,
    COMPLETED: 5,
  };

export const AuthorValidationFlow: React.FC = () => {

    const { state, dispatch } = useSubmitAuthorContext();
    const [isPolling, setIsPolling] = useState(false); // Track whether polling is active
    const [queueId, setQueueId] = useState(0)

    const setValidationStep = (step: number) => dispatch({type: "validationStep", payload : {validationStep: step}})
    const setCollectionStep = (step: number) => dispatch({type: "collectionStep", payload : {collectionStep: step}})

    function setQueueIdLocal(queueId: number) {
        localStorage.setItem("queueId", queueId.toString())
        setQueueId(queueId)
    }

    function removeQueueIdLocal() {
        localStorage.removeItem("queueId")
        setQueueId(0)
    }

    async function HandleCollectInformation() {
        setValidationStep(VALIDATION_STEPS.COLLECTING_DATA)
        localStorage.setItem("isCollectingData", "true")
        localStorage.setItem("authorName", state.authorName)
        const response = await fetch('/api/post/authorNameToQueue', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: state.authorName}),
          })

          if (!response.ok) {
            throw new Error('Failed to add to queue');
          }
      
          const result = await response.json();
          console.log(result)
          setQueueIdLocal(result.queue_id)

    }

    useEffect(() => {
        console.log()
        if(localStorage.getItem("isCollectingData") && localStorage.getItem("authorName")){
            dispatch({type: "isAuthorSubmited", payload : {isAuthorSubmited: true}})
            dispatch({type: "authorName", payload: {authorName: localStorage.getItem("authorName") ?? ""}})
            setValidationStep(VALIDATION_STEPS.COLLECTING_DATA)
        }

        const queueId = localStorage.getItem("queueId")
        if(queueId) {
            startPolling()
            setValidationStep(VALIDATION_STEPS.COLLECTING_DATA)
            setQueueId(parseInt(queueId))
        }
    }, [])

    useEffect(() => {
        let interval: any;
    
        if (isPolling) {
          const fetchData = async () => {
            const response = await fetch(`/api/get/authorCollectionStep?queueId=${queueId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              if (!response.ok) throw new Error('Failed to fetch data');
              const result = await response.json();
              setCollectionStep(result.step);
          };
    
          // Initial fetch
          fetchData();
    
          // Start polling
          interval = setInterval(fetchData, 5000);
        }
    
        // Cleanup interval on component unmount or when polling stops
        return () => clearInterval(interval);
      }, [queueId]);

    useEffect(() => {
        console.log(state.validationStep)
        if(state.validationStep == VALIDATION_STEPS.COLLECTING_DATA) {
            startPolling()

        }
        if(state.validationStep == VALIDATION_STEPS.COMPLETED) {
            stopPolling()
            removeQueueIdLocal()
        }
    }, [state.validationStep])


    useEffect(() => {
        if(state.collectionStep == VALIDATION_STEPS.COMPLETED) {
            removeQueueIdLocal()
            stopPolling()            
        }
    }, [state.collectionStep])

    const startPolling = () => {
        setIsPolling(true); // Start polling
    };

    const stopPolling = () => {
        setIsPolling(false); // Stop polling
    };
    
    function resetForm() {
        dispatch({ type: 'isLoading', payload: { isLoading: false } });
        dispatch({type: "validationStep", payload : {validationStep: 0}})
        localStorage.setItem("isCollectingData", "false")
        localStorage.setItem("authorName", "")
        dispatch({type: "isAuthorSubmited", payload : {isAuthorSubmited: false}})
        dispatch({type: "authorName", payload: {authorName: ""}})
    }


    return (
        <div className="author-validation-flow-container">
            <FlexBox>
                {state.isAuthorSubmited ? 
                <div>
                    {state.isLoading ? <CircleProgress /> : 
                        <div className="author-validation-flow-results-wrapper">
                            {state.validationStep === VALIDATION_STEPS.SHOW_ARTICLES ? 
                            <>
                            <FlexBox>
                                <Typography>Do the papers under this author look correct? if so then click continue</Typography>
                            </FlexBox>
                            <FlexBox>
                                <Button variant='contained' onClick={() =>  HandleCollectInformation()}>Continue</Button>
                            </FlexBox>
                            <InvestigatorArticleGrid papers={state.topFiveArticles} />
                                
                            </> : 
                             state.validationStep == VALIDATION_STEPS.COLLECTING_DATA ? 
                             <>
                                {
                                    state.collectionStep !== 7 && (
                                        <FlexBox>
                                            <Typography>We are now collecting {state.authorName}'s information</Typography> 
                                        </FlexBox>
                                    )
                                }
                                
                                <FlexBox>
                                    {state.collectionStep !== 7 ? <>
                                    <CircleProgress /></> : <></>}
                                </FlexBox>
                                <FlexBox>
                                {state.collectionStep == 1 || state.collectionStep == 0 ? <>Collecting</> : 
                                state.collectionStep == 2 ? <>Collecting Goolge Scholar Info</> : 
                                state.collectionStep == 3 ? <>Collecting Articles</> :
                                state.collectionStep == 4 ? <>Collecting all citations of their work</> :
                                state.collectionStep == 5 ? <>Calculating H-Index</> :
                                state.collectionStep == 6 || state.collectionStep == 7 ? <>
                                <Box>
                                    <Typography>Completed!</Typography>
                                    <FlexBox>
                                        <Button onClick={resetForm} variant="contained">Reset</Button>
                                    </FlexBox>
                                </Box>
                               </> :<></>}
                                </FlexBox>
                                
                             </>
                             :
                             state.validationStep == VALIDATION_STEPS.NO_ARTICLES ? <>No Artciles</> : 
                             state.validationStep == VALIDATION_STEPS.AUTHOR_ALREADY_IN_DB ? <>PI already in our database</> : <></>}
                        </div>
                    }
                </div> : <></>
                }
            </FlexBox>
        </div>
    )
}