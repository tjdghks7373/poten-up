import { getBooks } from "@/lib/db";
import BooksView from "./BooksView";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const books = await getBooks().catch(() => []);
  return <BooksView books={books} />;
}
