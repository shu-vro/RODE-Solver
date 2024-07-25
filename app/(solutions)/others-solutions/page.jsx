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
import Link from "next/link";
import { useLeftNav } from "@/contexts/LeftNavProvider";

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
    setTimeout(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    }, 500);
    // console.log(docs.docs[docs.docs.length - 1], finalData);
    last = finalData.length ? docs.docs[docs.docs.length - 1] : last;
    return { data: finalData, last };
}

function Solution(props) {
    const { push } = useRouter();

    const handleClick = uid => {
        push(`/solutions/${uid}`);
    };

    // useEffect(() => {
    //     const nav = () => {
    //         console.log("click");
    //         handleClick(props.sol.uid);
    //     };
    //     const mf = document.querySelector(`math-field#sol-${props.sol.uid}`);
    //     if (mf) {
    //         mf.addEventListener("click", nav);
    //         return () => {
    //             mf.removeEventListener("click", nav);
    //         };
    //     }
    // }, []);

    return (
        <Link
            href={`/solutions/${props.sol.uid}`}
            className={cn(
                "flex flex-col justify-center gap-2 rounded-md items-start text-xs bg-[#f2f4f7] dark:bg-primary/5 p-3 py-2 cursor-pointer",
                "md:flex-row md:items-center md:gap-0 md:text-base"
            )}>
            <MathField
                id={"sol-" + props.sol.uid}
                onPointerUp={() => handleClick(props.sol.uid)}
                value={props.sol.question}
                readonly
                className="hide-this"
                style={{
                    flexGrow: 1,
                    border: "none",
                    pointerEvents: "none",
                    cursor: "pointer",
                    display: "inline-block",
                    overflowX: "auto",
                    background: "none",
                }}
            />
            <div className="flex flex-row justify-center items-center gap-2">
                <div className="px-2 py-1 rounded-sm bg-primary/60 text-white">
                    votes {props.sol.voteCount}
                </div>
                <div
                    className={cn("px-2 py-1 rounded-sm bg-lime-400", {
                        "bg-[#d73a4a38] text-[#d73a4a]":
                            props.sol.type === "ode",
                        "bg-[#2ea0f83a] text-[#2ea2f8]":
                            props.sol.type === "integration",
                        "bg-[#3fd3703a] text-[#3fd370]":
                            props.sol.type === "differentiation",
                        "bg-[#9cb3f33a] text-[#5b87ff]":
                            props.sol.type === "matrix",
                    })}>
                    {props.sol.type}
                </div>
                <div
                    className={cn("px-2 py-1 rounded-sm", {
                        "bg-[#01d1883a] text-[#01d188]":
                            props.sol.mode === "explain",
                        "bg-[#d477d53a] text-[#d477d5]":
                            props.sol.mode === "minimal",
                    })}>
                    {props.sol.mode}
                </div>
            </div>
        </Link>
    );
}

export default function Page() {
    const [solutions, setSolutions] = useState([]);
    const [lastRef, setLastRef] = useState(null);
    const [listOver, setListOver] = useState(true);
    const { open } = useLeftNav();

    useEffect(() => {
        (async () => {
            try {
                const sols = await paginateQuery(lastRef);
                setSolutions(prev => [...prev, ...sols.data]);
                setLastRef(sols.last);
                setListOver(sols.data.length === 0);
            } catch (error) {
                console.error(error);
                toast.error(
                    "There was an error fetching solutions. " +
                        JSON.stringify(error)
                );
            }
        })();
    }, []);

    return (
        <div
            className={cn(
                "flex flex-col grow min-h-[calc(100dvh-80px)] w-[99%] px-8 gap-3 transition-all",

                {
                    "w-[calc(99%-20rem)]": open,
                    "w-0": !open,
                }
            )}>
            {solutions.map(sol => (
                <Solution key={sol.uid} sol={sol} />
            ))}
            <Button
                className="mx-auto my-4"
                disabled={listOver}
                onClick={async () => {
                    const sols = await paginateQuery(lastRef);
                    setSolutions(prev => [...prev, ...sols.data]);
                    setLastRef(sols.last);
                    setListOver(sols.data.length === 0);
                }}>
                Load More
            </Button>
        </div>
    );
}
