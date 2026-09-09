"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";
import { company } from "@/lib/content";
import type { CompanyInfo } from "@/lib/queries";
import { trackEvent } from "@/lib/analytics-client";

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
}

export function ChatAssistant({ answers, companyInfo = company }: { answers: [string, string][]; companyInfo?: CompanyInfo }) {
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
            <a href={`${companyInfo.whatsapp}?text=${encodeURIComponent("Здравствуйте! Нужна помощь с выбором техники.")}`} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" />WhatsApp</a>
            <a href={companyInfo.instagram} target="_blank" rel="noreferrer"><InstagramIcon />Instagram</a>
          </footer>
        </section>
      )}
      {!open && <nav className="social-dock" aria-label="Быстрая связь">
        <a className="social-button whatsapp" href={`${companyInfo.whatsapp}?text=${encodeURIComponent("Здравствуйте! Нужна консультация по спецтехнике.")}`} target="_blank" rel="noreferrer" aria-label="Написать в WhatsApp" onClick={() => void trackEvent("whatsapp_clicked", { location: "floating_dock" })}><MessageCircle aria-hidden="true" /><span>WhatsApp</span></a>
        <a className="social-button instagram" href={companyInfo.instagram} target="_blank" rel="noreferrer" aria-label="Открыть Instagram" onClick={() => void trackEvent("instagram_clicked", { location: "floating_dock" })}><InstagramIcon /><span>Instagram</span></a>
      </nav>}
      <button className="chat-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Закрыть помощника" : "Открыть помощника"}>
        {open ? <X aria-hidden="true" /> : <Send aria-hidden="true" />}
        {!open && <span>Есть вопрос?</span>}
      </button>
    </div>
  );
}
