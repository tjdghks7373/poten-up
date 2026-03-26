"use client";

import { useEffect } from "react";
import styled from "styled-components";
import { theme } from "@/lib/theme";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  overflow-y: auto;
`;

const Container = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const Bar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: ${theme.colors.brand};
  color: ${theme.colors.white};
`;

const BarTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
`;

const CloseBtn = styled.button`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-family: inherit;
  padding: 0.25rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0.375rem;
  transition: all 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: ${theme.colors.white};
  }
`;

const Content = styled.div`
  flex: 1;
  background: ${theme.colors.bg};
`;

interface Props {
  onClose: () => void;
  children: React.ReactNode;
}

export default function PreviewModal({ onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <Overlay>
      <Container>
        <Bar>
          <BarTitle>미리보기 (저장 전 임시 화면)</BarTitle>
          <CloseBtn onClick={onClose}>✕ 닫기</CloseBtn>
        </Bar>
        <Content>{children}</Content>
      </Container>
    </Overlay>
  );
}
