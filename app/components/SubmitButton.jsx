"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useFormStatus } from "react-dom";
import { IoSend } from "react-icons/io5";

export default function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="icon" disabled={pending}>
            <IoSend />
            <span className="sr-only">Send</span>
        </Button>
    );
}
