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
import { auth, setDocumentToUsersCollection } from "@/firebase";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { DATABASE_PATH } from "@/lib/variables";
import { serverTimestamp } from "firebase/firestore";
import { useUserQuestions } from "@/contexts/UserQuestionsProvider";
import BidirectionalChat from "@/app/components/BidirectionalChat";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CommonSolution({
    pageType = "ode",
    defaultQuestion = "",
    actionFunction = () => {},
    setValue = () => {},
    presets = [],
}) {
    const { push } = useRouter();
    let { questionList } = useUserQuestions();
    questionList = questionList.filter(question => question.type === pageType);

    const [state, formAction] = useFormState(actionFunction, {});

    const [localState, setLocalState] = useState([]);

    const handleReloadClick = preset => {
        push(`?q=${preset}`);
    };

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
                    <div className="z-10 grid grid-cols-2 max-[539px]:grid-cols-1 gap-4 mx-auto m-4 grow">
                        {presets.map((preset, i) => {
                            return (
                                <div
                                    onClick={() => {
                                        handleReloadClick(preset);
                                    }}
                                    href={"#"}
                                    key={i}
                                    className="bg-[#dbdfe4] dark:bg-[#0e1724] rounded-lg p-4 grid place-items-center cursor-pointer max-[539px]:mx-4">
                                    <div>
                                        Solve {pageType.toUpperCase()}{" "}
                                        <MathField
                                            value={preset}
                                            onPointerUp={() => {
                                                handleReloadClick(preset);
                                            }}
                                            readonly
                                            style={{
                                                display: "inline-block",
                                                border: "none",
                                                background: "none",
                                                cursor: "pointer",
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <Loading />
                    </div>
                </div>
            ) : (
                <div className="mx-auto my-4 flex-1 grow w-[min(100%,800px)]">
                    <div
                        className={cn(
                            "flex flex-col items-start gap-8 px-4 rounded-lg z-10 pt-4",
                            "bg-[#f0f4f9] dark:bg-[#0e1724]",
                            "bg-background dark:bg-background"
                        )}>
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
            <div className="sticky bottom-[0] pt-2 px-3 mb-4 shadow-sm z-20 w-[min(100%,800px)] mx-auto">
                <div
                    className={cn(
                        "flex flex-row justify-between items-center",
                        "relative bg-background mx-auto gap-3",
                        "max-[539px]:flex-col max-[539px]:items-stretch max-w-screen-lg"
                    )}>
                    <div className="w-[min(calc(100vw-240px),800px)] max-[539px]:w-[min(calc(100vw-40px),800px)] overflow-x-auto">
                        <MathField
                            value={defaultQuestion}
                            onInput={e => {
                                console.log(e.target.value);
                                setValue(e.target.value);
                            }}
                            style={{
                                zIndex: 100,
                                background: "transparent",
                                borderColor: "hsla(var(--primary) / 50%)",
                            }}
                        />
                        <textarea
                            name="question"
                            id=""
                            rows={2}
                            cols={30}
                            className="sr-only"
                            value={defaultQuestion}
                            onChange={() => null}></textarea>
                    </div>
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
