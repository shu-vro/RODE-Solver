import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { FaPen } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";

export default function LeftSidebar() {
    return (
        <div className="sticky top-0 bg-neutral-950 hidden md:flex flex-col gap-2 text-white">
            <div className="sticky top-0 p-2">
                <Button
                    variant="ghost"
                    className="w-full text-left px-2 justify-start p hover:bg-neutral-900 hover:text-neutral-50 gap-2">
                    <div className="rounded-full bg-white text-black flex items-center justify-center w-7 h-7">
                        <RiRobot2Fill />
                    </div>
                    <div className="grow text-ellipsis overflow-hidden whitespace-nowrap text-sm">
                        ChatGPT
                    </div>
                    <FaPen />
                </Button>
            </div>
            <div className="overflow-auto flex-1">
                <div className="grid gap-1 p-2">
                    <div className="text-stone-500 text-xs font-medium px-2">
                        Today
                    </div>
                    <Link
                        href="#"
                        className="truncate overflow-hidden flex-1 text-sm transition-colors rounded-md whitespace-nowrap p-2 block bg-neutral-900 hover:bg-neutral-900 hover:text-neutral-50"
                        prefetch={false}>
                        Airplane Turbulence: Sky&apos;s Rollercoaster
                    </Link>
                    <Link
                        href="#"
                        className="truncate overflow-hidden flex-1 text-sm transition-colors rounded-md whitespace-nowrap p-2 block hover:bg-neutral-900 hover:text-neutral-50"
                        prefetch={false}>
                        How to make a chat app with React
                    </Link>
                    <Link
                        href="#"
                        className="truncate overflow-hidden flex-1 text-sm transition-colors rounded-md whitespace-nowrap p-2 block hover:bg-neutral-900 hover:text-neutral-50"
                        prefetch={false}>
                        Cooking recipe for disaster
                    </Link>
                </div>
                <div className="grid gap-1 p-2">
                    <div className="text-stone-500 text-xs font-medium px-2">
                        Yesterday
                    </div>
                    <Link
                        href="#"
                        className="truncate overflow-hidden flex-1 text-sm transition-colors rounded-md whitespace-nowrap p-2 block hover:bg-neutral-900 hover:text-neutral-50"
                        prefetch={false}>
                        Python functon for Fibonacci sequence
                    </Link>
                    <Link
                        href="#"
                        className="truncate overflow-hidden flex-1 text-sm transition-colors rounded-md whitespace-nowrap p-2 block hover:bg-neutral-900 hover:text-neutral-50"
                        prefetch={false}>
                        Five largest lakes in the world
                    </Link>
                    <Link
                        href="#"
                        className="truncate overflow-hidden flex-1 text-sm transition-colors rounded-md whitespace-nowrap p-2 block hover:bg-neutral-900 hover:text-neutral-50"
                        prefetch={false}>
                        Weather forecast in Seattle
                    </Link>
                    <Link
                        href="#"
                        className="truncate overflow-hidden flex-1 text-sm transition-colors rounded-md whitespace-nowrap p-2 block hover:bg-neutral-900 hover:text-neutral-50"
                        prefetch={false}>
                        Chicken or the egg?
                    </Link>
                    <Link
                        href="#"
                        className="truncate overflow-hidden flex-1 text-sm transition-colors rounded-md whitespace-nowrap p-2 block hover:bg-neutral-900 hover:text-neutral-50"
                        prefetch={false}>
                        Neural networks for dummies
                    </Link>
                </div>
            </div>
        </div>
    );
}
