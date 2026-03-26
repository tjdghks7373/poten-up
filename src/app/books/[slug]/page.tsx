import { notFound } from "next/navigation";
import { getBookBySlug } from "@/lib/db";
import BookDetailView from "./BookDetailView";

export const dynamic = "force-dynamic";

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
