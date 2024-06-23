// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    connectAuthEmulator,
} from "firebase/auth";
import {
    connectFirestoreEmulator,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
    }),
});

if (globalThis?.location?.hostname === "localhost") {
    connectAuthEmulator(auth, "http://127.0.0.1:4001");
    connectFirestoreEmulator(firestoreDb, "127.0.0.1", 4002);
}

export async function signInWithGoogle() {
    try {
        let provider = new GoogleAuthProvider();
        let { user } = await signInWithPopup(auth, provider);
        return user;
    } catch (e) {
        console.warn("There was an error at signInWithGoogle", e);
        await signOut(auth);
        return e.code;
    }
}
