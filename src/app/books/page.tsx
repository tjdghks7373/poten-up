import { getBooks } from "@/lib/notion";
import BooksView from "./BooksView";

export const revalidate = 3600;

export default async function BooksPage() {
  const books = await getBooks().catch(() => []);
  return <BooksView books={books} />;
}
