"use client";

import React, { useEffect, useState } from "react";
import {
    getDocs,
    query,
    orderBy,
    limit,
    collection,
    startAfter,
} from "firebase/firestore";
import { firestoreDb } from "@/firebase";
import { DATABASE_PATH } from "@/lib/variables";
import MathField from "@/app/components/MathField";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

async function paginateQuery(last, sortField = "voteCount", lim = 10) {
    let q;
    if (last) {
        q = query(
            collection(firestoreDb, DATABASE_PATH.solutions),
            orderBy(sortField, "desc"),
            orderBy("createdAt", "desc"),
            startAfter(last),
            limit(lim)
        );
    } else {
        q = query(
            collection(firestoreDb, DATABASE_PATH.solutions),
            orderBy(sortField, "desc"),
            orderBy("createdAt", "desc"),
            limit(lim)
        );
    }

    const docs = await getDocs(q);
    const finalData = [];
    docs.docs.forEach(doc => {
        finalData.push(doc.data());
    });
    return { data: finalData, last: docs.docs[docs.docs.length - 1] };
}

export default function Page() {
    const [solutions, setSolutions] = useState([]);
    const [lastRef, setLastRef] = useState(null);
    const { push } = useRouter();
    useEffect(() => {
        (async () => {
            try {
                const sols = await paginateQuery(lastRef);
                setSolutions(prev => [...prev, ...sols.data]);
                setLastRef(sols.last);
            } catch (error) {
                console.error(error);
                toast.error(
                    "There was an error fetching solutions. " +
                        JSON.stringify(error)
                );
            }
        })();
    }, []);

    const handleClick = uid => {
        push(`/solutions/${uid}`);
    };

    return (
        <div className="flex flex-col grow min-h-[calc(100dvh-90px)] mx-5 sm:mx-20 gap-3">
            {solutions.map(sol => (
                <div
                    key={sol.id}
                    onClick={() => handleClick(sol.uid)}
                    className={cn(
                        "flex flex-col justify-center gap-2 rounded-md items-start text-xs bg-[#f2f4f7] dark:bg-neutral-900 p-3 py-2 cursor-pointer",
                        "md:flex-row md:items-center md:gap-0 md:text-base"
                    )}>
                    <MathField
                        value={sol.question}
                        readonly
                        onPointerUp={() => handleClick(sol.uid)}
                        style={{
                            flexGrow: 1,
                            background: "transparent",
                            border: "none",
                            pointerEvents: "none",
                        }}
                    />
                    <div className="flex flex-row justify-center items-center gap-2">
                        <div className="px-2 py-1 rounded-sm bg-black text-white dark:bg-white dark:text-black">
                            votes {sol.voteCount}
                        </div>
                        <div
                            className={cn("px-2 py-1 rounded-sm bg-lime-400", {
                                "bg-[#d73a4a38] text-[#d73a4a]":
                                    sol.type === "ode",
                                "bg-[#2ea0f83a] text-[#2ea2f8]":
                                    sol.type === "integration",
                                "bg-[#3fd3703a] text-[#3fd370]":
                                    sol.type === "differentiation",
                                "bg-[#9cb3f33a] text-[#5b87ff]":
                                    sol.type === "matrix",
                            })}>
                            {sol.type}
                        </div>
                        <div
                            className={cn("px-2 py-1 rounded-sm", {
                                "bg-[#01d1883a] text-[#01d188]":
                                    sol.mode === "explain",
                                "bg-[#d477d53a] text-[#d477d5]":
                                    sol.mode === "minimal",
                            })}>
                            {sol.mode}
                        </div>
                    </div>
                </div>
            ))}
            <Button
                className="mx-auto my-4"
                onClick={async () => {
                    const sols = await paginateQuery(lastRef);
                    setSolutions(prev => [...prev, ...sols.data]);
                    setLastRef(sols.last);
                }}>
                Load More
            </Button>
        </div>
    );
}
