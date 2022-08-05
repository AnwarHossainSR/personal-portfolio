import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../utils/firebase";
import { userFailure, userPending, userSuccess } from "../reducers/UserSLice";

export const getAuthUserAction = () => async (dispatch) => {
  dispatch(userPending());
  try {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          userSuccess({
            accessToken: user.accessToken,
            email: user.email,
            id: user.uid,
          })
        );
      } else {
        dispatch(userFailure());
      }
    });
  } catch (error) {
    // dispatch(platformFailure(error));
  }
};
