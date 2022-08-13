import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, db } from '../../utils/firebase';
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

export const GetCountVisitors = () => async (dispatch) => {
  const count = sessionStorage.getItem('count');
  if (count) return;

  if (navigator.geolocation) {
    console.log('🚀 ~ file: UserAction.js ~ line 69 ~ GetCountVisitors');
    navigator.geolocation.getCurrentPosition(async (position) => {
      sessionStorage.setItem('count', 1);
      const { latitude, longitude } = position.coords;
      const visitor = {
        latitude,
        longitude,
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, 'visitors'), visitor);
    });
  } else {
    console.log('Geolocation is not supported by this browser.');
    sessionStorage.setItem('count', 1);
    const visitor = {
      latitude: 0,
      longitude: 0,
      timestamp: serverTimestamp(),
    };
    await addDoc(collection(db, 'visitors'), visitor);
  }
};
