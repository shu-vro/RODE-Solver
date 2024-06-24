"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MathField from "@/app/components/MathField";
import MarkdownView from "@/app/components/MarkdownView";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import SubmitButton from "@/app/components/SubmitButton";
import Loading from "@/app/components/Loading";
import icon from "@/app/favicon.ico";
import user_icon from "@/assets/user-photo.jpg";
import { ClipboardIcon } from "@/app/components/icons";
import Link from "next/link";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { auth, firestoreDb, setDocumentToUsersCollection } from "@/firebase";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { DATABASE_PATH } from "@/lib/variables";
import { doc, increment, serverTimestamp, updateDoc } from "firebase/firestore";
import { useUserQuestions } from "@/contexts/UserQuestionsProvider";
import { useAuthContext } from "@/contexts/AuthProvider";

export default function CommonSolution({
    pageType = "ode",
    defaultQuestion = "",
    actionFunction = () => {},
}) {
    const [value, setValue] = useState(defaultQuestion);
    let { questionList } = useUserQuestions();
    questionList = questionList.filter(question => question.type === pageType);

    const [state, formAction] = useFormState(actionFunction, {});

    const [localState, setLocalState] = useState([]);

    // useEffect(() => {
    //     const storedArrayResponse = localStorage.getItem("arrayResponse");
    //     if (storedArrayResponse) {
    //         setArrayResponse(JSON.parse(storedArrayResponse));
    //     }
    // }, []);

    useEffect(() => {
        if (state?.success) {
            // setArrayResponse(prev => {
            //     localStorage.setItem(
            //         "arrayResponse",
            //         JSON.stringify([...prev, state])
            //     );
            //     return [...prev, state];
            // });
            const uid = nanoid();
            if (auth.currentUser) {
                setDocumentToUsersCollection(
                    uid,
                    {
                        uid,
                        question: state.question,
                        answer: state.answer,
                        type: pageType,
                        mode: state.mode,
                        vote: 0,
                        createdBy: auth.currentUser.uid,
                        createdAt: serverTimestamp(),
                        fromServer: true,
                    },
                    DATABASE_PATH.solutions
                );
            } else {
                setLocalState(prev => [
                    ...prev,
                    {
                        ...state,
                        type: pageType,
                        vote: 0,
                        uid,
                        fromServer: false,
                    },
                ]);
            }
        } else if (state && state.success === false) {
            toast.error(state.answer);
            console.log(state);
        }
    }, [state]);

    return (
        <form
            className="flex flex-col grow"
            action={formAction}
            onSubmit={e => {
                if (!auth.currentUser) {
                    toast.warning("Please sign in to save your answer");
                }
            }}>
            <div className="sticky top-0 py-2 px-4 shadow-sm z-20">
                <div className="relative flex flex-row justify-between items-center max-[467px]:flex-wrap bg-background max-w-screen-lg mx-auto gap-3">
                    <MathField
                        value={value}
                        onInput={evt => setValue(evt.target.value)}
                        style={{
                            marginRight: "50px",
                            zIndex: 100,
                            flexGrow: 1,
                        }}
                    />
                    <Select name="mode" defaultValue="Minimal">
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Select a Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Choose</SelectLabel>
                                <SelectItem value="Explain">Explain</SelectItem>
                                <SelectItem value="Minimal">Minimal</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <SubmitButton />
                </div>
            </div>
            {![...questionList, ...localState].length ? (
                <div className="w-[min(100%,1024px)] z-10 grid grid-cols-2 gap-4 mx-auto my-4">
                    {Array(4)
                        .fill(1)
                        .map((_, i) => {
                            return (
                                <Link
                                    href={"#"}
                                    key={i}
                                    className="bg-[#dbdfe4] dark:bg-[#0e1724] rounded-lg p-4">
                                    Solve ODE{" "}
                                    <MathField
                                        value={
                                            "$\\frac{\\mathrm{d}y}{\\mathrm{d}x}=\\frac{1-y^2}{1-x^2}$"
                                        }
                                        readonly
                                        style={{
                                            display: "inline-block",
                                            border: "none",
                                            background: "none",
                                        }}
                                    />
                                </Link>
                            );
                        })}
                </div>
            ) : (
                <div className="flex-1 mx-auto my-4 flex flex-col items-start gap-8 px-4 w-[min(100%,740px)] bg-[#f0f4f9] dark:bg-[#0e1724] rounded-lg z-10">
                    {[...questionList, ...localState].map((response, index) => (
                        <BidirectionalChat
                            key={response.uid}
                            question={response.question}
                            answer={response.answer}
                            vote={response.vote}
                            fromServer={response.fromServer}
                            id={response.uid}
                        />
                    ))}
                    <Loading />
                </div>
            )}
        </form>
    );
}

function BidirectionalChat({ question, answer, vote, fromServer, id }) {
    useEffect(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    }, []);

    const { user } = useAuthContext();

    const voteHandler = async incr => {
        try {
            // upvote
            if (fromServer && user) {
                const docRef = doc(firestoreDb, DATABASE_PATH.solutions, id);
                // Atomically increment the population of the city by 50.
                await updateDoc(docRef, {
                    vote: increment(incr),
                });
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
                    <AvatarImage src={user_icon.src} />
                    <AvatarFallback>YOU</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <div className="font-bold">You</div>
                    <MarkdownView>{question}</MarkdownView>
                </div>
            </div>
            <div className="flex items-start gap-4 text-xs">
                <div className="flex flex-col items-center">
                    <Avatar className="border w-10 h-10 dark:invert">
                        <AvatarImage src={icon.src} />
                        <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={first => {
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
                            {vote}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={first => {
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
