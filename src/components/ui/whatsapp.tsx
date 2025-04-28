"use client";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import styles from "../styles/Whatsapp.module.css";
/*import { useRouter } from "next/router";*/
import QRCode from 'qrcode';

/*interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark: string;
    light: string;
  };
}*/

export default function WhatsappPage() {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState<boolean>(false);
  const phoneNumber = "59169452022";
  /*const router = useRouter();*/

  useEffect(() => {
    if (!qrRef.current) return;

    const generateQR = async () => {
      try {
        await QRCode.toCanvas(
          qrRef.current, 
          `https://wa.me/${phoneNumber}`, 
          { 
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          }
        );
        setQrGenerated(true);
      } catch (error) {
        console.error("Error generando QR:", error);
      }
    };

    const timer = setTimeout(generateQR, 100);
    return () => clearTimeout(timer);
  }, [phoneNumber]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://wa.me/${phoneNumber}`)
      .then(() => alert("Enlace copiado al portapeles"))
      .catch(err => console.error("Error al copiar:", err));
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Chat por WhatsApp',
        text: 'Contáctame por WhatsApp',
        url: `https://wa.me/${phoneNumber}`,
      });
    } catch (err) {
      console.error("Error al compartir:", err);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Página de WhatsApp</title>
        <meta name="description" content="Contacta por WhatsApp usando nuestro generador de QR" />
      </Head>

      <header className={styles.header}>
        <nav>
          <ul className={styles.navLinks}>
            <li><a href="#">Services</a></li>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </nav>
        <a href="#" className={styles.btn}>
          <button>Contactar</button>
        </a>
      </header>

      <main>
        <h1>Contactar por WhatsApp</h1>
        <h5 className="subtitle centeredText">
          Escanee el código QR o haga clic en el botón para iniciar una conversación
        </h5>

        <div className={styles.buttonContainer}>
          <a
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            <i className={`fab fa-whatsapp ${styles.icon}`}></i> 
            Chatear por WhatsApp
          </a>
        </div>

        <div className={styles.qrContainer}>
          <canvas 
            ref={qrRef}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              display: qrGenerated ? "block" : "none",
              backgroundColor: "white"
            }}
            aria-label="Código QR para WhatsApp"
          />
          {!qrGenerated && <p>Generando código QR...</p>}
        </div>

        <div className={styles.buttonsContainer}>
          <button 
            className={styles.copyBtn}
            onClick={handleCopyLink}
          >
            <i className={`fas fa-copy ${styles.icon}`}></i> Copiar enlace
          </button>
          <button 
            className={styles.shareBtn}
            onClick={handleShare}
          >
            <i className={`fas fa-share-alt ${styles.icon}`}></i> Compartir
          </button>
        </div>
      </main>
    </div>
  );
}