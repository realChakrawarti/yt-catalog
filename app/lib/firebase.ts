// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHQP0QYmhy_w7DGj3iYtJVNDRfVN1PRTs",
  authDomain: "yt-chan-2570d.firebaseapp.com",
  projectId: "yt-chan-2570d",
  storageBucket: "yt-chan-2570d.appspot.com",
  messagingSenderId: "1036814779185",
  appId: "1:1036814779185:web:d233d1c6da4b585232a610",
  measurementId: "G-BLCKH815MM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

// Initialize Firestore
const db = getFirestore(app)
// const analytics = getAnalytics(app);

import localFirebase from "../../firebase.json"

const authPort = localFirebase.emulators.auth.port
const firestorePort = localFirebase.emulators.firestore.port

if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, `http://127.0.0.1:${authPort}`);
  connectFirestoreEmulator(db, '127.0.0.1', firestorePort);
}

export {app, auth, db}