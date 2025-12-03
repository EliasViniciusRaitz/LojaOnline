// src/store/index.ts (APENAS A PARTE DA CONFIGURAÇÃO)
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import clientReducer from "./clientSlice"; // NOVO

export const store = configureStore({
  reducer: {
    products: productReducer,
    clients: clientReducer, // NOVO
    // theme: themeReducer, // Será adicionado no futuro
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;