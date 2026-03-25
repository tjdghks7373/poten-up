import { notFound } from "next/navigation";
import { getBooks, getBookBySlug } from "@/lib/notion";
import BookDetailView from "./BookDetailView";

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

  return <BookDetailView book={book} />;
}
