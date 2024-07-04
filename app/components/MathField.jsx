import React, { useEffect } from "react";
import "mathlive";
import "mathlive/fonts.css";
import { toast } from "sonner";

export default function MathField({ value, ...rest }) {
    const extra_style =
        rest?.style && Object.keys(rest?.style).length ? rest.style : {};

    useEffect(() => {
        let timeout = null;
        function innerFunction() {
            if (!window.mathVirtualKeyboard) {
                toast.warning("Math Virtual Keyboard is not available.");
                return;
            }
            if (window.mathVirtualKeyboard?._visible) {
                timeout = setTimeout(() => {
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                    });
                }, 0);
            }
        }

        window.mathVirtualKeyboard.addEventListener(
            "virtual-keyboard-toggle",
            innerFunction
        );

        return () => {
            window.mathVirtualKeyboard.removeEventListener(
                "virtual-keyboard-toggle",
                innerFunction
            );
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, []);

    return (
        <>
            <math-field
                {...rest}
                style={{
                    display: "block",
                    fontSize: "1.8rem",
                    border: "1px solid hsl(var(--border))",
                    marginRight: 0,
                    ...extra_style,
                }}>
                {value}
            </math-field>
            {!rest.readonly && (
                <textarea
                    name="question"
                    id=""
                    rows={2}
                    cols={30}
                    className="sr-only"
                    value={value}></textarea>
            )}
        </>
    );
}
