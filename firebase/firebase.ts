import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyB6nD-dm4EMk6Cp66k-jc9kL4T4IpPzGpY",
  authDomain: "codelingo-6fd2a.firebaseapp.com",
  databaseURL: "https://codelingo-6fd2a-default-rtdb.firebaseio.com",
  projectId: "codelingo-6fd2a",
  storageBucket: "codelingo-6fd2a.appspot.com",
  messagingSenderId: "254055727132",
  appId: "1:254055727132:web:a436d89c5920a7dddbdfd9",
  measurementId: "G-KGS18XXNRM"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
