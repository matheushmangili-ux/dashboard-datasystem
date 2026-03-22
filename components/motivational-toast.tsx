"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const MOTIVATIONAL_QUOTES = [
  {
    text: "O sucesso nasce do querer, da determinacao e persistencia em se chegar a um objetivo.",
    author: "Jose de Alencar"
  },
  {
    text: "Grandes realizacoes nao sao feitas por impulso, mas por uma soma de pequenas realizacoes.",
    author: "Vincent van Gogh"
  },
  {
    text: "O unico lugar onde o sucesso vem antes do trabalho e no dicionario.",
    author: "Albert Einstein"
  },
  {
    text: "Acredite em voce mesmo e tudo sera possivel.",
    author: "Proverbio"
  },
  {
    text: "Nao espere por uma crise para descobrir o que e importante na sua vida.",
    author: "Platao"
  },
  {
    text: "A persistencia e o caminho do exito.",
    author: "Charles Chaplin"
  },
  {
    text: "So se pode alcancar um grande exito quando nos mantemos fieis a nos mesmos.",
    author: "Friedrich Nietzsche"
  },
  {
    text: "Quanto maior a dificuldade, maior o merito em supera-la.",
    author: "Epicuro"
  },
  {
    text: "O insucesso e apenas uma oportunidade para recomecar com mais inteligencia.",
    author: "Henry Ford"
  },
  {
    text: "Tudo o que um sonho precisa para ser realizado e alguem que acredite nele.",
    author: "Roberto Shinyashiki"
  },
  {
    text: "A motivacao e a arte de fazer as pessoas fazerem o que voce quer que elas facam porque elas querem fazer.",
    author: "Dwight Eisenhower"
  },
  {
    text: "Voce nunca sabe que resultados virao da sua acao. Mas se voce nao fizer nada, nao existirao resultados.",
    author: "Mahatma Gandhi"
  },
  {
    text: "O segredo do sucesso e a constancia do proposito.",
    author: "Benjamin Disraeli"
  },
  {
    text: "Ninguem pode voltar atras e fazer um novo comeco, mas qualquer um pode comecar agora e fazer um novo fim.",
    author: "Chico Xavier"
  },
  {
    text: "A melhor maneira de prever o futuro e cria-lo.",
    author: "Peter Drucker"
  },
  {
    text: "Venca a si mesmo e tera vencido seu maior adversario.",
    author: "Proverbio"
  },
  {
    text: "O que nao te desafia, nao te transforma.",
    author: "Proverbio"
  },
  {
    text: "Foco, forca e fe. O resto e consequencia.",
    author: "Proverbio"
  },
  {
    text: "Cada dia e uma nova oportunidade de mudar sua vida.",
    author: "Proverbio"
  },
  {
    text: "Trabalhe enquanto eles dormem. Estude enquanto eles se divertem. Persista enquanto eles descansam.",
    author: "Proverbio"
  }
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
      <div className="toast-container" onClick={(event) => event.stopPropagation()}>
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
            <Image
              src={PHOTO_PATH}
              alt="Fundador"
              className="toast-photo"
              fill
              sizes="160px"
              priority
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
