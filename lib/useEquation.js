"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function useEquation() {
    const [equation, setEquation] = useState("");
    const pathname = useSearchParams();

    useEffect(() => {
        const queryString = decodeURIComponent(
            window.location.search.substring(1)
        );

        const splitted = queryString.split("&");
        const searchParams = {};
        splitted.forEach(query => {
            let [key, ...value] = query.split("=");
            value = value.join("=");
            searchParams[key] = value;
        });
        if (searchParams?.q) {
            setEquation(searchParams.q);
        }
    }, [pathname]);

    return equation;
}
