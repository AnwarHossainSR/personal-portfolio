import { configureStore } from "@reduxjs/toolkit";

import UserReducer from "./reducers/UserSLice";
import PortfolioReducer from "./reducers/PortfolioSlice";

export default configureStore({
  reducer: {
    users: UserReducer,
    portfolios: PortfolioReducer,
  },
});
