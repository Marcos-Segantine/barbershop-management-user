import { createContext, useState } from "react";

export const SomethingWrong = createContext(null)

export const SomethingWrongProvider = ({ children }) => {
    const [somethingWrong, setSomethingWrong] = useState(false)

    return (
        <SomethingWrong.Provider value={{ somethingWrong, setSomethingWrong }}>
            {children}
        </SomethingWrong.Provider>
    )
}