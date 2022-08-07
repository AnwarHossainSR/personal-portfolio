import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading : false,
  error : '',
  message : '',
};

export const portfolioSlice = createSlice({
  name : 'portfolios',
  initialState,
  reducers : {
    portfolioPending : (state) => { state.isLoading = true;},
    portfolioSuccess : (state, {payload}) => {
      state.error = '';
      state.isLoading = false;
      state.message = payload;
    },
    portfolioFailure : (state, {payload}) => {
      state.isLoading = false;
      state.error = payload;
      state.message = '';
    },
    clearPortfolio : (state) => {
      state.error = '';
      state.isLoading = false;
      state.message = '';
    },
  },
});

const {reducer, actions} = portfolioSlice;
export const {
  portfolioPending,
  portfolioSuccess,
  portfolioFailure,
  clearPortfolio,
} = actions;

export default reducer;
