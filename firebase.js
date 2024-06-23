// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import {
    connectFirestoreEmulator,
    doc,
    setDoc,
    query,
    collection,
    where,
    getDocs,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
} from "firebase/firestore";
import {
    getAuth,
    connectAuthEmulator,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
} from "firebase/auth";
import { DATABASE_PATH } from "./lib/variables";
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

async function setDocumentToUsersCollection(uid, obj) {
    try {
        await setDoc(doc(firestoreDb, DATABASE_PATH.users, uid), obj, {
            merge: true,
        });
        return;
    } catch (error) {
        console.warn(error);
        return alert("there was an error on setDocumentToUsersCollection");
    }
}

export async function createUserWithPassword(name, email, password) {
    try {
        let { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        await setDocumentToUsersCollection(user.uid, {
            uid: user.uid,
            name,
            email,
            photoURL: null,
        });
        await updateProfile(auth.currentUser, {
            displayName: name,
            photoURL,
        });
        return user;
    } catch (e) {
        console.warn(e);
        alert("There was an error creating user: " + name);
        await signOut(auth);
        return e.code;
    }
}

export async function loginWithPassword(email, password) {
    try {
        let { user } = await signInWithEmailAndPassword(auth, email, password);
        return user;
    } catch (e) {
        console.warn("There was an error at loginWithPassword");
        return e.code;
    }
}

export async function signInWithGoogle() {
    try {
        let provider = new GoogleAuthProvider();
        let { user } = await signInWithPopup(auth, provider);

        // const userExists = await getDocs(
        //     query(
        //         collection(firestoreDb, DATABASE_PATH.users),
        //         where("uid", "==", user.uid)
        //     )
        // );
        // if (userExists.size !== 0) {
        //     return user;
        // }
        await setDocumentToUsersCollection(user.uid, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
        });
        return user;
    } catch (e) {
        console.warn("There was an error at signInWithGoogle", e);
        await signOut(auth);
        return e.code;
    }
}
