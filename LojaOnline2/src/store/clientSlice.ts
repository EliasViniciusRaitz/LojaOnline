// src/store/clientSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { Client } from "../types";

// Chave local para o localStorage
const LOCAL_KEY = "localClients_v1";

// Carrega clientes do localStorage
const loadInitial = (): Client[] => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Salva clientes no localStorage
const save = (items: Client[]) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Erro ao salvar clientes:", e);
  }
};

// Estado inicial: Clientes locais do localStorage
const initialState: Client[] = loadInitial();

export const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {

    addClient(state, action: { payload: Client }) {
      state.unshift(action.payload);
      save(state);
    },

    updateClient(state, action: { payload: Client }) {
      const idx = state.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) state[idx] = action.payload;
      save(state);
    },

    deleteClient(state, action: { payload: number | string }) {
      const id = action.payload;
      const updated = state.filter((c) => c.id !== id);
      save(updated);
      return updated;
    },

    setClients(state, action: { payload: Client[] }) {
      const apiClients = action.payload;
      const localClients = loadInitial();
      const finalClients = [
        ...localClients,
        ...apiClients.filter(
          (apiC) => !localClients.some((localC) => localC.id === apiC.id)
        ),
      ];

      save(finalClients);
      return finalClients;
    },
    clearClients() {
      save([]);
      return [];
    },
  },
});

export const { addClient, updateClient, deleteClient, setClients, clearClients } = clientSlice.actions;
export default clientSlice.reducer;