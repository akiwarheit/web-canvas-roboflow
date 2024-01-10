import React, { Dispatch, SetStateAction } from "react";


export interface QuarterContextType {
    q1: string[];
    q2: string[];
    q3: string[];
    q4: string[];
    setQ1: Dispatch<SetStateAction<string[]>>;
    setQ2: Dispatch<SetStateAction<string[]>>;
    setQ3: Dispatch<SetStateAction<string[]>>;
    setQ4: Dispatch<SetStateAction<string[]>>;
}


export const QuarterContext = React.createContext<QuarterContextType>({
    q1: [],
    q2: [],
    q3: [],
    q4: [],
    setQ1: () => { },
    setQ2: () => { },
    setQ3: () => { },
    setQ4: () => { }
});
