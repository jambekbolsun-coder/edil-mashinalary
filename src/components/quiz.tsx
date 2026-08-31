"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  { question: "Для какой работы нужна техника?", options: ["Склад и хозяйство", "Стройка", "Карьер", "Земляные работы"] },
  { question: "Какой объём работы планируется?", options: ["Несколько часов в день", "Полная смена", "Две смены", "Пока не знаю"] },
  { question: "Когда нужна техника?", options: ["Сегодня или завтра", "В течение месяца", "Можно под заказ"] },
  { question: "Как планируете оплату?", options: ["Полная оплата", "Рассрочка", "Хочу сравнить условия"] },
];

export function Quiz() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (window.localStorage.getItem("edil-quiz-seen")) return;
    const timer = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const close = () => {
    setOpen(false);
    window.localStorage.setItem("edil-quiz-seen", "1");
  };

  const choose = (answer: string) => {
    setAnswers((current) => [...current.slice(0, step), answer]);
    if (step < steps.length) setStep((current) => current + 1);
  };

  if (!open) return null;

  const complete = step >= steps.length;
  return (
    <div className="quiz-overlay" role="presentation" onMouseDown={close}>
      <section className="quiz" role="dialog" aria-modal="true" aria-labelledby="quiz-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="quiz-visual">
          <Image src="/images/hero-warehouse.png" alt="Фронтальный погрузчик на складе Edil Mashinalary" fill sizes="(max-width: 760px) 100vw, 42vw" />
          <span>Подбор за 60 секунд</span>
        </div>
        <div className="quiz-content">
          <button className="icon-button quiz-close" onClick={close} aria-label="Закрыть квиз"><X aria-hidden="true" /></button>
          <div className="quiz-progress" aria-label={`Шаг ${Math.min(step + 1, steps.length)} из ${steps.length}`}>
            <span style={{ width: `${(Math.min(step + 1, steps.length) / steps.length) * 100}%` }} />
          </div>
          {!complete ? (
            <>
              <span className="eyebrow">ШАГ {step + 1} ИЗ {steps.length}</span>
              <h2 id="quiz-title">{steps[step].question}</h2>
              <div className="quiz-options">
                {steps[step].options.map((option) => (
                  <button key={option} onClick={() => choose(option)}>
                    <span>{option}</span><ArrowRight aria-hidden="true" />
                  </button>
                ))}
              </div>
              {step > 0 && <button className="quiz-back" onClick={() => setStep((value) => value - 1)}><ArrowLeft aria-hidden="true" />Назад</button>}
            </>
          ) : (
            <div className="quiz-complete">
              <Check aria-hidden="true" />
              <span className="eyebrow">ПОДБОР ГОТОВ</span>
              <h2 id="quiz-title">Покажем подходящие модели</h2>
              <p>Мы учли задачу, нагрузку, сроки и способ оплаты. В каталоге можно сразу сравнить варианты.</p>
              <Link href={`/catalog?task=${encodeURIComponent(answers[0] || "")}`} className="button" onClick={close}>Перейти в каталог <ArrowRight aria-hidden="true" /></Link>
              <Link href="/contacts" className="text-link" onClick={close}>Обсудить с менеджером</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
