"use client";
import styles from "./styles/Home.module.css";

interface WasapComponentProps {
  id?: string; 
}

export function WasapComponent({ id }: WasapComponentProps) {
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <a
          href={`/whatsapp?id=${id || ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappBtn}
        >
          <i className={`fab fa-whatsapp ${styles.icon}`}></i>
          ABRIR WHATSAPP
        </a>
      </div>
    </div>
  );
}