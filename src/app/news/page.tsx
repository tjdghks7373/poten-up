import { getNews } from "@/lib/db";
import NewsView from "./NewsView";

export const revalidate = 3600;

export default async function NewsPage() {
  const newsList = await getNews().catch(() => []);
  return <NewsView newsList={newsList} />;
}
