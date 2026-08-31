import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <span>404</span><h1>Такой страницы нет</h1>
      <p>Вернитесь в каталог — там собраны актуальные модели техники.</p>
      <Link href="/catalog" className="button">Открыть каталог</Link>
    </main>
  );
}
