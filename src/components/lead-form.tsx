"use client";

import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { useState } from "react";
import { equipment } from "@/lib/content";

type FormStatus = "idle" | "loading" | "success" | "error";

export function LeadForm({ source = "site", compact = false }: { source?: string; compact?: boolean }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, consent: formData.get("consent") === "on", source }),
      });
      const result = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error || "Не удалось отправить заявку");
      setStatus("success");
      form.reset();
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Не удалось отправить заявку");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <strong>Спасибо! Менеджер скоро вам позвонит.</strong>
        <p>Заявка сохранена. Мы свяжемся с вами в рабочее время.</p>
        <button type="button" className="text-link" onClick={() => setStatus("idle")}>Отправить ещё одну</button>
      </div>
    );
  }

  return (
    <form className={`lead-form ${compact ? "compact" : ""}`} onSubmit={handleSubmit} noValidate>
      {status === "error" && <div className="form-error" role="alert" tabIndex={-1}>{error}</div>}
      <div className="field-grid">
        <label>
          <span>ФИО *</span>
          <input name="name" autoComplete="name" minLength={2} maxLength={90} required placeholder="Например, Азамат Ибраимов" />
        </label>
        <label>
          <span>Телефон *</span>
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" pattern="[+0-9()\-\s]{9,20}" required placeholder="+996 ___ ___ ___" />
        </label>
        {!compact && (
          <label>
            <span>Как удобнее связаться</span>
            <select name="preference" defaultValue="phone">
              <option value="phone">Позвонить</option>
              <option value="whatsapp">Написать в WhatsApp</option>
              <option value="instagram">Написать в Instagram</option>
            </select>
          </label>
        )}
        <label>
          <span>Интересующая техника</span>
          <select name="interest" defaultValue="">
            <option value="">Помогите выбрать</option>
            {equipment.map((item) => <option key={item.id} value={item.slug}>{item.brand} {item.name}</option>)}
          </select>
        </label>
      </div>
      <label>
        <span>Расскажите о задаче</span>
        <textarea name="comment" rows={compact ? 3 : 5} maxLength={1200} placeholder="Что нужно грузить, копать или перевозить? Какая площадка и объём работы?" />
      </label>
      <label className="consent-field">
        <input type="checkbox" name="consent" required />
        <span>Согласен на обработку контактных данных *</span>
      </label>
      <button className="button" disabled={status === "loading"} type="submit">
        {status === "loading" ? <LoaderCircle className="spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
        {status === "loading" ? "Отправляем…" : "Отправить заявку"}
      </button>
    </form>
  );
}
