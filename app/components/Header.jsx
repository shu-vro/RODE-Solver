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
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useLeftNav } from "@/contexts/LeftNavProvider";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

function NameDecorator({ name }) {
    let title = name.split("/")[1];
    return (
        <span
            className={cn("px-2 py-1 rounded-sm", {
                "bg-[#d73a4a38] text-[#d73a4a]": title === "ode",
                "bg-[#2ea0f83a] text-[#2ea2f8]": title === "integration",
                "bg-[#3fd3703a] text-[#3fd370]": title === "differentiation",
                "bg-[#9cb3f33a] text-[#5b87ff]": title === "others-solutions",
            })}>
            {title}
        </span>
    );
}

const links = [
    { href: "/ode", text: "ODE" },
    { href: "/differentiation", text: "Differentiation" },
    { href: "/integration", text: "Integration" },
    // { href: "/matrix", text: "Matrix" },
];

export default function Header() {
    const match_700 = useMediaQuery(`(max-width: 631px)`);
    const { setOpen } = useLeftNav();
    const pathname = usePathname();
    return (
        <div className="flex justify-between my-4 z-[1001] bg-background max-w-[1024px] mx-auto sticky top-0">
            <div className="flex justify-center items-center flex-row">
                <Button
                    size="icon"
                    variant="outline"
                    className="mr-3"
                    type="button"
                    onClick={() => {
                        setOpen(prev => {
                            localStorage["leftNavOpen"] = !prev;
                            return !prev;
                        });
                    }}>
                    <BsLayoutSidebarInset />
                </Button>
                <div>
                    <Link href={`/`} className="font-bold text-2xl">
                        R<span className="text-red-500">ODE</span> Solver
                    </Link>
                    <div className="mt-1">
                        <NameDecorator name={pathname} />
                    </div>
                </div>
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
        <NavigationMenuItem>
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
                                <li>
                                    <ModeToggle />
                                </li>
                            </ul>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </NavigationMenuItem>
    );
}

function DesktopNavigation() {
    const pathname = usePathname();
    return (
        <NavigationMenuItem className="gap-1 flex">
            {links.map(link => (
                <Link href={link.href} legacyBehavior passHref key={link.href}>
                    <NavigationMenuLink
                        active={pathname === link.href}
                        className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent"
                        )}>
                        {link.text}
                    </NavigationMenuLink>
                </Link>
            ))}
            <ModeToggle />
        </NavigationMenuItem>
    );
}
