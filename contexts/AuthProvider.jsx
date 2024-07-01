"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase_app from "@/firebase";
import PageLoader from "@/app/components/PageLoader";

// Initialize Firebase auth instance
const auth = getAuth(firebase_app);

// Create the authentication context
const AuthContext = createContext({});

// Custom hook to access the authentication context
export const useAuthContext = () => useContext(AuthContext);

const initializeAppCheckOnClient = async () => {
    if (typeof window !== "undefined") {
        // Check if running on client side
        const { initializeAppCheck, ReCaptchaV3Provider } = await import(
            "firebase/app-check"
        );

        initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(
                process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY
            ),
            isTokenAutoRefreshEnabled: true, // Set to true to enable token auto-refresh
        });
    }
};

export default function AuthProvider({ children }) {
    // Set up state to track the authenticated user and loading status
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to the authentication state changes
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                // User is signed in
                setUser(user);
            } else {
                // User is signed out
                setUser(null);
            }
            // Set loading to false once authentication state is determined
            setLoading(false);
        });

        initializeAppCheckOnClient();

        // Unsubscribe from the authentication state changes when the component is unmounted
        return () => unsubscribe();
    }, []);

    // Provide the authentication context to child components
    return (
        <AuthContext.Provider value={{ user }}>
            <PageLoader loading={loading} />
            {!loading && children}
        </AuthContext.Provider>
    );
}
