import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading : false,
  error : '',
  user : {},
};

export const userSlice = createSlice({
  name : 'users',
  initialState,
  reducers : {
    userPending : (state) => { state.isLoading = true;},
    userSuccess : (state, {payload}) => { state.isLoading = false;},
    userFailure : (state, {payload}) => { state.isLoading = false;},
    clearuser : (state) => {
      state.users = [];
      state.unitCost = 0;
    },
  },
});

const {reducer, actions} = userSlice;
export const {userPending, userSuccess, userFailure, clearuser} = actions;

export default reducer;
