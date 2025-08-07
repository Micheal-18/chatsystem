import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "chat-system-dfb04",
  storageBucket: "chat-system-dfb04.firebasestorage.app",
  messagingSenderId: "986797118625",
  appId: "1:986797118625:web:7cff32299ade0be2218ce0"
};

const app = initializeApp(firebaseConfig);
// initalize firebase auth and then link it to the app
const auth = getAuth(app)
const db = getFirestore(app);

export { db, auth };