"use client";

import React, { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading({ endOfPage }) {
    const { pending } = useFormStatus();
    useEffect(() => {
        if (endOfPage && pending) {
            window.scrollTo(0, document.body.scrollHeight);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pending]);

    return pending ? (
        <>
            <div className="w-full">
                {Array(3)
                    .fill(1)
                    .map((_, i) => (
                        <Skeleton className="h-4 w-full my-3" key={i} />
                    ))}
                <Skeleton className="h-4 w-1/2" />
            </div>
        </>
    ) : null;
}
