import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDanuYeLmsqidVTn9KnhnrwNeTjRSLRqts",
  authDomain: "pharmacare-f5000.firebaseapp.com",
  projectId: "pharmacare-f5000",
  storageBucket: "pharmacare-f5000.appspot.com",
  messagingSenderId: "287280950015",
  appId: "1:287280950015:web:d309c705ff0c9b5d9bfaca",
  measurementId: "G-9JWE7X09KF"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
