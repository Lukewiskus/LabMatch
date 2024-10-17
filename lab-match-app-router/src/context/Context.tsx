"use client"; // Ensure this is present at the top

import { SearchAuthorResults } from '@/interfaces/searchAuthorResults';
import { createContext, useContext, ReactNode, useReducer } from 'react';

export interface State {
  isLoading: boolean;
  searchAuthorResults: SearchAuthorResults[]
}

export const initialState: State = {
  isLoading: false,
  searchAuthorResults: []
};

export type Action = { type: 'LOADING'; payload: { isLoading: boolean } }
                      | {type: 'SET-SEARCH-AUTHORS'; payload: { searchResults : SearchAuthorResults[]}};

export const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
      case 'SET-SEARCH-AUTHORS':
        return {
          ...state,
          searchAuthorResults: action.payload.searchResults,
        };
    default:
      return state;
  }
};

interface StateProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const Context = createContext<StateProps | undefined>(undefined);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
};
