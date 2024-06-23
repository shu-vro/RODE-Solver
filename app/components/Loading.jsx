"use client";

import React, { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Skeleton } from "../../components/ui/skeleton";

export default function Loading() {
    const { pending } = useFormStatus();
    useEffect(() => {
        if (pending) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
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
