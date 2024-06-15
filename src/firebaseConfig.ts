// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbX-oKjihF9yGRw8gXTLlYEg37SQSF7jM",
  authDomain: "newwhatsapp-e45ab.firebaseapp.com",
  projectId: "newwhatsapp-e45ab",
  storageBucket: "newwhatsapp-e45ab.appspot.com",
  messagingSenderId: "288783924047",
  appId: "1:288783924047:web:4c9a287fc9297450c6633a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
