"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import MathField from "@/app/components/MathField";
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
import Link from "next/link";
import { auth, setDocumentToUsersCollection } from "@/firebase";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { DATABASE_PATH } from "@/lib/variables";
import { serverTimestamp } from "firebase/firestore";
import { useUserQuestions } from "@/contexts/UserQuestionsProvider";
import BidirectionalChat from "@/app/components/BidirectionalChat";

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

    useEffect(() => {
        if (state?.success) {
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
                        vote: {},
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
                <div className="relative flex flex-row justify-between items-center max-[467px]:flex-col max-[467px]:items-stretch bg-background max-w-screen-lg mx-auto gap-3">
                    <MathField
                        value={value}
                        onInput={evt => setValue(evt.target.value)}
                        style={{
                            zIndex: 100,
                            flexGrow: 1,
                        }}
                    />
                    <div className="flex flex-row justify-between gap-3">
                        <Select name="mode" defaultValue="Minimal">
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Select a Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Choose</SelectLabel>
                                    <SelectItem value="Explain">
                                        Explain
                                    </SelectItem>
                                    <SelectItem value="Minimal">
                                        Minimal
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <SubmitButton />
                    </div>
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
