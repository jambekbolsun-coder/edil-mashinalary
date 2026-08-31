"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ru"><body><main className="not-found-page">
      <span>!</span><h1>Что-то пошло не так</h1><p>Обновите страницу или попробуйте ещё раз.</p>
      <button className="button" onClick={reset}>Повторить</button>
    </main></body></html>
  );
}
