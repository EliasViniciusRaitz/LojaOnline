import React, { useEffect, useState } from "react";
import { Spin, notification } from "antd";
import type { Product } from "../types/index";
import { getProducts } from "../services/products";
import { ProductCard } from "../components/ProductCard";
import styles from "./HomePage.module.css";

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts(5)
      .then(setProducts)
      .catch(() =>
        notification.error({
          title: "Erro na API",
          description: "Não foi possível buscar os produtos.",
        })
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spin fullscreen tip="Carregando produtos..." />;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.welcome}>Welcome to the Shop</h1>
      <h2 className={styles.subtitle}>Top 5 Products</h2>

      <div className={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};