import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Book, NewsItem, Author } from "@/types";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

function getText(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key];
  if (!prop) return "";
  if (prop.type === "title") return prop.title[0]?.plain_text ?? "";
  if (prop.type === "rich_text") return prop.rich_text[0]?.plain_text ?? "";
  if (prop.type === "select") return prop.select?.name ?? "";
  if (prop.type === "date") return prop.date?.start ?? "";
  if (prop.type === "checkbox") return String(prop.checkbox);
  return "";
}

function getFiles(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key];
  if (!prop || prop.type !== "files") return "";
  const file = prop.files[0];
  if (!file) return "";
  if (file.type === "external") return file.external.url;
  if (file.type === "file") return file.file.url;
  return "";
}

function getMultiSelect(page: PageObjectResponse, key: string): string[] {
  const prop = page.properties[key];
  if (!prop || prop.type !== "multi_select") return [];
  return prop.multi_select.map((s) => s.name);
}

function toSlug(title: string): string {
  return encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"));
}

export async function getBooks(): Promise<Book[]> {
  const res = await notion.databases.query({
    database_id: process.env.NOTION_BOOKS_DB_ID!,
    sorts: [{ property: "출판일", direction: "descending" }],
  });

  return (res.results as PageObjectResponse[]).map((page) => ({
    id: page.id,
    slug: toSlug(getText(page, "제목")),
    title: getText(page, "제목"),
    author: getText(page, "저자"),
    cover: getFiles(page, "표지"),
    description: getText(page, "소개"),
    publishedAt: getText(page, "출판일"),
    genre: getText(page, "장르"),
    featured: getText(page, "추천") === "true",
  }));
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const books = await getBooks();
  return books.find((b) => b.slug === slug) ?? null;
}

export async function getNews(): Promise<NewsItem[]> {
  const res = await notion.databases.query({
    database_id: process.env.NOTION_NEWS_DB_ID!,
    sorts: [{ property: "날짜", direction: "descending" }],
  });

  return (res.results as PageObjectResponse[]).map((page) => ({
    id: page.id,
    slug: toSlug(getText(page, "제목")),
    title: getText(page, "제목"),
    content: getText(page, "내용"),
    date: getText(page, "날짜"),
    category: getText(page, "카테고리"),
    thumbnail: getFiles(page, "썸네일"),
  }));
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const newsList = await getNews();
  return newsList.find((n) => n.slug === slug) ?? null;
}

export async function getAuthors(): Promise<Author[]> {
  const res = await notion.databases.query({
    database_id: process.env.NOTION_AUTHORS_DB_ID!,
  });

  return (res.results as PageObjectResponse[]).map((page) => ({
    id: page.id,
    name: getText(page, "이름"),
    photo: getFiles(page, "프로필 사진"),
    bio: getText(page, "소개"),
    books: getMultiSelect(page, "저서"),
  }));
}
