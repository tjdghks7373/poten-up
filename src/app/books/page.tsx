import Image from "next/image";
import Link from "next/link";
import { getBooks } from "@/lib/notion";

export const revalidate = 3600;

export default async function BooksPage() {
  const books = await getBooks().catch(() => []);

  return (
    <div className="pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
      <h1 className="text-4xl font-bold text-[var(--brand)] mb-2">도서 목록</h1>
      <p className="text-[var(--muted)] mb-12">포텐업 출판사의 모든 도서를 만나보세요.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map((book) => (
          <Link key={book.id} href={`/books/${book.slug}`} className="group">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-[var(--border)] mb-3 shadow-sm group-hover:shadow-md transition-shadow">
              {book.cover ? (
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-sm">
                  표지 없음
                </div>
              )}
            </div>
            <p className="text-xs text-[var(--accent)] font-medium mb-1">{book.genre}</p>
            <h2 className="text-sm font-semibold text-[var(--fg)] leading-snug mb-0.5 group-hover:text-[var(--brand)] transition-colors">
              {book.title}
            </h2>
            <p className="text-xs text-[var(--muted)]">{book.author}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
