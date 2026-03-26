import { notFound } from "next/navigation";
import { getBookBySlug } from "@/lib/db";
import BookDetailView from "./BookDetailView";

export const dynamic = "force-dynamic";

const BASE_URL = "https://poten-up.vercel.app";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: book.author,
    },
    datePublished: book.publishedAt,
    genre: book.genre,
    description: book.description.replace(/<[^>]*>/g, ""),
    image: book.cover || undefined,
    url: `${BASE_URL}/books/${book.slug}`,
    publisher: {
      "@type": "Organization",
      name: "포텐업 출판사",
      url: BASE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookDetailView book={book} />
    </>
  );
}
