import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../utils/firebase';
import {
  clearUser,
  userFailure,
  userPending,
  userSuccess,
} from '../reducers/UserSLice';

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
    dispatch(userFailure());
  }
};

export const GetSignInAction = (email, password) => async (dispatch) => {
  dispatch(userPending());
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    dispatch(
      userSuccess({
        accessToken: userCredential.user.accessToken,
        email: userCredential.user.email,
        id: userCredential.user.uid,
      })
    );
  } catch (error) {
    console.log(
      '🚀 ~ file: UserAction.js ~ line 43 ~ GetSignInAction ~ error',
      error
    );
    dispatch(userFailure('Invalid email or password'));
  }
};

export const GetLogoutAction = () => async (dispatch) => {
  dispatch(userPending());
  try {
    signOut(auth);
    localStorage.clear();
    dispatch(clearUser());
  } catch (error) {
    console.log(
      '🚀 ~ file: UserAction.js ~ line 55 ~ GetLogoutAction ~ error',
      error
    );
    dispatch(userFailure(error.message));
  }
};
