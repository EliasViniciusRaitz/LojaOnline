// components/Footer.tsx
import React from "react";
export function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={{ color: '#000' }}>©IFSC 2025 Created by Elias and Nickael</p> {/* GARANTIR TEXTO PRETO */}
    </footer>
  );
}
const styles: Record<string, React.CSSProperties> = {
  footer: {
    // Note que o estilo original já era claro, mas reforçamos a cor do texto.
    padding: "1rem",
    textAlign: "center",
    backgroundColor: "#a29696ff", // Fundo claro
    marginTop: "2rem",
  },
};