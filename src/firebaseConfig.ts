import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFJl1tCzXjlyD0uLFiAqsBDotqBUW-9ic",
  authDomain: "whatsappcl-11f51.firebaseapp.com",
  projectId: "whatsappcl-11f51",
  storageBucket: "whatsappcl-11f51.appspot.com",
  messagingSenderId: "684464878810",
  appId: "1:684464878810:web:a9f011153ef66b792e21e3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
