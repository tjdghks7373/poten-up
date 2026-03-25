import Image from "next/image";
import { notFound } from "next/navigation";
import { getBooks, getBookBySlug } from "@/lib/notion";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const books = await getBooks();
    return books.map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row gap-10">
        <div className="w-48 sm:w-56 shrink-0 mx-auto sm:mx-0">
          <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-[var(--border)] shadow-lg">
            {book.cover ? (
              <Image src={book.cover} alt={book.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                표지 없음
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <p className="text-sm text-[var(--accent)] font-medium mb-2">{book.genre}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brand)] mb-2 leading-tight">
            {book.title}
          </h1>
          <p className="text-[var(--muted)] mb-1">{book.author}</p>
          <p className="text-sm text-[var(--muted)] mb-8">{book.publishedAt} 출판</p>

          <div className="h-px bg-[var(--border)] mb-8" />

          <p className="text-[var(--fg)] leading-relaxed text-sm sm:text-base">
            {book.description}
          </p>
        </div>
      </div>
    </div>
  );
}
