import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading : false,
  error : '',
  user : {},
  unAuthenticated : false,
};

export const userSlice = createSlice({
  name : 'users',
  initialState,
  reducers : {
    userPending : (state) => { state.isLoading = true;},
    userSuccess : (state, {payload}) => {
      state.isLoading = false;
      state.user = payload;
      state.unAuthenticated = false;
    },
    userFailure : (state) => {
      state.isLoading = false;
      state.user = {};
      state.unAuthenticated = true;
    },
    clearuser : (state) => {
      state.isLoading = false;
      state.user = {};
    },
  },
});

const {reducer, actions} = userSlice;
export const {userPending, userSuccess, userFailure, clearuser} = actions;

export default reducer;
