import React, { createContext, useContext, useState } from "react";

/* ---------------- TYPES ---------------- */

export type Offer = {
  id: string;
  title: string;
  code: string;
  offerType: "WEEKEND" | "FESTIVAL" | "MEGA" | "BOGO";
  price: number;
  discountPercent: number;
  finalPrice: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;

  /* 🎨 OPTIONAL: UI can theme based on this */
  theme?: "GREEN" | "RED" | "DEFAULT";
};

type OffersContextType = {
  offers: Offer[];
  addOffer: (offer: Offer) => void;
  deleteOffer: (id: string) => void;
};

/* ---------------- CONTEXT ---------------- */

const OffersContext = createContext<OffersContextType | undefined>(
  undefined
);

/* ---------------- PROVIDER ---------------- */

export const OffersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);

  const addOffer = (offer: Offer) => {
    setOffers((prev) => [offer, ...prev]);
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <OffersContext.Provider
      value={{
        offers,
        addOffer,
        deleteOffer,
      }}
    >
      {children}
    </OffersContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */

export const useOffers = () => {
  const context = useContext(OffersContext);
  if (!context) {
    throw new Error("useOffers must be used inside OffersProvider");
  }
  return context;
};
