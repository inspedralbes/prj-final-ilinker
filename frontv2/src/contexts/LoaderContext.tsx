"use client";

import { createContext, useState, ReactNode } from "react";
import { LoaderComponent } from "@/components/ui/loader-layout";

interface LoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

export const LoaderContext = createContext<LoaderContextType>({
  isLoading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

interface LoaderProviderProps {
  children: ReactNode;
}

export const LoaderProvider = ({ children }: LoaderProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showLoader = () => {
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}

      {isLoading && <LoaderComponent />}
    </LoaderContext.Provider>
  );
};
