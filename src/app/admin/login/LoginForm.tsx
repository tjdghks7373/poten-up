"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { theme } from "@/lib/theme";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.bg};
`;

const Card = styled.div`
  width: 100%;
  max-width: 360px;
  padding: 2.5rem;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.brand};
  margin-bottom: 0.5rem;
`;

const Sub = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.muted};
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.fg};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${theme.colors.fg};
  background: ${theme.colors.bg};
  outline: none;
  margin-bottom: 1.25rem;
  font-family: inherit;

  &:focus {
    border-color: ${theme.colors.brand};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${theme.colors.brand};
  color: ${theme.colors.white};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s;
  font-family: inherit;

  &:hover {
    background: ${theme.colors.brandLight};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const Error = styled.p`
  font-size: 0.875rem;
  color: #ef4444;
  margin-top: 0.75rem;
  text-align: center;
`;

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/books");
    } else {
      const data = await res.json();
      setError(data.error ?? "로그인 실패");
    }

    setLoading(false);
  }

  return (
    <Wrapper>
      <Card>
        <Title>포텐업 관리자</Title>
        <Sub>관리자 비밀번호를 입력하세요.</Sub>
        <form onSubmit={handleSubmit}>
          <Label>비밀번호</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <Button type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </Button>
          {error && <Error>{error}</Error>}
        </form>
      </Card>
    </Wrapper>
  );
}
