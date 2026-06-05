

import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider,FacebookAuthProvider}from "firebase/auth";
import {getFirestore} from "firebase/firestore";



const firebaseConfig = {

  apiKey: "AIzaSyCpieghBf5_7kqiSO61jQrPjVsZ3hR9myU",

  authDomain: "equiskill-discussion.firebaseapp.com",

  projectId: "equiskill-discussion",

  storageBucket: "equiskill-discussion.firebasestorage.app",

  messagingSenderId: "910325982652",

  appId: "1:910325982652:web:bd28d263bf5f97650cf7b9"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const storage = getFirestore(app);