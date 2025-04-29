"use client";

import { createContext, useState } from "react";
import {LoaderComponent} from "@/components/LoaderComponent";

export const LoaderContext = createContext({
  isLoading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => {
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}

      {isLoading && (<LoaderComponent />)}
    </LoaderContext.Provider>
  );
};
