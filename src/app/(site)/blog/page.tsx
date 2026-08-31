import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { InnerPageHero } from "@/components/inner-page-hero";
import { getBlogPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Блог о спецтехнике",
  description: "Практические материалы о выборе, покупке и эксплуатации спецтехники.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <main>
      <InnerPageHero eyebrow="БАЗА ЗНАНИЙ" title={<>Выбирайте технику<br />с пониманием</>} text="Короткие практические материалы без сложных терминов и рекламного шума." image="/images/products/excavator-city.jpg" current="Блог" />
      <section className="section section-light">
        <div className="container blog-list-grid">
          {posts.map((post, index) => (
            <article className={`blog-list-card ${index === 0 ? "featured" : ""}`} key={post.slug}>
              <Link className="blog-list-image" href={`/blog/${post.slug}`}><Image src={post.image} alt="" fill sizes={index === 0 ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 700px) 100vw, 33vw"} /></Link>
              <div><span>{post.category} · {post.readTime}</span><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><Link className="text-link" href={`/blog/${post.slug}`}>Читать статью <ArrowUpRight aria-hidden="true" /></Link></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
