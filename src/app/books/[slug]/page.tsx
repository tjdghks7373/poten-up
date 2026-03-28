import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBookBySlug } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import BookDetailView from "./BookDetailView";

export const dynamic = "force-dynamic";

const BASE_URL = "https://poten-up.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabaseAdmin
    .from("books")
    .select("title, author, genre, description, cover, slug")
    .eq("slug", slug)
    .single();
  if (!data) return {};

  const plainDesc = data.description.replace(/<[^>]*>/g, "").trim();
  const description = [
    data.author,
    data.genre,
    plainDesc ? plainDesc.slice(0, 120) + (plainDesc.length > 120 ? "..." : "") : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    title: `${data.title} | 포텐업 출판사`,
    description,
    openGraph: {
      title: data.title,
      description,
      images: data.cover ? [{ url: data.cover }] : [],
      url: `${BASE_URL}/books/${data.slug}`,
    },
  };
}

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
