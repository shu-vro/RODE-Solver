"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/firebase";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import { ChromeIcon } from "./icons";
import { useLeftNav } from "@/contexts/LeftNavProvider";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/lib/useMediaQuery";
import { auth } from "@/firebase";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { useAuthContext } from "@/contexts/AuthProvider";
import { useUserQuestions } from "@/contexts/UserQuestionsProvider";
import MathField from "./MathField";

export default function LeftSidebar() {
    const { open, setOpen } = useLeftNav();
    const { user } = useAuthContext();
    const match_924 = useMediaQuery("(max-width: 924px)");
    useEffect(() => {
        setOpen(!match_924);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match_924]);

    const { questionList } = useUserQuestions();
    const formattedQuestionList = useMemo(() => {
        return questionList.reduce((acc, question) => {
            let date = question.createdAt;
            if (!date) {
                return acc;
            }
            console.log("date1", date);
            date = date.toDate();
            console.log("date2", date);
            date = date.toDateString();
            console.log("date3", date);
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(question);
            return acc;
        }, {});
    });

    console.log(formattedQuestionList);

    return (
        <div className="z-[1000]">
            <div
                className={cn(
                    "fixed top-0 left-0 w-[100vw] h-screen bg-black/30 min-[924px]:sr-only backdrop-blur-sm",
                    { hidden: !open }
                )}
                onClick={() => {
                    setOpen(false);
                }}></div>
            <div
                className={cn(
                    "bg-white dark:bg-neutral-950 flex flex-col gap-2 text-black dark:text-white sticky top-0 h-[calc(100vh-70px)] overflow-auto border-r-2 border-border transition-all",
                    {
                        "min-w-80 w-80": open,
                        "min-w-0 w-0": !open,
                    },
                    "max-[924px]:fixed max-[924px]:top-[70px] max-[924px]:left-0 max-[924px]:bottom-0 max-[924px]:right-0 max-[924px]:z-50"
                )}>
                <div className="flex-1 overflow-auto z-20">
                    <div className="grid gap-1 p-2">
                        {/* <div className="text-stone-500 text-xs font-medium px-2">
                            Today
                        </div>
                        {Array(25)
                            .fill(1)
                            .map((_, i) => (
                                <Link
                                    href="#"
                                    key={i}
                                    className="truncate overflow-hidden flex-1 text-sm transition-colors rounded-md whitespace-nowrap p-2 block hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
                                    prefetch={false}>
                                    Python function for Fibonacci sequence
                                </Link>
                            ))} */}
                        {Object.entries(formattedQuestionList).map(
                            ([date, arr]) => (
                                <>
                                    <div className="text-stone-500 text-xs font-medium px-2">
                                        {date}
                                    </div>
                                    {arr.map((obj, i) => (
                                        <Link
                                            href="#"
                                            key={i}
                                            className="truncate overflow-hidden flex-1 text-sm transition-colors rounded-md whitespace-nowrap p-2 block hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
                                            prefetch={false}>
                                            {obj.type} -{" "}
                                            <MathField
                                                value={obj.question}
                                                readonly
                                                style={{
                                                    display: "inline-block",
                                                    fontSize: "1.2rem",
                                                }}
                                            />{" "}
                                            -{obj.mode}
                                        </Link>
                                    ))}
                                </>
                            )
                        )}
                    </div>
                </div>
                <div className="mb-3 flex flex-col gap-2">
                    <Button className="w-full capitalize" asChild>
                        <Link href={"#"}>See other solutions</Link>
                    </Button>
                    {!user ? (
                        <Button
                            className="w-full"
                            onClick={async () => {
                                const user = await signInWithGoogle();
                            }}>
                            <ChromeIcon className="mr-2 h-5 w-5" />
                            Sign in with Google
                        </Button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-full">
                                    {user.displayName}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-80">
                                <DropdownMenuLabel>Options</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={async () => {
                                        await signOut(auth);
                                    }}>
                                    Log Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </div>
    );
}
