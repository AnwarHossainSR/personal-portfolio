// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: 'AIzaSyAUrCKrd6jIjamIXeSNRXB8sFLKbnqb4D0',
  authDomain: 'portfolio-2022-d139c.firebaseapp.com',
  projectId: 'portfolio-2022-d139c',
  storageBucket: 'portfolio-2022-d139c.appspot.com',
  messagingSenderId: '403349444740',
  appId: '1:403349444740:web:2f1caa4557b3fcf0140ad1',
  measurementId: 'G-37ZMG3S1B1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
