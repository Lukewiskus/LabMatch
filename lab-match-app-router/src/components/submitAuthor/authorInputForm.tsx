"use client"
import { Button, Typography } from "@mui/material";
import FlexBox from "../flexBox";
import { useState } from "react";
import "@/styles/submitAuthor.scss"
import { useSubmitAuthorContext } from "@/context/SubmitAuthorContext";
import { PaperData } from "@/interfaces/PaperData";
interface AuthorInputProps {

}
  
export const AuthorInputForm: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [lastName, setLastName] = useState('');
    const [isInputDisabled, setIsInputDisabled] = useState(false)

    const { state, dispatch } = useSubmitAuthorContext();


    const handleSubmit = async (event : any) => {
        event.preventDefault();
        dispatch({ type: 'isAuthorSubmited', payload: { isAuthorSubmited: true } });
        dispatch({ type: 'isLoading', payload: { isLoading: true } });
        
        await fetch(`api/get/topFiveArticles?firstName=${firstName}&middleInitial=${middleInitial}&lastName=${lastName}`)
            .then((res) => res.json()) // Parse the JSON response
            .then((data : any) => {

                if(data.authorAlreadyInDb) {
                    dispatch({ type: 'isLoading', payload: { isLoading: false } });
                    dispatch({type: "validationStep", payload : {validationStep: 6}});
                    return
                }

                if(data.articles.length == 0) {
                    dispatch({ type: 'isLoading', payload: { isLoading: false } });
                    dispatch({type: "validationStep", payload : {validationStep: 5}});
                    return
                }
                dispatch({type: "authorName", payload: {authorName: `${firstName} ${middleInitial} ${lastName}`}})
                dispatch({ type: 'isLoading', payload: { isLoading: false } });
                dispatch({type: "validationStep", payload : {validationStep: 1}});
                dispatch({ type: 'topFiveArticles', payload: { topFiveArticles: data.articles } });
            })
            .catch((error) => {
                console.error('Error fetching top five articles:', error);
                dispatch({type: "validationStep", payload : {validationStep: 0}});
                dispatch({ type: 'isLoading', payload: { isLoading: false } });
            });
    }

    const handleKeyPress = (event : any) => {
        if (event.key === 'Enter') {
          handleSubmit(event);
        }
      };

    
    function resetForm() {
        dispatch({ type: 'isLoading', payload: { isLoading: false } });
        dispatch({type: "validationStep", payload : {validationStep: 0}})
        localStorage.setItem("isCollectingData", "false")
        localStorage.setItem("authorName", "")
        dispatch({type: "isAuthorSubmited", payload : {isAuthorSubmited: false}})
        dispatch({type: "authorName", payload: {authorName: ""}})
        setFirstName("")
        setMiddleInitial("")
        setLastName("")
    }

    return (
        <div className="submit-author-wrapper">
            <form className="author-input-form" onSubmit={handleSubmit}>
                <FlexBox flex_gap='32px' sx={{marginBottom: "16px"}}>
                    <Typography sx={{width: "100px"}}>First Name*</Typography>
                    <input
                        type="text"
                        disabled={state.isAuthorSubmited}
                        value={firstName}
                        onChange={(event) => {setFirstName(event.target.value);}} 
                        placeholder="First Name..."
                        required
                    />
                </FlexBox>
                <FlexBox flex_gap='32px' sx={{marginBottom: "16px"}}>
                    <Typography sx={{width: "100px"}}>Middle Initial*</Typography>
                    <input
                        type="text"
                        disabled={state.isAuthorSubmited}
                        value={middleInitial}
                        onChange={(event) => {setMiddleInitial(event.target.value);}} 
                        placeholder="Middle Initial..."
                        
                    />
                </FlexBox>
                <FlexBox flex_gap='32px' sx={{marginBottom: "16px"}}>
                    <Typography sx={{width: "100px"}}>Last Name*</Typography>
                    <input
                        type="text"
                        disabled={state.isAuthorSubmited}
                        value={lastName}
                        onChange={(event) => {setLastName(event.target.value);}}
                        onKeyPress={handleKeyPress}
                        placeholder="Last Name..."
                        required
                    />
                </FlexBox>
                <FlexBox>
                {state.isAuthorSubmited && (state.validationStep < 2 || (state.validationStep === 5 || state.validationStep === 6)) ? (
                    <Button onClick={resetForm}>Reset</Button>
                ) : (
                !state.isAuthorSubmited && (
                    <Button disabled={state.isAuthorSubmited} variant="contained" type="submit">
                    Submit
                    </Button>
                )
                )}
                
                </FlexBox>
            </form>
            {process.env.NODE_ENV === "development" ? <><Button onClick={resetForm}>Reset</Button>
            </> : <></>}
        </div>
    )
  }