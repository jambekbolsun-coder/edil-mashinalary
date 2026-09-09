"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export function LoginSubmit() {
  const { pending } = useFormStatus();
  return <button className="admin-login-submit" type="submit" disabled={pending} aria-busy={pending}>{pending ? <LoaderCircle className="spin" aria-hidden="true" /> : <span aria-hidden="true" className="admin-submit-dot" />}{pending ? "Проверяем доступ…" : "Войти в панель"}<ArrowRight aria-hidden="true" /></button>;
}
