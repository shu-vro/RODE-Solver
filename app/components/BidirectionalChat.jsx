"use client";
import { useEffect } from "react";
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
import { doc, updateDoc, increment } from "firebase/firestore";
import { useAuthContext } from "@/contexts/AuthProvider";

export default function BidirectionalChat({
    question,
    answer,
    vote,
    fromServer,
    id,
}) {
    useEffect(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    }, []);

    const { user } = useAuthContext();

    const voteHandler = async incr => {
        try {
            if (fromServer && user) {
                const docRef = doc(firestoreDb, DATABASE_PATH.solutions, id);

                // await updateDoc(docRef, {
                //     [`vote.${user.uid}`]: incr,
                // });
                if (typeof vote?.[user.uid] === "number") {
                    if (incr == 1) {
                        if (vote[user.uid] === 0 || vote[user.uid] === -1) {
                            await updateDoc(docRef, {
                                [`vote.${user.uid}`]: increment(incr),
                            });
                        }
                    } else if (incr == -1) {
                        if (vote[user.uid] === 0 || vote[user.uid] === 1) {
                            await updateDoc(docRef, {
                                [`vote.${user.uid}`]: increment(incr),
                            });
                        }
                    }
                } else {
                    await updateDoc(docRef, {
                        [`vote.${user.uid}`]: incr,
                    });
                }
            } else {
                toast.warning(
                    "This feature is only available for server responses or for signed in users."
                );
            }
        } catch (e) {
            toast.error(e.message);
        }
    };

    return (
        <div
            className="flex-1 flex flex-col items-start gap-8 mx-auto w-[min(100%,740px)] border-b-2"
            id={id}>
            <div className="flex items-start gap-4">
                <Avatar className="border w-10 h-10 text-xs">
                    <AvatarImage src={user?.photoURL || user_icon.src} />
                    <AvatarFallback>YOU</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <div className="font-bold">You</div>
                    <MarkdownView>{question}</MarkdownView>
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
                            className="text-4xl hover:bg-transparent text-stone-400 hover:text-stone-900 dark:hover:text-stone-100">
                            <FaCaretUp />
                            <span className="sr-only">Upvote</span>
                        </Button>
                        <Button
                            variant="text"
                            disabled
                            size="icon"
                            type="button"
                            className="text-2xl">
                            {Object.values(vote).reduce(
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
                            className="text-4xl hover:bg-transparent text-stone-400 hover:text-stone-900 dark:hover:text-stone-100">
                            <FaCaretDown />
                            <span className="sr-only">Downvote</span>
                        </Button>
                    </div>
                </div>
                <div className="grid gap-1">
                    <div className="font-bold">RODE Solver</div>
                    <MarkdownView>{answer}</MarkdownView>
                    <div className="flex items-center gap-2 py-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText(answer);
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
