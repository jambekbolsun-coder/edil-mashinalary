"use client";

import { Trash2 } from "lucide-react";

export function DestructiveSubmit({ label }: { label: string }) {
  return <button type="submit" aria-label={label} title={label} onClick={(event) => { if (!window.confirm("Удалить материал? Это действие нельзя отменить.")) event.preventDefault(); }}><Trash2 aria-hidden="true" /></button>;
}
