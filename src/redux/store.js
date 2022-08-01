import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './reducers/UserSLice';

export default configureStore({
  reducer: {
    users: UserReducer,
  },
});
