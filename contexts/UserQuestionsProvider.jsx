"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthProvider";
import { DATABASE_PATH } from "@/lib/variables";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { firestoreDb } from "@/firebase";

const Context = createContext({});

export function useUserQuestions() {
    return useContext(Context);
}

export default function UserQuestionsProvider({ children }) {
    const [questionList, setQuestionList] = useState([]);
    const { user } = useAuthContext();
    useEffect(() => {
        let unsubscribe;
        if (user) {
            const q = query(
                collection(firestoreDb, DATABASE_PATH.solutions),
                where("createdBy", "==", user.uid),
                orderBy("createdAt", "asc")
            );
            unsubscribe = onSnapshot(q, querySnapshot => {
                const cities = [];
                querySnapshot.forEach(doc => {
                    cities.push(doc.data());
                });
                setQuestionList(cities);
            });
        }
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user]);

    return (
        <Context.Provider value={{ questionList }}>{children}</Context.Provider>
    );
}
