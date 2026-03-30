"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import ImageUpload from "@/components/ui/ImageUpload";
import RichEditor from "@/components/ui/RichEditor";

interface AuthorRow {
  id: string;
  name: string;
  bio: string;
  photo: string;
  books: string[];
}

const empty: Omit<AuthorRow, "id"> = { name: "", bio: "", photo: "", books: [] };

const PageTitle = styled.h1`font-size:1.5rem;font-weight:700;color:${theme.colors.brand};margin-bottom:2rem;`;
const Section = styled.div`background:${theme.colors.white};border:1px solid ${theme.colors.border};border-radius:0.75rem;padding:1.5rem;margin-bottom:2rem;`;
const SectionTitle = styled.h2`font-size:1rem;font-weight:600;color:${theme.colors.fg};margin-bottom:1.25rem;`;
const Grid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:1rem;`;
const Field = styled.div<{ $full?: boolean }>`${({ $full }) => $full && "grid-column:1/-1;"}`;
const Label = styled.label`display:block;font-size:0.75rem;font-weight:500;color:${theme.colors.muted};margin-bottom:0.375rem;`;
const Input = styled.input`width:100%;padding:0.5rem 0.75rem;border:1px solid ${theme.colors.border};border-radius:0.5rem;font-size:0.875rem;color:${theme.colors.fg};background:${theme.colors.bg};font-family:inherit;outline:none;&:focus{border-color:${theme.colors.brand};}`;
const Textarea = styled.textarea`width:100%;padding:0.5rem 0.75rem;border:1px solid ${theme.colors.border};border-radius:0.5rem;font-size:0.875rem;color:${theme.colors.fg};background:${theme.colors.bg};font-family:inherit;outline:none;resize:vertical;min-height:80px;&:focus{border-color:${theme.colors.brand};}`;
const BtnRow = styled.div`display:flex;gap:0.75rem;margin-top:1.25rem;`;
const Btn = styled.button<{ $variant?: "secondary" }>`padding:0.5rem 1.25rem;border-radius:0.5rem;font-size:0.875rem;font-weight:500;font-family:inherit;transition:opacity 0.15s;background:${({ $variant }) => $variant === "secondary" ? theme.colors.bg : theme.colors.brand};color:${({ $variant }) => $variant === "secondary" ? theme.colors.fg : theme.colors.white};border:1px solid ${({ $variant }) => $variant === "secondary" ? theme.colors.border : "transparent"};&:hover{opacity:0.85;}&:disabled{opacity:0.5;}`;
const Table = styled.table`width:100%;border-collapse:collapse;font-size:0.875rem;`;
const Th = styled.th`text-align:left;padding:0.625rem 0.75rem;border-bottom:1px solid ${theme.colors.border};color:${theme.colors.muted};font-weight:500;`;
const Td = styled.td`padding:0.75rem;border-bottom:1px solid ${theme.colors.border};color:${theme.colors.fg};`;
const ActionBtns = styled.div`display:flex;gap:0.5rem;`;
const SmBtn = styled.button<{ $danger?: boolean }>`padding:0.25rem 0.625rem;font-size:0.75rem;border-radius:0.375rem;font-family:inherit;background:${({ $danger }) => $danger ? "#fee2e2" : theme.colors.brand + "1a"};color:${({ $danger }) => $danger ? "#ef4444" : theme.colors.brand};&:hover{opacity:0.75;}`;
const Empty = styled.p`color:${theme.colors.muted};font-size:0.875rem;padding:1rem 0;`;
const Hint = styled.p`font-size:0.75rem;color:${theme.colors.muted};margin-top:0.25rem;`;

export default function AuthorsAdmin() {
  const [authors, setAuthors] = useState<AuthorRow[]>([]);
  const [form, setForm] = useState<Omit<AuthorRow, "id">>(empty);
  const [booksInput, setBooksInput] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/authors");
    setAuthors(await res.json());
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  function startEdit(author: AuthorRow) {
    setEditId(author.id);
    setForm({ name: author.name, bio: author.bio, photo: author.photo, books: author.books });
    setBooksInput(author.books.join(", "));
  }

  function cancelEdit() { setEditId(null); setForm(empty); setBooksInput(""); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const books = booksInput.split(",").map((s) => s.trim()).filter(Boolean);
    const payload = { ...form, books };
    const url = editId ? `/api/admin/authors/${editId}` : "/api/admin/authors";
    await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
    cancelEdit();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/admin/authors/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <PageTitle>작가 관리</PageTitle>
      <Section>
        <SectionTitle>{editId ? "작가 수정" : "작가 추가"}</SectionTitle>
        <form onSubmit={handleSubmit}>
          <Grid>
            <Field>
              <Label>이름 *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Field>
            <Field>
              <Label>프로필 사진</Label>
              <ImageUpload value={form.photo} onChange={(url) => setForm({ ...form, photo: url })} aspect="square" />
            </Field>
            <Field $full>
              <Label>소개</Label>
              <RichEditor value={form.bio} onChange={(html) => setForm({ ...form, bio: html })} placeholder="작가 소개를 입력하세요..." />
            </Field>
            <Field $full>
              <Label>저서 (쉼표로 구분)</Label>
              <Input value={booksInput} onChange={(e) => setBooksInput(e.target.value)} placeholder="책 제목1, 책 제목2" />
              <Hint>쉼표(,)로 구분해서 입력하세요.</Hint>
            </Field>
          </Grid>
          <BtnRow>
            <Btn type="submit" disabled={saving}>{saving ? "저장 중..." : editId ? "수정 완료" : "추가"}</Btn>
            {editId && <Btn type="button" $variant="secondary" onClick={cancelEdit}>취소</Btn>}
          </BtnRow>
        </form>
      </Section>
      <Section>
        <SectionTitle>작가 목록 ({authors.length})</SectionTitle>
        {authors.length === 0 ? <Empty>등록된 작가가 없습니다.</Empty> : (
          <Table>
            <thead><tr><Th>이름</Th><Th>소개</Th><Th>저서</Th><Th></Th></tr></thead>
            <tbody>
              {authors.map((a) => (
                <tr key={a.id}>
                  <Td>{a.name}</Td>
                  <Td>{a.bio?.slice(0, 40)}{a.bio?.length > 40 ? "..." : ""}</Td>
                  <Td>{a.books?.join(", ")}</Td>
                  <Td><ActionBtns><SmBtn onClick={() => startEdit(a)}>수정</SmBtn><SmBtn $danger onClick={() => handleDelete(a.id)}>삭제</SmBtn></ActionBtns></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Section>
    </>
  );
}
