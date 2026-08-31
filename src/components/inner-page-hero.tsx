import Image from "next/image";
import Link from "next/link";

type InnerPageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  text: string;
  image: string;
  current: string;
};

export function InnerPageHero({ eyebrow, title, text, image, current }: InnerPageHeroProps) {
  return (
    <section className="inner-hero page-hero">
      <Image src={image} alt="" fill priority sizes="100vw" />
      <div className="inner-hero-shade" />
      <div className="container inner-hero-content">
        <nav className="breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><span>{current}</span></nav>
        <span className="eyebrow light">{eyebrow}</span><h1>{title}</h1><p>{text}</p>
      </div>
    </section>
  );
}
