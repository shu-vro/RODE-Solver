"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInWithGoogle, loginWithPassword } from "@/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { push } = useRouter();
    const [notice, setNotice] = useState({
        message: "Enter your email and password to log in to your account.",
        type: "info", // info | success | error
    });

    return (
        <div className="h-[calc(100vh-90px)] flex justify-center items-center">
            <div className="max-w-sm space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Welcome Back</h1>
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
                        const user = await loginWithPassword(email, password);
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
                    <Button type="submit" className="w-full">
                        Sign In
                    </Button>
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            className="flex-1"
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
                            <ChromeIcon className="mr-2 h-5 w-5" />
                            Sign in with Google
                        </Button>
                        <Link
                            href="/sign-up"
                            className="ml-4 inline-block text-sm font-medium underline underline-offset-4"
                            prefetch={false}>
                            Create an account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
