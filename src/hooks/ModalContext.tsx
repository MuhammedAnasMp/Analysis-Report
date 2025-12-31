import React, {
  createContext,
  useContext,
  useState,
} from "react";

import type { PayloadOne, PayloadTwo } from "./modalTypes";
interface ModalContextType {
  open: boolean;
  heading: string;
  payloadOne: PayloadOne | null;
  payloadTwo: PayloadTwo | null;
  openModal: (
    heading: string,
    payloadOne: PayloadOne,
    payloadTwo: PayloadTwo
  ) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: any }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [heading, setHeading] = useState("");
  const [payloadOne, setPayloadOne] = useState<PayloadOne | null>(null);
  const [payloadTwo, setPayloadTwo] = useState<PayloadTwo | null>(null);

  const openModal = (
    title: string,
    dataOne: PayloadOne,
    dataTwo: PayloadTwo
  ) => {
    setHeading(title);
    setPayloadOne(dataOne);
    setPayloadTwo(dataTwo);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setHeading("");
    setPayloadOne(null);
    setPayloadTwo(null);
  };

  return (
    <ModalContext.Provider
      value={{
        open,
        heading,
        payloadOne,
        payloadTwo,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used inside ModalProvider");
  }
  return ctx;
};
