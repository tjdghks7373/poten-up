"use client";

import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import DatePicker from "@/components/ui/DatePicker";
import ImageUpload from "@/components/ui/ImageUpload";
import RichEditor from "@/components/ui/RichEditor";
import PreviewModal from "@/components/ui/PreviewModal";
import BookDetailView from "@/app/books/[slug]/BookDetailView";

interface BookRow {
  id: string;
  title: string;
  author: string;
  genre: string;
  cover: string;
  description: string;
  published_at: string;
  featured: boolean;
  is_new: boolean;
  shop_url: string;
}

const empty: Omit<BookRow, "id"> = {
  title: "",
  author: "",
  genre: "",
  cover: "",
  description: "",
  published_at: "",
  featured: false,
  is_new: false,
  shop_url: "",
};

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.brand};
  margin-bottom: 2rem;
`;

const Section = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.fg};
  margin-bottom: 1.25rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const Field = styled.div<{ $full?: boolean }>`
  ${({ $full }) => $full && "grid-column: 1 / -1;"}
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${theme.colors.muted};
  margin-bottom: 0.375rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${theme.colors.fg};
  background: ${theme.colors.bg};
  font-family: inherit;
  outline: none;

  &:focus {
    border-color: ${theme.colors.brand};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${theme.colors.fg};
  background: ${theme.colors.bg};
  font-family: inherit;
  outline: none;
  resize: vertical;
  min-height: 80px;

  &:focus {
    border-color: ${theme.colors.brand};
  }
`;

const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${theme.colors.fg};
  cursor: pointer;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
`;

const DraftBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  background: ${theme.colors.accent}18;
  border: 1px solid ${theme.colors.accent}44;
  border-radius: 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.8125rem;
`;

const DraftText = styled.span`
  flex: 1;
  color: ${theme.colors.fg};
`;

const DraftBtn = styled.button`
  font-size: 0.8125rem;
  font-family: inherit;
  font-weight: 600;
  color: ${theme.colors.brand};
  &:hover { text-decoration: underline; }
`;

const DraftDismiss = styled.button`
  font-size: 0.8125rem;
  font-family: inherit;
  color: ${theme.colors.muted};
  &:hover { color: ${theme.colors.fg}; }
`;

const AutoSaved = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.muted};
  margin-left: auto;
`;

const Btn = styled.button<{ $variant?: "danger" | "secondary" }>`
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.15s;
  background: ${({ $variant }) =>
    $variant === "danger" ? "#ef4444" :
    $variant === "secondary" ? theme.colors.bg : theme.colors.brand};
  color: ${({ $variant }) =>
    $variant === "secondary" ? theme.colors.fg : theme.colors.white};
  border: 1px solid ${({ $variant }) =>
    $variant === "secondary" ? theme.colors.border : "transparent"};

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid ${theme.colors.border};
  color: ${theme.colors.muted};
  font-weight: 500;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${theme.colors.border};
  color: ${theme.colors.fg};
`;

const ActionBtns = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmBtn = styled.button<{ $danger?: boolean }>`
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  border-radius: 0.375rem;
  font-family: inherit;
  background: ${({ $danger }) => $danger ? "#fee2e2" : theme.colors.brand + "1a"};
  color: ${({ $danger }) => $danger ? "#ef4444" : theme.colors.brand};
  transition: opacity 0.15s;

  &:hover { opacity: 0.75; }
`;

const Empty = styled.p`
  color: ${theme.colors.muted};
  font-size: 0.875rem;
  padding: 1rem 0;
`;

const DragRow = styled.tr<{ $dragging?: boolean }>`
  opacity: ${({ $dragging }) => $dragging ? 0.4 : 1};
  cursor: grab;
`;

const DragHandle = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${theme.colors.border};
  color: ${theme.colors.muted};
  font-size: 1rem;
  cursor: grab;
  user-select: none;
  width: 2rem;
`;

const TitleBtn = styled.button`
  text-align: left;
  color: ${theme.colors.fg};
  font-family: inherit;
  font-size: 0.875rem;
  transition: color 0.15s;

  &:hover {
    color: ${theme.colors.brand};
    text-decoration: underline;
  }
`;

const SaveOrderBtn = styled.button`
  padding: 0.375rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  background: ${theme.colors.accent};
  color: ${theme.colors.white};
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
`;

const DRAFT_KEY = "draft_book";

export default function BooksAdmin() {
  const [books, setBooks] = useState<BookRow[]>([]);
  const [form, setForm] = useState<Omit<BookRow, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [previewBook, setPreviewBook] = useState<BookRow | null>(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [hasDraft, setHasDraft] = useState(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const { form: saved } = JSON.parse(raw);
        return !!(saved?.title || saved?.author);
      }
    } catch {}
    return false;
  });
  const [draftSaved, setDraftSaved] = useState<string | null>(null);
  const dragIndex = useRef<number | null>(null);

  // 폼 변경 시 자동 임시저장 (새 항목 작성 중일 때만)
  useEffect(() => {
    if (editId) return;
    const hasContent = form.title || form.author || form.description;
    if (!hasContent) return;
    const timer = setTimeout(() => {
      const time = new Date().toLocaleTimeString("ko", { hour: "2-digit", minute: "2-digit" });
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, savedAt: time }));
      setDraftSaved(time);
    }, 1000);
    return () => clearTimeout(timer);
  }, [form, editId]);

  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const { form: saved } = JSON.parse(raw);
      setForm(saved);
      setHasDraft(false);
    } catch {}
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setDraftSaved(null);
  }

  async function load() {
    const res = await fetch("/api/admin/books");
    const data = await res.json();
    setBooks(Array.isArray(data) ? data : []);
    setOrderChanged(false);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  function startEdit(book: BookRow) {
    setEditId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      cover: book.cover,
      description: book.description,
      published_at: book.published_at,
      featured: book.featured,
      is_new: book.is_new,
      shop_url: book.shop_url,
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(empty);
    clearDraft();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      author: form.author,
      genre: form.genre,
      cover: form.cover,
      description: form.description,
      publishedAt: form.published_at,
      featured: form.featured,
      isNew: form.is_new,
      shopUrl: form.shop_url,
    };

    if (editId) {
      await fetch(`/api/admin/books/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    await load();
    cancelEdit();
    clearDraft();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
    await load();
  }

  function onDragStart(index: number) {
    dragIndex.current = index;
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    const next = [...books];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(index, 0, moved);
    dragIndex.current = index;
    setBooks(next);
    setOrderChanged(true);
  }

  async function saveOrder() {
    setSavingOrder(true);
    const order = books.map((b, i) => ({ id: b.id, sort_order: i }));
    await fetch("/api/admin/books/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order }),
    });
    setSavingOrder(false);
    setOrderChanged(false);
  }

  return (
    <>
      <PageTitle>도서 관리</PageTitle>

      <Section>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "1.25rem" }}>
          <SectionTitle style={{ marginBottom: 0 }}>{editId ? "도서 수정" : "도서 추가"}</SectionTitle>
          {!editId && draftSaved && <AutoSaved>임시저장됨 {draftSaved}</AutoSaved>}
        </div>
        {!editId && hasDraft && (
          <DraftBar>
            <DraftText>⚡ 작성 중이던 내용이 있습니다.</DraftText>
            <DraftBtn onClick={loadDraft}>불러오기</DraftBtn>
            <DraftDismiss onClick={clearDraft}>무시</DraftDismiss>
          </DraftBar>
        )}
        <form onSubmit={handleSubmit}>
          <Grid>
            <Field>
              <Label>제목 *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Field>
            <Field>
              <Label>저자 *</Label>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
            </Field>
            <Field>
              <Label>장르</Label>
              <Input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
            </Field>
            <Field>
              <Label>출판일</Label>
              <DatePicker value={form.published_at} onChange={(val) => setForm({ ...form, published_at: val })} />
            </Field>
            <Field $full>
              <Label>구매 링크 (쇼핑몰 URL)</Label>
              <Input value={form.shop_url} onChange={(e) => setForm({ ...form, shop_url: e.target.value })} placeholder="https://..." />
            </Field>
            <Field $full>
              <Label>표지 이미지</Label>
              <ImageUpload value={form.cover} onChange={(url) => setForm({ ...form, cover: url })} aspect="cover" />
            </Field>
            <Field $full>
              <Label>소개</Label>
              <RichEditor value={form.description} onChange={(html) => setForm({ ...form, description: html })} placeholder="도서 소개를 입력하세요..." />
            </Field>
            <Field $full>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <CheckLabel>
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  추천 도서
                </CheckLabel>
                <CheckLabel>
                  <input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} />
                  NEW
                </CheckLabel>
              </div>
            </Field>
          </Grid>
          <BtnRow>
            <Btn type="submit" disabled={saving}>{saving ? "저장 중..." : editId ? "수정 완료" : "추가"}</Btn>
            <Btn type="button" $variant="secondary" onClick={() => setPreview(true)}>미리보기</Btn>
            {editId && <Btn type="button" $variant="secondary" onClick={cancelEdit}>취소</Btn>}
          </BtnRow>
        </form>
      </Section>

      <Section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <SectionTitle style={{ marginBottom: 0 }}>도서 목록 ({books.length})</SectionTitle>
          {orderChanged && (
            <ActionBtns>
              <SaveOrderBtn onClick={saveOrder} disabled={savingOrder}>
                {savingOrder ? "저장 중..." : "순서 저장"}
              </SaveOrderBtn>
              <SmBtn onClick={() => { load(); }}>취소</SmBtn>
            </ActionBtns>
          )}
        </div>
        {books.length === 0 ? (
          <Empty>등록된 도서가 없습니다.</Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th style={{ width: "2rem" }}></Th>
                <Th>제목</Th>
                <Th>저자</Th>
                <Th>장르</Th>
                <Th>출판일</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, i) => (
                <DragRow
                  key={book.id}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={(e) => onDragOver(e, i)}
                  onDragEnd={() => { dragIndex.current = null; }}
                >
                  <DragHandle title="드래그하여 순서 변경">⠿</DragHandle>
                  <Td>
                    <TitleBtn onClick={() => setPreviewBook(book)}>{book.title}</TitleBtn>
                  </Td>
                  <Td>{book.author}</Td>
                  <Td>{book.genre}</Td>
                  <Td>{book.published_at}</Td>
                  <Td>
                    <ActionBtns>
                      <SmBtn onClick={() => startEdit(book)}>수정</SmBtn>
                      <SmBtn $danger onClick={() => handleDelete(book.id)}>삭제</SmBtn>
                    </ActionBtns>
                  </Td>
                </DragRow>
              ))}
            </tbody>
          </Table>
        )}
      </Section>

      {preview && (
        <PreviewModal onClose={() => setPreview(false)}>
          <BookDetailView book={{
            id: "preview",
            slug: "preview",
            title: form.title || "제목 없음",
            author: form.author || "",
            cover: form.cover || "",
            description: form.description || "",
            publishedAt: form.published_at || "",
            genre: form.genre || "",
            featured: form.featured,
            isNew: form.is_new,
            shopUrl: form.shop_url || "",
          }} />
        </PreviewModal>
      )}

      {previewBook && (
        <PreviewModal onClose={() => setPreviewBook(null)}>
          <BookDetailView book={{
            id: previewBook.id,
            slug: previewBook.id,
            title: previewBook.title,
            author: previewBook.author,
            cover: previewBook.cover,
            description: previewBook.description,
            publishedAt: previewBook.published_at,
            genre: previewBook.genre,
            featured: previewBook.featured,
            isNew: previewBook.is_new,
            shopUrl: previewBook.shop_url,
          }} />
        </PreviewModal>
      )}
    </>
  );
}
