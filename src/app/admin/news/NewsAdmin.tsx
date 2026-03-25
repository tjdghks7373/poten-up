"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import DatePicker from "@/components/ui/DatePicker";
import RichEditor from "@/components/ui/RichEditor";

interface NewsRow {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  thumbnail: string;
}

const empty: Omit<NewsRow, "id"> = {
  title: "",
  category: "",
  date: "",
  content: "",
  thumbnail: "",
};

const PageTitle = styled.h1`font-size:1.5rem;font-weight:700;color:${theme.colors.brand};margin-bottom:2rem;`;
const Section = styled.div`background:${theme.colors.white};border:1px solid ${theme.colors.border};border-radius:0.75rem;padding:1.5rem;margin-bottom:2rem;`;
const SectionTitle = styled.h2`font-size:1rem;font-weight:600;color:${theme.colors.fg};margin-bottom:1.25rem;`;
const Grid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:1rem;`;
const Field = styled.div<{ $full?: boolean }>`${({ $full }) => $full && "grid-column:1/-1;"}`;
const Label = styled.label`display:block;font-size:0.75rem;font-weight:500;color:${theme.colors.muted};margin-bottom:0.375rem;`;
const Input = styled.input`width:100%;padding:0.5rem 0.75rem;border:1px solid ${theme.colors.border};border-radius:0.5rem;font-size:0.875rem;color:${theme.colors.fg};background:${theme.colors.bg};font-family:inherit;outline:none;&:focus{border-color:${theme.colors.brand};}`;
const Textarea = styled.textarea`width:100%;padding:0.5rem 0.75rem;border:1px solid ${theme.colors.border};border-radius:0.5rem;font-size:0.875rem;color:${theme.colors.fg};background:${theme.colors.bg};font-family:inherit;outline:none;resize:vertical;min-height:120px;&:focus{border-color:${theme.colors.brand};}`;
const BtnRow = styled.div`display:flex;gap:0.75rem;margin-top:1.25rem;`;
const Btn = styled.button<{ $variant?: "secondary" }>`padding:0.5rem 1.25rem;border-radius:0.5rem;font-size:0.875rem;font-weight:500;font-family:inherit;transition:opacity 0.15s;background:${({ $variant }) => $variant === "secondary" ? theme.colors.bg : theme.colors.brand};color:${({ $variant }) => $variant === "secondary" ? theme.colors.fg : theme.colors.white};border:1px solid ${({ $variant }) => $variant === "secondary" ? theme.colors.border : "transparent"};&:hover{opacity:0.85;}&:disabled{opacity:0.5;}`;
const Table = styled.table`width:100%;border-collapse:collapse;font-size:0.875rem;`;
const Th = styled.th`text-align:left;padding:0.625rem 0.75rem;border-bottom:1px solid ${theme.colors.border};color:${theme.colors.muted};font-weight:500;`;
const Td = styled.td`padding:0.75rem;border-bottom:1px solid ${theme.colors.border};color:${theme.colors.fg};`;
const ActionBtns = styled.div`display:flex;gap:0.5rem;`;
const SmBtn = styled.button<{ $danger?: boolean }>`padding:0.25rem 0.625rem;font-size:0.75rem;border-radius:0.375rem;font-family:inherit;background:${({ $danger }) => $danger ? "#fee2e2" : theme.colors.brand + "1a"};color:${({ $danger }) => $danger ? "#ef4444" : theme.colors.brand};&:hover{opacity:0.75;}`;
const Empty = styled.p`color:${theme.colors.muted};font-size:0.875rem;padding:1rem 0;`;

export default function NewsAdmin() {
  const [newsList, setNewsList] = useState<NewsRow[]>([]);
  const [form, setForm] = useState<Omit<NewsRow, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/news");
    setNewsList(await res.json());
  }

  useEffect(() => { load(); }, []);

  function startEdit(item: NewsRow) {
    setEditId(item.id);
    setForm({ title: item.title, category: item.category, date: item.date, content: item.content, thumbnail: item.thumbnail });
  }

  function cancelEdit() { setEditId(null); setForm(empty); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = editId ? `/api/admin/news/${editId}` : "/api/admin/news";
    await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    await load();
    cancelEdit();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <PageTitle>뉴스/공지 관리</PageTitle>
      <Section>
        <SectionTitle>{editId ? "수정" : "새 뉴스 추가"}</SectionTitle>
        <form onSubmit={handleSubmit}>
          <Grid>
            <Field $full>
              <Label>제목 *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Field>
            <Field>
              <Label>카테고리</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="공지, 이벤트, ..." />
            </Field>
            <Field>
              <Label>날짜</Label>
              <DatePicker value={form.date} onChange={(val) => setForm({ ...form, date: val })} />
            </Field>
            <Field $full>
              <Label>내용</Label>
              <RichEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} placeholder="뉴스 내용을 입력하세요..." />
            </Field>
          </Grid>
          <BtnRow>
            <Btn type="submit" disabled={saving}>{saving ? "저장 중..." : editId ? "수정 완료" : "추가"}</Btn>
            {editId && <Btn type="button" $variant="secondary" onClick={cancelEdit}>취소</Btn>}
          </BtnRow>
        </form>
      </Section>
      <Section>
        <SectionTitle>목록 ({newsList.length})</SectionTitle>
        {newsList.length === 0 ? <Empty>등록된 뉴스가 없습니다.</Empty> : (
          <Table>
            <thead><tr><Th>제목</Th><Th>카테고리</Th><Th>날짜</Th><Th></Th></tr></thead>
            <tbody>
              {newsList.map((item) => (
                <tr key={item.id}>
                  <Td>{item.title}</Td>
                  <Td>{item.category}</Td>
                  <Td>{item.date}</Td>
                  <Td><ActionBtns><SmBtn onClick={() => startEdit(item)}>수정</SmBtn><SmBtn $danger onClick={() => handleDelete(item.id)}>삭제</SmBtn></ActionBtns></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Section>
    </>
  );
}
