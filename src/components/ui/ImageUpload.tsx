"use client";

import { useRef, useState } from "react";
import styled from "styled-components";
import { theme } from "@/lib/theme";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
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

const UploadBtn = styled.button<{ $loading?: boolean }>`
  padding: 0.5rem 0.875rem;
  background: ${theme.colors.brand}1a;
  color: ${theme.colors.brand};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  white-space: nowrap;
  transition: opacity 0.15s;
  flex-shrink: 0;

  &:hover {
    opacity: 0.75;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const Preview = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid ${theme.colors.border};
`;

const HiddenInput = styled.input`
  display: none;
`;

interface Props {
  value: string;
  onChange: (url: string) => void;
  aspect?: "square" | "cover";
}

async function resizeImage(file: File, maxWidth = 800, quality = 0.85): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => resolve(blob!), "image/jpeg", quality);
    };
    img.src = url;
  });
}

export default function ImageUpload({ value, onChange, aspect = "cover" }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const resized = await resizeImage(file);
    const formData = new FormData();
    formData.append("file", new File([resized], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (data.url) onChange(data.url);
    setLoading(false);
    e.target.value = "";
  }

  return (
    <Wrapper>
      <Row>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... 또는 파일 업로드"
        />
        <UploadBtn
          type="button"
          disabled={loading}
          onClick={() => fileRef.current?.click()}
        >
          {loading ? "업로드 중..." : "파일 선택"}
        </UploadBtn>
        <HiddenInput
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
        />
      </Row>
      {value && (
        <Preview
          src={value}
          alt="preview"
          style={{ aspectRatio: aspect === "cover" ? "3/4" : "1/1" }}
        />
      )}
    </Wrapper>
  );
}
