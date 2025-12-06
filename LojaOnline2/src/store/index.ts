
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import clientReducer from "./clientSlice"; 

export const store = configureStore({
  reducer: {
    products: productReducer,
    clients: clientReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;