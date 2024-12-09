"use client";
import { PaperData } from '@/interfaces/PaperData';
import { createContext, useContext, ReactNode, useReducer } from 'react';

export interface SubmitAuthorState {
    isAuthorSubmited: boolean;
    isLoading: boolean;
    validationStep: number;
    collectionStep: number;
    topFiveArticles: PaperData[];
    authorName: string
  }
  
  export const initialState: SubmitAuthorState = {
    isAuthorSubmited: false,
    isLoading: false,
    validationStep: 0,
    collectionStep: 0,
    topFiveArticles: [],
    authorName: ''
  };
  
  export type SubmitAuthorAction = { type: 'isAuthorSubmited'; payload: { isAuthorSubmited: boolean }}
                                    | { type: 'isLoading'; payload: { isLoading: boolean}}
                                    | { type: 'topFiveArticles'; payload: { topFiveArticles: PaperData[]}}
                                    | { type: 'validationStep'; payload: { validationStep: number }}
                                    | { type: 'authorName'; payload: { authorName: string }}
                                    | { type: 'collectionStep'; payload: { collectionStep: number }}

  export const stateReducer = (state: SubmitAuthorState, action: SubmitAuthorAction): SubmitAuthorState => {
    switch (action.type) {
      case 'validationStep':
        return {
            ...state,
            validationStep: action.payload.validationStep,
        };
        case 'collectionStep':
          return {
              ...state,
              collectionStep: action.payload.collectionStep,
          };
        case 'topFiveArticles':
            return {
                ...state,
                topFiveArticles: action.payload.topFiveArticles,
            };
        case 'isAuthorSubmited':
            return {
                ...state,
                isAuthorSubmited: action.payload.isAuthorSubmited,
            };
        case 'authorName':
          return {
              ...state,
              authorName: action.payload.authorName,
          };
        case 'isLoading':
            return {
                ...state,
                isLoading: action.payload.isLoading,
            };
        default:
            return state;
    }
  };
  
  interface StateProps {
    state: SubmitAuthorState;
    dispatch: React.Dispatch<SubmitAuthorAction>;
  }
  
  const Context = createContext<StateProps | undefined>(undefined);
  
  export const SubmitAuthorContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(stateReducer, initialState);
    return (
      <Context.Provider value={{ state, dispatch }}>
        {children}
      </Context.Provider>
    );
  };
  
  export const useSubmitAuthorContext = () => {
    const context = useContext(Context);
    if (!context) {
      throw new Error('useStateContext must be used within a StateProvider');
    }
    return context;
  };
  