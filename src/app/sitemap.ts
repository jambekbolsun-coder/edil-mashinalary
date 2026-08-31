import type { MetadataRoute } from "next";
import { blogPosts, equipment } from "@/lib/content";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edil-mashinalary.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/catalog", "/finance", "/service", "/about", "/blog", "/contacts"];
  return [
    ...staticPages.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: path === "/catalog" ? "daily" as const : "weekly" as const, priority: path === "" ? 1 : 0.8 })),
    ...equipment.filter((item) => item.published).map((item) => ({ url: `${baseUrl}/catalog/${item.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...blogPosts.map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
