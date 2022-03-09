import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCeuA29BBKkt4Jwizz8oGHbbM46cmfINxg",
  authDomain: "whatsappclone-1efe2.firebaseapp.com",
  projectId: "whatsappclone-1efe2",
  storageBucket: "whatsappclone-1efe2.appspot.com",
  messagingSenderId: "284423695304",
  appId: "1:284423695304:web:a6e23bb1dbe2d7cbda6efd",
};

// appId: Constants.manifest?.extra?.appId
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const firestoreDB = getFirestore();

const firebaseStorage = getStorage();

export { auth, app, firestoreDB, firebaseStorage };
