import type { MetadataRoute } from "next";
import { getBlogPosts, getPublishedEquipment } from "@/lib/queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edil-mashinalary.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [equipment, blogPosts] = await Promise.all([getPublishedEquipment(), getBlogPosts()]);
  const staticPages = ["", "/catalog", "/finance", "/service", "/about", "/blog", "/contacts", "/privacy", "/cookies", "/terms", "/personal-data-consent"];
  return [
    ...staticPages.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: path === "/catalog" ? "daily" as const : "weekly" as const, priority: path === "" ? 1 : 0.8 })),
    ...equipment.map((item) => ({ url: `${baseUrl}/catalog/${item.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...blogPosts.map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
