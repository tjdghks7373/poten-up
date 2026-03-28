import Hero from "@/components/sections/Hero";
import FeaturedBooks from "@/components/sections/FeaturedBooks";
import LatestNews from "@/components/sections/LatestNews";
import AuthorsSection from "@/components/sections/AuthorsSection";
import PageTracker from "@/components/ui/PageTracker";
import NewBookBanner from "@/components/ui/NewBookBanner";
import { getBooks, getNews, getAuthors } from "@/lib/db";

export const revalidate = 3600;

export default async function HomePage() {
  const [books, news, authors] = await Promise.all([
    getBooks().catch(() => []),
    getNews().catch(() => []),
    getAuthors().catch(() => []),
  ]);

  const featuredBooks = books.filter((b) => b.featured);
  const newBook = books.find((b) => b.isNew) ?? null;

  return (
    <>
      <PageTracker type="home" />
      {newBook && <NewBookBanner title={newBook.title} slug={newBook.slug} author={newBook.author} />}
      <Hero />
      <FeaturedBooks books={featuredBooks} />
      <LatestNews news={news} />
      <AuthorsSection authors={authors} />
    </>
  );
}
