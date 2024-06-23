import React from "react";
import "mathlive";
import "mathlive/fonts.css";

export default function MathField({ value, ...rest }) {
    const extra_style =
        rest?.style && Object.keys(rest?.style).length ? rest.style : {};
    return (
        <>
            <math-field
                {...rest}
                style={{
                    display: "block",
                    fontSize: "1.8rem",
                    border: "1px solid hsl(var(--border))",
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
                    onInput={e => setValue(e.target.value)}
                    value={value}></textarea>
            )}
        </>
    );
}
