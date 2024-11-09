// AppContextProvider.js
import { useTheme } from "@ui-kitten/components";
import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const kittenTheme = useTheme();
  const [selectedDars, setSelectedDars] = useState({
    playlist: {},
    dars: {},
  });

  const data = {
    selectedDars,
    setSelectedDars,
    kittenTheme,
  };

  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppContextProvider, useAppContext };
