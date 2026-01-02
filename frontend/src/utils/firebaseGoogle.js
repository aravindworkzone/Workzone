import { initializeApp } from "firebase/app";
import { 
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider
} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDPGceTvL4eom6WeVXKonOycfIYtRBZzeQ",
  authDomain: "todo-fabdb.firebaseapp.com",
  projectId: "todo-fabdb",
  storageBucket: "todo-fabdb.firebasestorage.app",
  messagingSenderId: "134588495224",
  appId: "1:134588495224:web:76a5c62bf48a15d214048d",
  measurementId: "G-659KZHRVVK"
};
const googleApp = initializeApp(firebaseConfig);

// npm install -g firebase-tools

export const auth = getAuth(googleApp);
setPersistence(auth, browserLocalPersistence);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});