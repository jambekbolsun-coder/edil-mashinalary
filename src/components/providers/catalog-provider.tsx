"use client";

import { createContext, useContext } from "react";
import type { Equipment } from "@/lib/types";

const CatalogContext = createContext<Equipment[]>([]);

export function CatalogProvider({ products, children }: { products: Equipment[]; children: React.ReactNode }) {
  return <CatalogContext.Provider value={products}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
