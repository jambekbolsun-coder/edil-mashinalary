"use client";

import { Camera, MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";
import { company } from "@/lib/content";

export function ChatAssistant({ answers }: { answers: [string, string][] }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("Здравствуйте! Помогу быстро найти технику и объясню условия покупки.");

  return (
    <div className="chat-widget">
      {open && (
        <section className="chat-panel" aria-label="Чат-помощник">
          <header>
            <div><span>EDIL ASSIST</span><strong>Помощник по технике</strong></div>
            <button onClick={() => setOpen(false)} aria-label="Закрыть чат"><X aria-hidden="true" /></button>
          </header>
          <div className="chat-answer" aria-live="polite"><p>{answer}</p></div>
          <div className="chat-questions">
            {answers.map(([question, response]) => (
              <button key={question} onClick={() => setAnswer(response)}>{question}</button>
            ))}
          </div>
          <footer>
            <a href={`${company.whatsapp}?text=${encodeURIComponent("Здравствуйте! Нужна помощь с выбором техники.")}`} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" />WhatsApp</a>
            <a href={company.instagram} target="_blank" rel="noreferrer"><Camera aria-hidden="true" />Instagram</a>
          </footer>
        </section>
      )}
      <button className="chat-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Закрыть помощника" : "Открыть помощника"}>
        {open ? <X aria-hidden="true" /> : <Send aria-hidden="true" />}
        {!open && <span>Есть вопрос?</span>}
      </button>
    </div>
  );
}
