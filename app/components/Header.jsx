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
            className={cn(
                "px-2 py-1 rounded-sm font-bold bg-foreground/15 text-foreground"
                // {
                //     "bg-[#d73a4a38] text-[#d73a4a]": title === "ode",
                //     "bg-[#2ea0f83a] text-[#2ea2f8]": title === "integration",
                //     "bg-[#3fd3703a] text-[#3fd370]": title === "differentiation",
                //     "bg-[#9cb3f33a] text-[#5b87ff]": title === "others-solutions",
                //     "bg-[#8fff5b3a] text-[#8fff5b]": title === "solutions",
                // }
            )}>
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
    const match_media = useMediaQuery(`(max-width: 835px)`);
    const { setOpen } = useLeftNav();
    const pathname = usePathname();
    return (
        <div className="flex justify-between pt-4 z-[1001] bg-primary mx-auto sticky top-0 w-full">
            <div className="w-full mx-10 flex justify-between items-center flex-row max-sm:mx-5">
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
                        {match_media ? (
                            <MobileNavigation />
                        ) : (
                            <DesktopNavigation />
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
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
                            variant: "outline",
                        })}>
                        <FaBarsStaggered />
                        <span className="sr-only">Toggle panel</span>
                    </span>
                </SheetTrigger>
                <SheetContent className="w-full z-[1000000]" side="top">
                    <SheetHeader>
                        <SheetTitle className="text-center">
                            <Link href={`/`} className="font-bold text-2xl">
                                R<span className="text-red-500">ODE</span>{" "}
                                Solver
                            </Link>
                        </SheetTitle>
                        <SheetDescription className="text-foreground text-center">
                            <ul>
                                {links.map(link => (
                                    <li key={link.href} className="my-6">
                                        <a
                                            href={link.href}
                                            className="text-2xl px-3 py-2 fancy-1">
                                            <span>{link.text}</span>
                                        </a>
                                    </li>
                                ))}
                                <li>
                                    <ModeToggle variant="secondary" />
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
                            "bg-transparent font-bold text-xl"
                        )}>
                        {link.text}
                    </NavigationMenuLink>
                </Link>
            ))}
            <ModeToggle />
        </NavigationMenuItem>
    );
}
