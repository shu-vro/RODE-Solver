"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { toast } from "sonner";

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

    useEffect(() => {
        (async () => {
            try {
                const json = await fetch(
                    "https://api.github.com/repos/shu-vro/rode-solver/commits/main"
                );
                const data = await json.json();
                const commit_date = new Date(data.commit.committer.date);
                const today = new Date();
                // if difference is less than 1 day, show toast
                if ((today - commit_date) / (1000 * 60 * 60 * 24) < 1)
                    toast.success(
                        `Update: ${data.commit.message} - ${data.committer.login}`,
                        {
                            duration: 3000,
                            action: {
                                label: "View",
                                onClick: () => {
                                    window.open(data.html_url, "_blank");
                                },
                            },
                        }
                    );
            } catch (e) {}
        })();
    }, []);

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
