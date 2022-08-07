import {configureStore} from "@reduxjs/toolkit";

import PortfolioReducer from "./reducers/PortfolioSlice";
import UserReducer from "./reducers/UserSLice";

export default configureStore({
  reducer : {
    users : UserReducer,
    portfolios : PortfolioReducer,
  },
});
