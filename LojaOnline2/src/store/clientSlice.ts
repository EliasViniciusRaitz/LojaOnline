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
    // Tipagem: action: { payload: Client }
    addClient(state, action: { payload: Client }) {
      state.unshift(action.payload);
      save(state);
    },
    // Tipagem: action: { payload: Client }
    updateClient(state, action: { payload: Client }) {
      const idx = state.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) state[idx] = action.payload;
      save(state);
    },
    // Tipagem: action: { payload: number | string }
    deleteClient(state, action: { payload: number | string }) {
      const id = action.payload;
      const updated = state.filter((c) => c.id !== id);
      save(updated);
      return updated;
    },
    // Tipagem: action: { payload: Client[] }
    setClients(state, action: { payload: Client[] }) {
      const apiClients = action.payload;
      const localClients = loadInitial();

      // Mescla clientes da API com os locais, evitando que a API sobrescreva
      // clientes locais com o mesmo ID (embora improvável, é seguro).
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