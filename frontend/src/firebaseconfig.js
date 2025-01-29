// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebase from "firebase/app"
// import "firebase/storage"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCysmKWrtZe1gcdUzXZZGQbltiGu_XgtDs",
  authDomain: "trove-26.firebaseapp.com",
  projectId: "trove-26",
  storageBucket: "trove-26.appspot.com",
  messagingSenderId: "680433276857",
  appId: "1:680433276857:web:303dfd0756eacf6ce8c868",
  measurementId: "G-NKVBFYW7V8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage =getStorage(app);
//get firebase
export { app, auth, db, storage };
// export { auth, db, storage };

