"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MathField from "./components/MathField";
import MarkdownView from "./components/MarkdownView";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { submitForm } from "./action";
import SubmitButton from "./components/SubmitButton";
import Loading from "./components/Loading";
import icon from "@/app/favicon.ico";
import user_icon from "@/assets/user-photo.jpg";

export default function Component() {
    const [value, setValue] = useState(
        "$\\frac{\\mathrm{d}y}{\\mathrm{d}x}=\\frac{1-y^2}{1-x^2}$"
    );

    const [arrayResponse, setArrayResponse] = useState([]);
    const endOfPageRef = useRef(null);

    const [state, formAction] = useFormState(submitForm, {});

    useEffect(() => {
        const storedArrayResponse = localStorage.getItem("arrayResponse");
        if (storedArrayResponse) {
            setArrayResponse(JSON.parse(storedArrayResponse));
        }
    }, []);

    useEffect(() => {
        // use localstorage to store arrayResponse
        if (state?.question) {
            setArrayResponse(prev => {
                localStorage.setItem(
                    "arrayResponse",
                    JSON.stringify([...prev, state])
                );
                return [...prev, state];
            });
        }
    }, [state]);

    return (
        <form className="flex flex-col" action={formAction}>
            <div className="sticky top-0 py-2 px-4 shadow-sm z-[1000]">
                <div className="relative flex flex-row justify-around items-center max-[694px]:flex-wrap bg-white">
                    <MathField
                        value={value}
                        onInput={evt => setValue(evt.target.value)}
                        style={{
                            marginRight: "50px",
                            zIndex: 1000,
                            flexGrow: 1,
                        }}
                    />
                    <Select name="mode" defaultValue="Minimal">
                        <SelectTrigger className="w-[180px]">
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
            <div className="flex-1 mx-auto flex flex-col items-start gap-8 px-4 w-[min(100%,740px)] bg-[#f0f4f9] rounded-lg">
                <h1 className="font-bold text-2xl">
                    R<span className="text-red-500">ODE</span> Solver
                </h1>
                {arrayResponse.map((response, index) => (
                    <BidirectionalChat
                        key={index}
                        question={response.question}
                        answer={response.answer}
                        bottomElement={endOfPageRef?.current}
                    />
                ))}
                <Loading endOfPage={endOfPageRef.current} />
                <div ref={endOfPageRef}></div>
            </div>
        </form>
    );
}

function BidirectionalChat({ question, answer, bottomElement }) {
    useEffect(() => {
        bottomElement?.scrollIntoView({ behavior: "smooth" });
        // console.log(question);
        // console.log(answer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex-1 flex flex-col items-start gap-8 mx-auto w-[min(100%,740px)]">
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
                <Avatar className="border w-10 h-10">
                    <AvatarImage src={icon.src} />
                    <AvatarFallback>ODE</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <div className="font-bold">rODE Solver</div>
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
                            className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900">
                            <ClipboardIcon className="w-4 h-4" />
                            <span className="sr-only">Copy</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900">
                            <ThumbsUpIcon className="w-4 h-4" />
                            <span className="sr-only">Upvote</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900">
                            <ThumbsDownIcon className="w-4 h-4" />
                            <span className="sr-only">Downvote</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ArrowUpIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
        </svg>
    );
}

function ClipboardIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        </svg>
    );
}

function SparkleIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        </svg>
    );
}

function ThumbsDownIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M17 14V2" />
            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
        </svg>
    );
}

function ThumbsUpIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
        </svg>
    );
}

function ZapIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </svg>
    );
}
