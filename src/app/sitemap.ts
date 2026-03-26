import type { MetadataRoute } from "next";
import { getBooks, getNews } from "@/lib/db";

export const dynamic = "force-dynamic";

const BASE_URL = "https://poten-up.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [books, news] = await Promise.all([
    getBooks().catch(() => []),
    getNews().catch(() => []),
  ]);

  const bookUrls = books.map((b) => ({
    url: `${BASE_URL}/books/${b.slug}`,
    lastModified: b.publishedAt ? new Date(b.publishedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const newsUrls = news.map((n) => ({
    url: `${BASE_URL}/news/${n.slug}`,
    lastModified: n.date ? new Date(n.date) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/books`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/authors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...bookUrls,
    ...newsUrls,
  ];
}
