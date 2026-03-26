import Hero from "@/components/sections/Hero";
import FeaturedBooks from "@/components/sections/FeaturedBooks";
import LatestNews from "@/components/sections/LatestNews";
import AuthorsSection from "@/components/sections/AuthorsSection";
import PageTracker from "@/components/ui/PageTracker";
import { getBooks, getNews, getAuthors } from "@/lib/db";

export const revalidate = 3600;

export default async function HomePage() {
  const [books, news, authors] = await Promise.all([
    getBooks().catch(() => []),
    getNews().catch(() => []),
    getAuthors().catch(() => []),
  ]);

  const featuredBooks = books.filter((b) => b.featured);

  return (
    <>
      <PageTracker type="home" />
      <Hero />
      <FeaturedBooks books={featuredBooks} />
      <LatestNews news={news} />
      <AuthorsSection authors={authors} />
    </>
  );
}
