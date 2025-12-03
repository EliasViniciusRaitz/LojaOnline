import React from "react";
import {
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import logo from "../assets/logoLojaOnline.png"; 
import RefIcon from "@ant-design/icons/lib/icons/DoubleRightOutlined";

export const Header: React.FC = () => {
  return (
    <header
      style={{
        background: "#e6f4ff",
        padding: "0.8rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo + Home */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <img src={logo} alt="Logo" style={{ height: "40px" }} />
        <a href="/" style={{ color: "#040404ff", fontSize: "1rem" }}> Home
        </a>
        <a href="/products" style={{ color: "#070707ff", fontSize: "1rem" }}>Products
        </a>
        <a href="/clients" style={{ color: "#070707ff", fontSize: "1rem" }}> Clients
        </a>
      </div>

      {/* Barra de busca */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          margin: "0 2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            borderRadius: "20px",
            padding: "0.3rem 1rem",
            width: "60%",
            boxShadow: "0 1px 4px rgba(7, 7, 7, 0.1)",
          }}
        >
          <input
            type="text"
            placeholder="Pesquisar"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "1rem",
              backgroundColor: "#ffffffff",
              color: "#000000de",
            }}
          />
          <SearchOutlined style={{ color: "#1677ff", fontSize: "18px" }} />
        </div>
      </div>

      {/* Login + Cart */}
      <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <a
          href="#"
          style={{
            color: "#070707ff",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <RefIcon /> Login
        </a>
        <a
          href="#"
          style={{
            color: "#070707ff",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <ShoppingCartOutlined /> Cart
        </a>
      </nav>
    </header>
  );
};