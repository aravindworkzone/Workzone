import {
  signInWithRedirect,
  onAuthStateChanged
} from "firebase/auth"; 
import { auth,googleProvider } from "../utils/firebaseGoogle";
import { useEffect } from "react";

const GoogleLoginButton =  () => {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        console.log("Logged in user:", user.email);
        console.log("JWT Token:", token);
      }else{
        console.log(user);
      }
    });

    return () => unsub();
  }, []);
  

    const handleGoogleLogin = () => {
        signInWithRedirect(auth,googleProvider);
    }

    return(
        <button
            type="button"
            className="
                w-full flex items-center justify-center gap-3
                border border-gray-300 rounded-xl py-3
                text-sm font-medium text-gray-700
                hover:bg-gray-50 transition
            "
            onClick={handleGoogleLogin}
        >
            <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="h-5 w-5"
            />
            Continue with Google
        </button>
    );
}

export default GoogleLoginButton;