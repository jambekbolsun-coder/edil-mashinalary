"use client";

import { ArrowUpRight, LoaderCircle, MessageCircle, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { company } from "@/lib/content";
import type { Locale } from "@/lib/types";

type Props = {
  brand: string;
  name: string;
  slug: string;
};

const messageCopy: Record<Locale, (data: { brand: string; name: string; customer: string; phone: string; comment: string }) => string> = {
  ru: ({ brand, name, customer, phone, comment }) => `Здравствуйте! Хочу отправить заявку на ${brand} ${name}.\n\nИмя: ${customer}\nТелефон: ${phone}${comment ? `\nЗадача: ${comment}` : ""}`,
  ky: ({ brand, name, customer, phone, comment }) => `Саламатсызбы! ${brand} ${name} үчүн өтүнмө жөнөткүм келет.\n\nАты-жөнү: ${customer}\nТелефон: ${phone}${comment ? `\nМилдет: ${comment}` : ""}`,
  en: ({ brand, name, customer, phone, comment }) => `Hello! I would like to apply for ${brand} ${name}.\n\nName: ${customer}\nPhone: ${phone}${comment ? `\nTask: ${comment}` : ""}`,
  tr: ({ brand, name, customer, phone, comment }) => `Merhaba! ${brand} ${name} için başvuru göndermek istiyorum.\n\nAd: ${customer}\nTelefon: ${phone}${comment ? `\nİş: ${comment}` : ""}`,
  zh: ({ brand, name, customer, phone, comment }) => `您好！我想提交 ${brand} ${name} 的申请。\n\n姓名：${customer}\n电话：${phone}${comment ? `\n作业需求：${comment}` : ""}`,
};

export function WhatsAppRequestModal({ brand, name, slug }: Props) {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.classList.add("modal-open");
    const focusTimer = window.setTimeout(() => dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus(), 60);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href]");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [close, open]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const customer = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const comment = String(data.get("comment") ?? "").trim();
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customer,
          phone,
          comment,
          interest: slug,
          preference: "whatsapp",
          consent: true,
          source: `whatsapp-modal:${slug}`,
        }),
      });
      const result = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error || "Не удалось сохранить заявку");
      const message = messageCopy[locale]({ brand, name, customer, phone, comment });
      const whatsappLink = document.createElement("a");
      whatsappLink.href = `${company.whatsapp}?text=${encodeURIComponent(message)}`;
      whatsappLink.rel = "noreferrer";
      whatsappLink.click();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось отправить заявку. Попробуйте ещё раз.");
      setSending(false);
    }
  }

  return (
    <>
      <button className="button button-outline" type="button" onClick={() => setOpen(true)}>
        Отправить заявку <ArrowUpRight aria-hidden="true" />
      </button>
      {open && (
        <div className="request-modal-overlay" role="presentation" onMouseDown={close}>
          <section ref={dialogRef} className="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="request-modal-accent" aria-hidden="true"><MessageCircle /></div>
            <button className="icon-button request-modal-close" type="button" onClick={close} aria-label="Закрыть окно заявки"><X aria-hidden="true" /></button>
            <span className="eyebrow">ЗАЯВКА В WHATSAPP</span>
            <h2 id="request-modal-title">{brand} {name}</h2>
            <p>Оставьте контакты — сохраним заявку и сразу откроем готовое сообщение в WhatsApp.</p>
            <form onSubmit={submit}>
              {error && <div className="form-error" role="alert">{error}</div>}
              <div className="request-modal-fields">
                <label><span>Ваше имя *</span><input name="name" autoComplete="name" minLength={2} maxLength={90} required placeholder="Как к вам обращаться" /></label>
                <label><span>Телефон *</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" pattern="[+0-9()\-\s]{9,20}" required placeholder="+996 ___ ___ ___" /></label>
              </div>
              <label><span>Что должна делать техника?</span><textarea name="comment" rows={3} maxLength={600} placeholder="Коротко опишите задачу или задайте вопрос" /></label>
              <label className="consent-field"><input type="checkbox" required defaultChecked /><span>Согласен на обработку контактных данных *</span></label>
              <button className="button request-modal-submit" type="submit" disabled={sending}>
                {sending ? <LoaderCircle className="spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
                {sending ? "Готовим WhatsApp…" : "Отправить и перейти в WhatsApp"}
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
