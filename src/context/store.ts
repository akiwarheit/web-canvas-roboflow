import React, { Dispatch, SetStateAction } from "react";

export interface StoreProgress {
    msid: number;
    progress: number;
}


export interface StoreProgressContext {
    storeProgress: StoreProgress[],
    setStoreProgress: Dispatch<SetStateAction<StoreProgress[]>>;
}


export const StoreProgressContext = React.createContext<StoreProgressContext>({
    storeProgress: [],
    setStoreProgress: () => { }
});
