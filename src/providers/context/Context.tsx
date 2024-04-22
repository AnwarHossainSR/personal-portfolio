"use client";

import React, { Dispatch, ReactNode, createContext, useReducer } from 'react';

// Define types
interface State {
  darkMode: boolean;
}

interface Action {
  type: string;
}

interface ContextType {
  state: State;
  dispatch: Dispatch<Action>;
}

// Initial state
const initialState: State = { darkMode: true };

// Reducer function
const themeReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'toggle':
      return { darkMode: !state.darkMode };
    default:
      return state;
  }
};

// Create context
export const themeContext = createContext<ContextType>({
  state: initialState,
  dispatch: () => null,
});

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  return (
    <themeContext.Provider value={{ state, dispatch }}>
      {children}
    </themeContext.Provider>
  );
};
