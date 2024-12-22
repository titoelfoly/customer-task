"use client";

import * as Toast from "@radix-ui/react-toast";
import { createContext, useContext, useState } from "react";

interface ToastContextProps {
  showToast: (title: string, description: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [toastContent, setToastContent] = useState({
    title: "",
    description: "",
  });

  const showToast = (title: string, description: string) => {
    setToastContent({ title, description });
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right" duration={30000}>
        {children}
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className="bg-gray-800 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-4"
        >
          <div>
            <Toast.Title className="font-bold text-lg">
              {toastContent.title}
            </Toast.Title>
            <Toast.Description className="text-sm text-gray-300">
              {toastContent.description}
            </Toast.Description>
          </div>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4 w-96 space-y-4" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
