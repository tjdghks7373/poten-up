import Hero from "@/components/sections/Hero";
import FeaturedBooks from "@/components/sections/FeaturedBooks";
import LatestNews from "@/components/sections/LatestNews";
import AuthorsSection from "@/components/sections/AuthorsSection";
import { getBooks, getNews, getAuthors } from "@/lib/notion";

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
      <Hero />
      <FeaturedBooks books={featuredBooks.length > 0 ? featuredBooks : books} />
      <LatestNews news={news} />
      <AuthorsSection authors={authors} />
    </>
  );
}
