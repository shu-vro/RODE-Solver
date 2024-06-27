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
                        voteCount: 0,
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
            className="flex flex-col grow min-h-[calc(100dvh-90px)]"
            action={formAction}
            onSubmit={e => {
                if (!auth.currentUser) {
                    toast.warning("Please sign in to save your answer");
                }
            }}>
            {![...questionList, ...localState].length ? (
                <div className="mx-auto my-4 flex-1 grow w-[min(100%,1024px)]">
                    <div className="z-10 grid grid-cols-2 gap-4 mx-auto my-4 grow">
                        {Array(4)
                            .fill(1)
                            .map((_, i) => {
                                return (
                                    <Link
                                        href={"#"}
                                        key={i}
                                        className="bg-[#dbdfe4] dark:bg-[#0e1724] rounded-lg p-4 grid place-items-center">
                                        <div>
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
                                        </div>
                                    </Link>
                                );
                            })}
                    </div>
                </div>
            ) : (
                <div className="mx-auto my-4 flex-1 grow w-[min(100%,740px)]">
                    <div className="flex flex-col items-start gap-8 px-4 bg-[#f0f4f9] dark:bg-[#0e1724] rounded-lg z-10">
                        {[...questionList, ...localState].map(response => (
                            <BidirectionalChat
                                key={response.uid}
                                response={response}
                            />
                        ))}
                        <Loading />
                    </div>
                </div>
            )}
            <div className="sticky bottom-[0] pt-2 mb-4 shadow-sm z-20 w-[min(100%,740px)] mx-auto">
                <div className="relative flex flex-row justify-between items-center max-[539px]:flex-col max-[539px]:items-stretch bg-background max-w-screen-lg mx-auto gap-3">
                    {/* <div className="w-[min(100%,740px)]"> */}
                    <MathField
                        value={value}
                        onInput={evt => setValue(evt.target.value)}
                        style={{
                            width: "100%",
                            zIndex: 100,
                            // flexGrow: 1,
                            overflowX: "auto",
                        }}
                    />
                    {/* </div> */}
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
        </form>
    );
}
