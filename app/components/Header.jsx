"use client";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import React from "react";
import ModeToggle from "./ModeToggle";
import useMediaQuery from "@/lib/useMediaQuery";
import { buttonVariants } from "@/components/ui/button";
import { FaBarsStaggered } from "react-icons/fa6";
import { BsLayoutSidebarInset } from "react-icons/bs";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const links = [
    { href: "/ode", text: "ODE" },
    { href: "/differentiation", text: "Differentiation" },
    { href: "/integration", text: "Integration" },
    { href: "/matrix", text: "Matrix" },
];

export default function Header() {
    const match_700 = useMediaQuery(`(max-width: 700px)`);
    return (
        <div className="flex justify-between my-4 z-[1001] relative max-w-[1024px] mx-auto">
            <div className="flex justify-center items-center flex-row">
                <Link href={`/`} className="font-bold text-2xl">
                    R<span className="text-red-500">ODE</span> Solver
                </Link>
            </div>
            <NavigationMenu className="z-[1001]">
                <NavigationMenuList>
                    {match_700 ? <MobileNavigation /> : <DesktopNavigation />}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}
function MobileNavigation() {
    return (
        <NavigationMenuItem className="gap-4 flex justify-center items-center flex-nowrap">
            <ModeToggle />
            <Sheet>
                <SheetTrigger>
                    <span
                        className={buttonVariants({
                            size: "icon",
                        })}>
                        <FaBarsStaggered />
                        <span className="sr-only">Toggle panel</span>
                    </span>
                </SheetTrigger>
                <SheetContent className="w-full z-[1000000]" side="top">
                    <SheetHeader>
                        <SheetTitle>
                            <Link href={`/`} className="font-bold text-2xl">
                                R<span className="text-red-500">ODE</span>{" "}
                                Solver
                            </Link>
                        </SheetTitle>
                        <SheetDescription className="text-foreground">
                            <ul>
                                {links.map(link => (
                                    <li key={link.href} className="my-4">
                                        <a
                                            href={link.href}
                                            className="text-2xl px-3 py-2 fancy-1">
                                            <span>{link.text}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </NavigationMenuItem>
    );
}

function DesktopNavigation() {
    return (
        <NavigationMenuItem>
            {links.map(link => (
                <Link href={link.href} legacyBehavior passHref key={link.href}>
                    <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}>
                        {link.text}
                    </NavigationMenuLink>
                </Link>
            ))}
            <ModeToggle />
        </NavigationMenuItem>
    );
}
