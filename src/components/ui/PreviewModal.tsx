"use client";

import { useEffect } from "react";
import styled from "styled-components";
import { theme } from "@/lib/theme";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const Modal = styled.div`
  background: ${theme.colors.bg};
  border-radius: 1rem;
  width: 100%;
  max-width: 56rem;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: ${theme.colors.brand};
  color: ${theme.colors.white};
  flex-shrink: 0;
`;

const BarTitle = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
`;

const CloseBtn = styled.button`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.85);
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
  overflow-y: auto;
  flex: 1;
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
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Bar>
          <BarTitle>미리보기 (저장 전 임시 화면)</BarTitle>
          <CloseBtn onClick={onClose}>✕ 닫기</CloseBtn>
        </Bar>
        <Content>{children}</Content>
      </Modal>
    </Overlay>
  );
}
