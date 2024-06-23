"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createUserWithPassword } from "@/firebase";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [notice, setNotice] = useState({
        message: "Enter your email and password to log in to your account.",
        type: "info", // info | success | error
    });

    return (
        <div className="h-[calc(100vh-90px)] flex justify-center items-center">
            <div className="mx-auto max-w-md space-y-6 py-12">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Sign Up</h1>
                    <p
                        className={cn(
                            notice.type === "info" && "text-muted-foreground",
                            notice.type === "success" && "text-lime-600",
                            notice.type === "error" && "text-red-600"
                        )}>
                        {notice.message}
                    </p>
                </div>
                <form
                    className="space-y-4"
                    onSubmit={async e => {
                        e.preventDefault();
                        if (password !== confirmPassword) {
                            setNotice({
                                message: "Passwords do not match.",
                                type: "error",
                            });
                            return;
                        }
                        const user = await createUserWithPassword(
                            name,
                            email,
                            password
                        );
                        if (user.accessToken) {
                            setNotice({
                                message: "Signed in with Password.",
                                type: "success",
                            });
                            push("/");
                        } else {
                            setNotice({
                                message:
                                    "There was an error signing in with Password: " +
                                    user,
                                type: "error",
                            });
                        }
                    }}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                            Confirm Password
                        </Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Sign Up
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or sign up with
                            </span>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                            const user = await signInWithGoogle();
                            if (user.accessToken) {
                                setNotice({
                                    message: "Signed in with Google.",
                                    type: "success",
                                });
                                push("/");
                            } else {
                                setNotice({
                                    message:
                                        "There was an error signing in with Google." +
                                        user,
                                    type: "error",
                                });
                            }
                        }}>
                        <ChromeIcon className="mr-2 h-4 w-4" />
                        Google
                    </Button>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="#" className="underline" prefetch={false}>
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ChromeIcon(props) {
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
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" x2="12" y1="8" y2="8" />
            <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
            <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
        </svg>
    );
}
