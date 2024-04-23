'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useReducer } from 'react';

// Define types
interface State {
  darkMode: boolean;
}

interface Action {
  type: string;
}

interface ContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
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
export const ThemeContext = createContext<ContextType | undefined>(undefined);

// Custom hook to consume the context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Memoize the context value
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
