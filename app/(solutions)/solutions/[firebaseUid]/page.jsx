"use client";

import BidirectionalChat from "@/app/components/BidirectionalChat";
import { firestoreDb } from "@/firebase";
import { DATABASE_PATH } from "@/lib/variables";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page({ params: { firebaseUid } }) {
    const [question, setQuestion] = useState({});
    useEffect(() => {
        let unsubscribe;
        (async () => {
            try {
                unsubscribe = onSnapshot(
                    doc(firestoreDb, DATABASE_PATH.solutions, firebaseUid),
                    qn => {
                        if (qn.exists) {
                            setQuestion(qn.data());
                        } else {
                            toast.warning("No such document!");
                        }
                    }
                );
            } catch (error) {
                console.log(error);
                toast.error("Error getting document: ", error);
            }
        })();
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [firebaseUid]);
    return Object.keys(question).length ? (
        <BidirectionalChat response={question} />
    ) : (
        <div>No such question</div>
    );
}
