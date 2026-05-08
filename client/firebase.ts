import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1isocrCDvke9elYb-7J3zWRWHmur86x4",
  authDomain: "hospital-ai-system-7777f.firebaseapp.com",
  projectId: "hospital-ai-system-7777f",
  storageBucket: "hospital-ai-system-7777f.firebasestorage.app",
  messagingSenderId: "627420401384",
  appId: "1:627420401384:web:a701c730d066ca2bd4c35d",
  measurementId: "G-B8EPML4NFZ",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);