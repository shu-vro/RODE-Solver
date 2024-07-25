"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/firebase";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { BiSpreadsheet } from "react-icons/bi";
import { useLeftNav } from "@/contexts/LeftNavProvider";
import { cn } from "@/lib/utils";
import { auth } from "@/firebase";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { useAuthContext } from "@/contexts/AuthProvider";
import { useUserQuestions } from "@/contexts/UserQuestionsProvider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ImDownload } from "react-icons/im";
import { PiGoogleChromeLogoDuotone } from "react-icons/pi";
import MathField from "./MathField";
import { useRouter } from "next/navigation";
import useMediaQuery from "@/lib/useMediaQuery";

export default function LeftSidebar() {
    const { open, setOpen } = useLeftNav();
    const { user } = useAuthContext();
    const [deferredPrompt, setDeferredPrompt] = useState();
    const matchMedia = useMediaQuery("(max-width: 924px)");

    const { questionList } = useUserQuestions();
    const formattedQuestionList = useMemo(() => {
        return questionList.reduce((acc, question) => {
            let date = question.createdAt;
            if (!date) {
                return acc;
            }
            date = date.toDate();
            date = date.toDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(question);
            return acc;
        }, {});
    });

    useEffect(() => {
        window.addEventListener("beforeinstallprompt", e => {
            setDeferredPrompt(e);
        });
    }, []);

    return (
        <div className="z-[1000]">
            <div
                className={cn(
                    "fixed top-0 left-0 w-[100vw] h-screen bg-black/30 min-[924px]:sr-only backdrop-blur-sm",
                    { hidden: !open }
                )}
                onClick={() => {
                    setOpen(() => {
                        localStorage["leftNavOpen"] = "false";
                        return false;
                    });
                }}></div>
            <div
                className={cn(
                    "bg-background flex flex-col gap-2 text-black dark:text-white sticky top-[80px] h-[calc(100dvh-80px)] overflow-hidden border-r-2 border-border transition-all",
                    {
                        "min-w-80 w-80 pl-4": open,
                        "min-w-0 w-0 pl-0": !open,
                    },
                    {
                        "fixed top-[80px] left-0 bottom-0 right-0 z-50":
                            matchMedia,
                    }
                )}>
                <div className="flex-1 overflow-auto z-20">
                    <div className="grid grid-cols-1 gap-1 px-2 pt-4">
                        {Object.entries(formattedQuestionList)
                            .reverse()
                            .map(([date, arr]) => (
                                <div className="mb-6" key={date}>
                                    <div className="text-stone-500 text-xs font-medium px-2">
                                        {date}
                                    </div>
                                    {arr.reverse().map((obj, i) => (
                                        <Question
                                            obj={obj}
                                            key={i}
                                            mobileView={matchMedia}
                                        />
                                    ))}
                                </div>
                            ))}
                    </div>
                </div>
                <div className="mb-3 flex flex-col gap-2">
                    <Button className="w-full capitalize justify-start" asChild>
                        <Link href="/others-solutions">
                            <BiSpreadsheet className="mr-2 text-lg" />
                            See other solutions
                        </Link>
                    </Button>

                    {deferredPrompt && (
                        <Button
                            className="w-full capitalize justify-start"
                            onClick={async () => {
                                deferredPrompt.prompt();
                                const { outcome } =
                                    await deferredPrompt.userChoice;
                                if (outcome === "accepted") {
                                    setDeferredPrompt(undefined);
                                }
                            }}>
                            <ImDownload className="mr-2 text-lg" />
                            <span>Install App</span>
                        </Button>
                    )}
                    {!user ? (
                        <Button
                            className="w-full capitalize justify-start"
                            onClick={async () => {
                                const user = await signInWithGoogle();
                            }}>
                            {/* <ChromeIcon className="mr-2 h-5 w-5" /> */}
                            <PiGoogleChromeLogoDuotone className="mr-2 text-xl" />
                            Sign in with Google
                        </Button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="w-full gap-2 truncate justify-start"
                                    // variant="secondary"
                                >
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage
                                            src={user.photoURL}
                                            alt="photo"
                                        />
                                        <AvatarFallback>
                                            {user.displayName}
                                        </AvatarFallback>
                                    </Avatar>
                                    {user.displayName}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-80">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                        Options
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={async () => {
                                            await signOut(auth);
                                        }}>
                                        Log Out
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                        Support
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://github.com/shu-vro/RODE-Solver"
                                            prefetch={false}>
                                            Star The Project
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://github.com/shu-vro/RODE-Solver/issues"
                                            prefetch={false}>
                                            Report An Issue
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </div>
    );
}

function Question({ obj, mobileView }) {
    const { push } = useRouter();
    const { setOpen } = useLeftNav();
    return (
        <Link
            href={`/${obj.type}#${obj.uid}`}
            onClick={() => {
                if (mobileView) {
                    setOpen(false);
                }
            }}
            className={cn(
                "truncate block overflow-x-auto flex-1 text-sm transition-colors rounded-md whitespace-nowrap p-2 border-b-2",
                "hover:bg-primary/10",
                "flex items-start justify-start flex-col"
            )}
            prefetch={false}>
            <div>
                <span
                    className={cn("px-2 py-1 rounded-sm", {
                        "bg-[#d73a4a38] text-[#d73a4a]": obj.type === "ode",
                        "bg-[#2ea0f83a] text-[#2ea2f8]":
                            obj.type === "integration",
                        "bg-[#3fd3703a] text-[#3fd370]":
                            obj.type === "differentiation",
                        "bg-[#9cb3f33a] text-[#5b87ff]": obj.type === "matrix",
                    })}>
                    {obj.type}
                </span>
                <span
                    className={cn("px-2 py-1 rounded-sm bg-lime-400 ml-2", {
                        "bg-[#01d1883a] text-[#01d188]": obj.mode === "explain",
                        "bg-[#d477d53a] text-[#d477d5]": obj.mode === "minimal",
                    })}>
                    {obj.mode}
                </span>
            </div>
            <MathField
                value={obj.question}
                readonly
                onPointerUp={() => {
                    push(`/${obj.type}#${obj.uid}`);
                }}
                style={{
                    display: "inline-block",
                    overflowX: "auto",
                    border: "none",
                    background: "none",
                }}
            />
        </Link>
    );
}
