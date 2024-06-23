"use client";

import React, { useEffect, useState } from "react";
import "@/assets/css/page-loader.css";
import { cn } from "@/lib/utils";

export default function PageLoader({ loading = true }) {
    const [shouldLoad, setShouldLoad] = useState(loading);

    useEffect(() => {
        // Simulate a delay to ensure the transition is visible
        const timer = setTimeout(() => {
            setShouldLoad(false);
        }, 100); // Adjust this delay as needed

        return () => clearTimeout(timer);
    }, [loading]);

    return (
        <div
            className={cn(
                "loading blur-0 opacity-100 transition-all duration-1000",
                {
                    "opacity-0 -z-50 select-none pointer-events-none":
                        !shouldLoad,
                }
            )}>
            <div className="loading-text">
                <span className="loading-text-words">L</span>
                <span className="loading-text-words">O</span>
                <span className="loading-text-words">A</span>
                <span className="loading-text-words">D</span>
                <span className="loading-text-words">I</span>
                <span className="loading-text-words">N</span>
                <span className="loading-text-words">G</span>
            </div>
        </div>
    );
}
