import Link from "next/link";
import { getNews } from "@/lib/notion";

export const revalidate = 3600;

export default async function NewsPage() {
  const newsList = await getNews().catch(() => []);

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      <h1 className="text-4xl font-bold text-[var(--brand)] mb-2">뉴스 / 공지</h1>
      <p className="text-[var(--muted)] mb-12">포텐업 출판사의 최신 소식을 확인하세요.</p>

      <div className="divide-y divide-[var(--border)]">
        {newsList.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className="flex items-center justify-between py-5 group"
          >
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-xs px-2 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] font-medium shrink-0">
                {item.category}
              </span>
              <p className="text-sm sm:text-base font-medium text-[var(--fg)] group-hover:text-[var(--brand)] transition-colors">
                {item.title}
              </p>
            </div>
            <span className="text-xs text-[var(--muted)] shrink-0 ml-4">{item.date}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
