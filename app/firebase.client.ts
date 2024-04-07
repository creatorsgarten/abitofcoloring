import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiUSaIKqPRhcllIcUbrii1KE5RyGJ2lWY",
  authDomain: "creatorsgarten-experiments.firebaseapp.com",
  databaseURL:
    "https://creatorsgarten-experiments-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "creatorsgarten-experiments",
  storageBucket: "creatorsgarten-experiments.appspot.com",
  messagingSenderId: "454145861649",
  appId: "1:454145861649:web:ffaa8b5b67f294b29be9b0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const auth = getAuth(app);

export const authStateAvailablePromise = new Promise<void>((resolve) => {
  onAuthStateChanged(auth, () => {
    resolve();
  });
});

Object.assign(window, {
  firebaseAuth: auth,
});
