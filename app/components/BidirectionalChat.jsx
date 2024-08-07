"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MarkdownView from "@/app/components/MarkdownView";
import icon from "@/app/favicon.ico";
import user_icon from "@/assets/user-photo.jpg";
import { ClipboardIcon } from "@/app/components/icons";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { firestoreDb } from "@/firebase";
import { toast } from "sonner";
import { DATABASE_PATH } from "@/lib/variables";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { useAuthContext } from "@/contexts/AuthProvider";
import MathField from "./MathField";
import { cn } from "@/lib/utils";

export default function BidirectionalChat({ response }) {
    const { user } = useAuthContext();
    const [questionerInfo, setQuestioner] = useState(user);

    useEffect(() => {
        if (response && user?.uid) {
            if (response.createdBy === user.uid) {
                setQuestioner({
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                });
            } else {
                (async () => {
                    try {
                        const data = await getDoc(
                            doc(firestoreDb, "users", response.createdBy)
                        );

                        if (data.exists()) {
                            setQuestioner({
                                displayName: data.data().name,
                                photoURL: data.data().photoURL,
                            });
                        }
                    } catch (e) {}
                })();
            }
        }
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    }, []);

    const voteHandler = async incr => {
        try {
            if (response.fromServer && user) {
                const docRef = doc(
                    firestoreDb,
                    DATABASE_PATH.solutions,
                    response.uid
                );
                if (typeof response.vote?.[user.uid] === "number") {
                    if (incr == 1) {
                        if (
                            response.vote[user.uid] === 0 ||
                            response.vote[user.uid] === -1
                        ) {
                            const voteCount =
                                Object.values(response.vote).reduce(
                                    (prev, curr) => prev + curr,
                                    0
                                ) ?? 0;
                            await updateDoc(docRef, {
                                [`vote.${user.uid}`]: increment(incr),
                                voteCount: voteCount + incr,
                            });
                        }
                    } else if (incr == -1) {
                        const voteCount = Object.values(response.vote).reduce(
                            (prev, curr) => prev + curr,
                            0
                        );
                        if (
                            response.vote[user.uid] === 0 ||
                            response.vote[user.uid] === 1
                        ) {
                            await updateDoc(docRef, {
                                [`vote.${user.uid}`]: increment(incr),
                                voteCount: voteCount + incr,
                            });
                        }
                    }
                } else {
                    await updateDoc(docRef, {
                        [`vote.${user.uid}`]: incr,
                        voteCount: increment(incr),
                    });
                }
            } else {
                toast.warning(
                    "This feature is only available for server responses or for signed in users."
                );
            }
        } catch (e) {
            toast.error(e.message);
            console.log(e);
        }
    };

    return (
        <div
            className="flex flex-col items-start gap-6 mx-auto w-[min(100%,800px)] border-b-2"
            id={response.uid}>
            <div className="flex items-start justify-start gap-3 w-full flex-row-reverse">
                <Avatar className="border w-10 h-10 text-xs">
                    <AvatarImage
                        src={questionerInfo?.photoURL || user_icon.src}
                    />
                    <AvatarFallback>YOU</AvatarFallback>
                </Avatar>
                <div className="grid gap-1 py-2 w-fit">
                    <div className="font-bold text-right">
                        {questionerInfo?.displayName || "You"}
                    </div>
                    <MathField
                        value={response.question}
                        readonly
                        style={{
                            background: "hsl(var(--primary))",
                            border: "none",
                            color: "white",
                            borderRadius: ".75rem",
                            overflow: "auto",
                        }}
                    />
                </div>
            </div>
            <div className="flex items-start gap-4 text-xs">
                <div className="flex flex-col items-center">
                    <Avatar className="border w-10 h-10 invert dark:invert-0">
                        <AvatarImage src={icon.src} />
                        <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => {
                                voteHandler(1);
                            }}
                            className={cn(
                                "text-4xl hover:bg-transparent text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-all",
                                {
                                    "scale-125 text-green-700 dark:text-green-400 hover:text-green-700 hover:dark:text-green-400":
                                        response.vote?.[user.uid] === 1,
                                }
                            )}>
                            <FaCaretUp />
                            <span className="sr-only">Upvote</span>
                        </Button>
                        <Button
                            variant="text"
                            disabled
                            size="icon"
                            type="button"
                            className="text-2xl">
                            {Object.values(response.vote).reduce(
                                (prev, curr) => prev + curr,
                                0
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => {
                                voteHandler(-1);
                            }}
                            className={cn(
                                "text-4xl hover:bg-transparent text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-all",
                                {
                                    "scale-125 text-red-700 dark:text-red-400 hover:text-red-700 hover:dark:text-red-400":
                                        response.vote?.[user.uid] === -1,
                                }
                            )}>
                            <FaCaretDown />
                            <span className="sr-only">Downvote</span>
                        </Button>
                    </div>
                </div>
                <div className="grid gap-1">
                    <div className="font-bold">RODE Solver</div>
                    <div className="w-[min(calc(100vw-104px),710px)]">
                        <MarkdownView>{response.answer}</MarkdownView>
                    </div>
                    <div className="flex items-center gap-2 py-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText(response.answer);
                                alert("Copied to clipboard");
                            }}
                            className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900 dark:hover:text-stone-100">
                            <ClipboardIcon className="w-4 h-4" />
                            <span className="sr-only">Copy</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
