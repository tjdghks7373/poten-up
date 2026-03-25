import { notFound } from "next/navigation";
import { getNews, getNewsBySlug } from "@/lib/notion";

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

  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="mb-2">
        <span className="text-xs px-2 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] font-medium">
          {item.category}
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brand)] mt-4 mb-3 leading-tight">
        {item.title}
      </h1>
      <p className="text-sm text-[var(--muted)] mb-10">{item.date}</p>

      <div className="h-px bg-[var(--border)] mb-10" />

      <p className="text-[var(--fg)] leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
        {item.content}
      </p>
    </div>
  );
}
