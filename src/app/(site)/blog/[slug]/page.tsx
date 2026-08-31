import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { blogPosts } from "@/lib/content";

type PageProps = { params: Promise<{ slug: string }> };

const articleCopy = [
  { heading: "Начните с рабочей задачи", paragraphs: ["Запишите, какой материал предстоит перемещать, средний вес одной загрузки, высоту выгрузки и состояние площадки. Эти четыре параметра полезнее, чем выбор только по мощности двигателя.", "Если техника будет работать в узком дворе или помещении, отдельно измерьте проезды и разворотную площадку. Манёвренная модель нередко выполняет работу быстрее более крупной машины."] },
  { heading: "Считайте весь рабочий цикл", paragraphs: ["Сравнивайте не только цену покупки. В расчёт входят расход топлива, доступность расходников, время на смену навесного оборудования и возможный простой.", "Перед договором попросите менеджера зафиксировать комплектацию, гарантию, срок поставки и график платежей. Так коммерческое предложение останется понятным и после разговора."] },
  { heading: "Проверьте технику до передачи", paragraphs: ["Осмотрите гидравлические соединения, уровни жидкостей, работу света, камеры и органов управления. Сверьте серийные номера с документами и попросите показать базовые точки обслуживания.", "Сохраните контакты ответственного менеджера и договоритесь, какие данные нужны для сервисного обращения. Модель, фото таблички и короткое видео симптома обычно ускоряют консультацию."] },
] as const;

export function generateStaticParams() { return blogPosts.map((post) => ({ slug: post.slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, alternates: { canonical: `/blog/${slug}` } };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();
  const more = blogPosts.filter((item) => item.slug !== slug).slice(0, 2);
  return (
    <main className="article-page">
      <header className="article-hero">
        <Image src={post.image} alt="" fill priority sizes="100vw" />
        <div className="article-hero-shade" />
        <div className="container article-hero-content"><Link href="/blog"><ArrowLeft aria-hidden="true" />Все статьи</Link><span>{post.category} · {post.readTime}</span><h1>{post.title}</h1><p>{post.excerpt}</p></div>
      </header>
      <section className="section section-light"><article className="article-body container"><p className="article-lead">Правильная спецтехника экономит время только тогда, когда её возможности совпадают с реальной задачей. Ниже — понятная схема, которая помогает принять решение без спешки.</p>{articleCopy.map((block) => <section key={block.heading}><h2>{block.heading}</h2>{block.paragraphs.map((text) => <p key={text}>{text}</p>)}</section>)}<aside><strong>Нужна рекомендация по вашей площадке?</strong><p>Опишите материал, высоту выгрузки и график работы — менеджер предложит подходящие модели.</p><Link href="/catalog" className="button">Перейти в каталог <ArrowUpRight aria-hidden="true" /></Link></aside></article></section>
      <section className="section recommended-section"><div className="container"><div className="section-heading"><span className="eyebrow light">ЕЩЁ ПО ТЕМЕ</span><h2>Продолжить чтение</h2></div><div className="blog-grid">{more.map((item) => <article className="blog-card" key={item.slug}><Link className="blog-image" href={`/blog/${item.slug}`}><Image src={item.image} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" /></Link><div><span>{item.category} · {item.readTime}</span><h3><Link href={`/blog/${item.slug}`}>{item.title}</Link></h3><p>{item.excerpt}</p></div></article>)}</div></div></section>
      <section className="section lead-section"><div className="container lead-layout"><div className="lead-copy"><span className="eyebrow">КОНСУЛЬТАЦИЯ</span><h2>Обсудим технику для вашей работы</h2><p>Оставьте номер — зададим несколько уточняющих вопросов и предложим варианты.</p></div><LeadForm source={`blog:${post.slug}`} compact /></div></section>
    </main>
  );
}
