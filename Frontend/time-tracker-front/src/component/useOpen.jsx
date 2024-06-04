import React, { createContext, useContext, useState } from 'react';

const OpenContext = createContext({});

export const useOpen = () => useContext(OpenContext);

export const OpenProvider = ({ children }) => {
    const [open, setOpen] = useState(false);

    const setOpenStatus = (status) => {
        setOpen(status);
    };

    const getOpenStatus = () => {
        return open;
    };

    return (
        <OpenContext.Provider value={{ setOpenStatus, getOpenStatus }}>
            {children}
        </OpenContext.Provider>
    );
};
