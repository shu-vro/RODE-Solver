"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";

export default function Footer() {
    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const scrollDown = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    };
    return (
        <div className="fixed bottom-8 max-[1254px]:bottom-24 max-[539px]:bottom-40 right-6 flex flex-col z-[1000] gap-3">
            <Button
                type="button"
                size="icon"
                className="ml-4 opacity-25 hover:opacity-70 w-7 h-7"
                onClick={scrollUp}>
                <FaAngleUp />
                <span className="sr-only">Go up</span>
            </Button>
            <Button
                type="button"
                size="icon"
                className="ml-4 opacity-25 hover:opacity-70 w-7 h-7"
                onClick={scrollDown}>
                <FaAngleDown />
                <span className="sr-only">Go up</span>
            </Button>
        </div>
    );
}
