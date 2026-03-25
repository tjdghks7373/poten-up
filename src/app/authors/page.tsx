import Image from "next/image";
import { getAuthors } from "@/lib/notion";

export const revalidate = 3600;

export default async function AuthorsPage() {
  const authors = await getAuthors().catch(() => []);

  return (
    <div className="pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
      <h1 className="text-4xl font-bold text-[var(--brand)] mb-2">작가 소개</h1>
      <p className="text-[var(--muted)] mb-12">포텐업 출판사와 함께하는 작가들을 소개합니다.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {authors.map((author) => (
          <div
            key={author.id}
            className="flex gap-5 p-6 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--border)] relative shrink-0">
              {author.photo ? (
                <Image src={author.photo} alt={author.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xl font-bold">
                  {author.name[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-[var(--fg)] mb-1">{author.name}</h2>
              <p className="text-xs text-[var(--muted)] leading-relaxed mb-3 line-clamp-3">
                {author.bio}
              </p>
              {author.books.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {author.books.map((b) => (
                    <span
                      key={b}
                      className="text-xs px-2 py-0.5 rounded-full bg-[var(--brand)]/10 text-[var(--brand)]"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
