import { notFound } from "next/navigation";
import { getNews, getNewsBySlug } from "@/lib/db";
import NewsDetailView from "./NewsDetailView";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const newsList = await getNews();
    return newsList.map((n) => ({ slug: n.slug }));
  } catch {
    return [];
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  return <NewsDetailView item={item} />;
}
