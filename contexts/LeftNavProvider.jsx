"use client";

import { createContext, useContext, useState } from "react";

const Context = createContext({});

export function useLeftNav() {
    return useContext(Context);
}

export default function LeftNavProvider({ children }) {
    const [open, setOpen] = useState(localStorage?.["leftNavOpen"] === "true");
    return (
        <Context.Provider value={{ open, setOpen }}>
            {children}
        </Context.Provider>
    );
}
