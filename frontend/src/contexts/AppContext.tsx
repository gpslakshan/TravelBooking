import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

// 1. Define the type of the context (which holds all the properties and functions that we're going to expose to our components.)
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
};

// 2. Create the context
const AppContext = React.createContext<AppContext | undefined>(undefined);

// 3. Create the provider (provider is a component that wraps our components)
export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

  const { isError } = useQuery({
    queryKey: ["validateToken"],
    queryFn: apiClient.validateToken,
    retry: false,
  });

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)} // when the toast variable's state changes, it causes a re-render of the component.
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

// 4. Create a custom hook which lets our components easily access the provider
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
