import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import { store } from "./store/index";

import { CartProvider } from "./context/CartContext";

import "antd/dist/reset.css";
import "./index.css";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <CartProvider>
        <App />
      </CartProvider>
    </Provider>
  </StrictMode>
);
