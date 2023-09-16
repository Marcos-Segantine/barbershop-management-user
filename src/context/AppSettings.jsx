import { createContext } from "react";

export const AppSettingsContext = createContext(null);

export const AppSettingsProvider = ({ children }) => {

    const settings = {
        minimalHoursToCancelSchedule: 4,
        companyName: "Barbearia nome",
        city: "Nova Ponte",
        address: "Alameda dos Pinheiros, 100",
        neighborhood: "Nome do Bairoo"
    };

    return (
        <AppSettingsContext.Provider value={{ settings: settings }}>
            {children}
        </AppSettingsContext.Provider>
    );
}