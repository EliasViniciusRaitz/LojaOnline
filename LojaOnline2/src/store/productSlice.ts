// src/store/productsSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../types/index";

const LOCAL_KEY = "localProducts_v1";

const loadInitial = (): Product[] => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (items: Product[]) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Erro ao salvar produtos:", e);
  }
};

const initialState: Product[] = loadInitial();

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct(state, action: { payload: Product }) {
      state.unshift(action.payload);
      save(state);
    },
    updateProduct(state, action: { payload: Product }) {
      const idx = state.findIndex((p) => p.id === action.payload.id);
      if (idx >= 0) state[idx] = action.payload;
      save(state);
    },
    deleteProduct(state, action: { payload: number | string }) {
      const id = action.payload;
      const updated = state.filter((p) => p.id !== id);
      save(updated);
      return updated;
    },
    setProducts(state, action: { payload: Product[] }) {
      save(action.payload);
      return action.payload;
    },
    clearProducts() {
      save([]);
      return [];
    },
  },
});

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  setProducts,
  clearProducts,
} = productsSlice.actions;

export default productsSlice.reducer;