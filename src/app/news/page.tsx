import { getNews } from "@/lib/notion";
import NewsView from "./NewsView";

export const revalidate = 3600;

export default async function NewsPage() {
  const newsList = await getNews().catch(() => []);
  return <NewsView newsList={newsList} />;
}
