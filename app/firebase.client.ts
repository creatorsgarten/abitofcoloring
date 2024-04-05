import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2K76ycMyLhAYOd_XOa3aC3Cnqe6dEno0",
  authDomain: "showdownspace.firebaseapp.com",
  databaseURL: "https://grtn.asia-southeast1.firebasedatabase.app",
  projectId: "showdownspace",
  storageBucket: "showdownspace.appspot.com",
  messagingSenderId: "999073329546",
  appId: "1:999073329546:web:08df5e95a021605ca49873",
  measurementId: "G-9LV3C4S19C",
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
