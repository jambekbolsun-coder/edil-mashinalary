"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function LoginFields() {
  const [showPassword, setShowPassword] = useState(false);
  return <>
    <label htmlFor="admin-email">Email<input id="admin-email" type="email" name="email" autoComplete="username" inputMode="email" required placeholder="name@company.com" /></label>
    <label htmlFor="admin-password">Пароль<span className="admin-password-field"><input id="admin-password" type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" required placeholder="Введите пароль" /><button type="button" aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></span></label>
  </>;
}
