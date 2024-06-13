"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useFormStatus } from "react-dom";
import { ArrowUpIcon } from "../page";

export default function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="icon" className="ml-4" disabled={pending}>
            <ArrowUpIcon className="w-4 h-4" />
            <span className="sr-only">Send</span>
        </Button>
    );
}
