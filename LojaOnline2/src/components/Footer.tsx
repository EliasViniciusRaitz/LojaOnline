
import React from "react";
export function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={{ color: '#000' }}>©IFSC 2025 Created by Elias and Nickael</p> 
    </footer>
  );
}
const styles: Record<string, React.CSSProperties> = {
  footer: {

    padding: "1rem",
    textAlign: "center",
    backgroundColor: "#a29696ff", 
    marginTop: "2rem",
  },
};