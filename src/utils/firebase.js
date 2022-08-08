// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey : `${process.env.REACT_APP_API_KEY}`,
  authDomain : `${process.env.REACT_APP_AUTH_DOMAIN}`,
  projectId : `${process.env.REACT_APP_PROJECTID}`,
  storageBucket : `${process.env.REACT_APP_STORAGEBUCKET}`,
  messagingSenderId : `${process.env.REACT_APP_MESSAGINGSENDERID}`,
  appId : `${process.env.REACT_APP_APPID}`,
  measurementId : `${process.env.REACT_APP_MEASUREMENTID}`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();
const storage = getStorage();
const auth = getAuth();

export default app;
export {db, storage, auth};
