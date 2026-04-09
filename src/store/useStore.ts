import { create } from "zustand";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
};

type Store = {
  transactions: Transaction[];
  add: (t: Transaction) => void;
  remove: (id: string) => void;
  update: (t: Transaction) => void;
  load: () => void;
};

export const useStore = create<Store>((set) => ({
  transactions: [],

  load: () => {
    const data = localStorage.getItem("transactions");
    if (data) set({ transactions: JSON.parse(data) });
  },

  add: (t) =>
    set((state) => {
      const updated = [...state.transactions, t];
      localStorage.setItem("transactions", JSON.stringify(updated));
      return { transactions: updated };
    }),

  remove: (id) =>
    set((state) => {
      const updated = state.transactions.filter((t) => t.id !== id);
      localStorage.setItem("transactions", JSON.stringify(updated));
      return { transactions: updated };
    }),

  update: (updatedTransaction) =>
    set((state) => {
      const updated = state.transactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      );

      localStorage.setItem("transactions", JSON.stringify(updated));
      return { transactions: updated };
    }),
}));