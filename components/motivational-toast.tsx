"use client";

import { useEffect, useState } from "react";

const MOTIVATIONAL_QUOTES = [
  { text: "O sucesso nasce do querer, da determinação e persistência em se chegar a um objetivo.", author: "José de Alencar" },
  { text: "Grandes realizações não são feitas por impulso, mas por uma soma de pequenas realizações.", author: "Vincent van Gogh" },
  { text: "O único lugar onde o sucesso vem antes do trabalho é no dicionário.", author: "Albert Einstein" },
  { text: "Acredite em você mesmo e tudo será possível.", author: "Provérbio" },
  { text: "Não espere por uma crise para descobrir o que é importante na sua vida.", author: "Platão" },
  { text: "A persistência é o caminho do êxito.", author: "Charles Chaplin" },
  { text: "Só se pode alcançar um grande êxito quando nos mantemos fiéis a nós mesmos.", author: "Friedrich Nietzsche" },
  { text: "Quanto maior a dificuldade, maior o mérito em superá-la.", author: "Epicuro" },
  { text: "O insucesso é apenas uma oportunidade para recomeçar com mais inteligência.", author: "Henry Ford" },
  { text: "Tudo o que um sonho precisa para ser realizado é alguém que acredite nele.", author: "Roberto Shinyashiki" },
  { text: "A motivação é a arte de fazer as pessoas fazerem o que você quer que elas façam porque elas querem fazer.", author: "Dwight Eisenhower" },
  { text: "Você nunca sabe que resultados virão da sua ação. Mas se você não fizer nada, não existirão resultados.", author: "Mahatma Gandhi" },
  { text: "O segredo do sucesso é a constância do propósito.", author: "Benjamin Disraeli" },
  { text: "Ninguém pode voltar atrás e fazer um novo começo, mas qualquer um pode começar agora e fazer um novo fim.", author: "Chico Xavier" },
  { text: "A melhor maneira de prever o futuro é criá-lo.", author: "Peter Drucker" },
  { text: "Vença a si mesmo e terá vencido seu maior adversário.", author: "Provérbio" },
  { text: "O que não te desafia, não te transforma.", author: "Provérbio" },
  { text: "Foco, força e fé. O resto é consequência.", author: "Provérbio" },
  { text: "Cada dia é uma nova oportunidade de mudar sua vida.", author: "Provérbio" },
  { text: "Trabalhe enquanto eles dormem. Estude enquanto eles se divertem. Persista enquanto eles descansam.", author: "Provérbio" }
];

const DISMISS_KEY = "pulse-toast-dismissed";
const PHOTO_PATH = "/founder-photo.png";

function getRandomQuote() {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
}

export function MotivationalToast() {
  const [visible, setVisible] = useState(false);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (!dismissed) {
      setQuote(getRandomQuote());
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  if (!visible) return null;

  return (
    <div className="toast-overlay" onClick={dismiss}>
      <div className="toast-container" onClick={(e) => e.stopPropagation()}>
        <button
          className="toast-close"
          onClick={dismiss}
          type="button"
          aria-label="Fechar"
        >
          &times;
        </button>

        <div className="toast-content">
          <div className="toast-photo-wrap">
            <img
              src={PHOTO_PATH}
              alt="Fundador"
              className="toast-photo"
            />
          </div>

          <div className="toast-quote-wrap">
            <div className="toast-speech-bubble">
              <p className="toast-quote-text">&ldquo;{quote.text}&rdquo;</p>
              <p className="toast-quote-author">&mdash; {quote.author}</p>
            </div>
            <p className="toast-signature">Texas Center Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
