/* eslint-disable @typescript-eslint/naming-convention */
import React, { createContext, useState, useContext } from "react";

interface EmailContextType {
  email: string;
  setEmail: (email: string) => void;
}

export const emailContext = createContext<EmailContextType | undefined>(
  undefined
);

export const EmailProvider: React.FC = ({ children }) => {
  const [email, setEmail] = useState(
    localStorage.getItem("currentUserEmail") || ""
  );

  return (
    <emailContext.Provider value={{ email, setEmail }}>
      {children}
    </emailContext.Provider>
  );
};

export const useEmail = () => {
  const context = useContext(emailContext);
  if (!context) {
    throw new Error("useEmail must be used within an EmailProvider");
  }
  return context;
};
