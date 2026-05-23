// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCE_boz8Q63kkWPgVg-155BrNijCvy7DBk",
  authDomain: "xinchill.firebaseapp.com",
  projectId: "xinchill",
  storageBucket: "xinchill.firebasestorage.app",
  messagingSenderId: "345636722025",
  appId: "1:345636722025:web:56be58baf1ed2f9d0c59f8",
  measurementId: "G-WC8FLDZLY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export { db, auth };
