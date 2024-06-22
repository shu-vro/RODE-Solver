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
import {
    ClipboardIcon,
    ThumbsDownIcon,
    ThumbsUpIcon,
} from "./components/icons";
import Link from "next/link";

export default function Component() {
    const [value, setValue] = useState(
        "$\\frac{\\mathrm{d}y}{\\mathrm{d}x}=\\frac{1-y^2}{1-x^2}$"
    );

    const [arrayResponse, setArrayResponse] = useState([]);

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
            <div className="sticky top-0 py-2 px-4 shadow-sm z-20">
                <div className="relative flex flex-row justify-around items-center max-[694px]:flex-wrap bg-background">
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
            {!arrayResponse.length && (
                <div className="w-[min(100%,740px)] z-10 grid grid-cols-2 gap-4 mx-auto my-4">
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
            )}
            <div className="flex-1 mx-auto my-4 flex flex-col items-start gap-8 px-4 w-[min(100%,740px)] bg-[#f0f4f9] dark:bg-[#0e1724] rounded-lg z-10">
                {arrayResponse.map((response, index) => (
                    <BidirectionalChat
                        key={index}
                        question={response.question}
                        answer={response.answer}
                    />
                ))}
                <Loading />
            </div>
        </form>
    );
}

function BidirectionalChat({ question, answer }) {
    useEffect(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
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
