import React, {ReactNode, useContext} from "react";
import {__RouterContext} from "react-router";

export function Link({to, children, className}: { to: string, children: ReactNode, className?: string }) {
    const {history} = useContext(__RouterContext);
    return (
        <a
            className={className}
            href={to}
            onClick={(event) => {
                event.preventDefault();
                history.push(to);
            }}
        >
            {children}
        </a>
    );
}
