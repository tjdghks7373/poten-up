import { getAuthors } from "@/lib/notion";
import AuthorsView from "./AuthorsView";

export const revalidate = 3600;

export default async function AuthorsPage() {
  const authors = await getAuthors().catch(() => []);
  return <AuthorsView authors={authors} />;
}
