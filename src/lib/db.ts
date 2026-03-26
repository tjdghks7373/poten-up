import { supabase } from "./supabase";
import { Book, NewsItem, Author } from "@/types";

function toSlug(title: string): string {
  return encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"));
}

export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    author: row.author,
    cover: row.cover ?? "",
    description: row.description ?? "",
    publishedAt: row.published_at ?? "",
    genre: row.genre ?? "",
    featured: row.featured ?? false,
    isNew: row.is_new ?? false,
    shopUrl: row.shop_url ?? "",
  }));
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    author: data.author,
    cover: data.cover ?? "",
    description: data.description ?? "",
    publishedAt: data.published_at ?? "",
    genre: data.genre ?? "",
    featured: data.featured ?? false,
    isNew: data.is_new ?? false,
    shopUrl: data.shop_url ?? "",
  };
}

export async function getNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content ?? "",
    date: row.date ?? "",
    category: row.category ?? "",
    thumbnail: row.thumbnail ?? "",
  }));
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    content: data.content ?? "",
    date: data.date ?? "",
    category: data.category ?? "",
    thumbnail: data.thumbnail ?? "",
  };
}

export async function getAuthors(): Promise<Author[]> {
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    photo: row.photo ?? "",
    bio: row.bio ?? "",
    books: row.books ?? [],
  }));
}

export { toSlug };
