// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "luxuriousestate-3dfb7.firebaseapp.com",
  projectId: "luxuriousestate-3dfb7",
  storageBucket: "luxuriousestate-3dfb7.firebasestorage.app",
  messagingSenderId: "735601614878",
  appId: "1:735601614878:web:c016401aeb82de48fd8e0f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
