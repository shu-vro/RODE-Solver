"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/firebase";
import Link from "next/link";
import React, { useEffect } from "react";
import { ChromeIcon } from "./icons";
import { useLeftNav } from "@/contexts/LeftNavProvider";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/lib/useMediaQuery";

export default function LeftSidebar() {
    const { open, setOpen } = useLeftNav();
    const match_924 = useMediaQuery("(max-width: 924px)");
    useEffect(() => {
        setOpen(!match_924);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match_924]);

    return (
        <div className="z-[1000] grow">
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
                {/* <div className="p-2">
                <Button
                    variant="ghost"
                    className="w-full text-left px-2 justify-start p hover:bg-neutral-50 hover:text-neutral-900 dark:hover:bg-neutral-900 dark:hover:text-neutral-50 gap-2">
                    <div className="rounded-full bg-white text-black flex items-center justify-center w-7 h-7">
                        <RiRobot2Fill />
                    </div>
                    <div className="grow text-ellipsis overflow-hidden whitespace-nowrap text-sm">
                        ChatGPT
                    </div>
                    <FaPen />
                </Button>
            </div> */}
                <div className="flex-1 overflow-auto z-20">
                    <div className="grid gap-1 p-2">
                        <div className="text-stone-500 text-xs font-medium px-2">
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
                                    Python functon for Fibonacci sequence
                                </Link>
                            ))}
                    </div>
                </div>
                <div className="mb-3">
                    <Button
                        className="w-full"
                        onClick={async () => {
                            const user = await signInWithGoogle();
                            if (user.accessToken) {
                                // setNotice({
                                //     message: "Signed in with Google.",
                                //     type: "success",
                                // });
                                // push("/");
                            } else {
                                // setNotice({
                                //     message:
                                //         "There was an error signing in with Google." +
                                //         user,
                                //     type: "error",
                                // });
                            }
                        }}>
                        <ChromeIcon className="mr-2 h-5 w-5" />
                        Sign in with Google
                    </Button>
                </div>
            </div>
        </div>
    );
}
