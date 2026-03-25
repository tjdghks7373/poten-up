"use client";

import ReactDatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { theme } from "@/lib/theme";

registerLocale("ko", ko);

const Wrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
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
  }

  .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle {
    border-bottom-color: #1e3a5f !important;
    fill: #1e3a5f !important;
    color: #1e3a5f !important;
  }

  .react-datepicker {
    font-family: inherit;
    border-color: ${theme.colors.border};
    border-radius: 0.75rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }

  .react-datepicker__header {
    background: ${theme.colors.brand};
    border-bottom: none;
    border-radius: 0.75rem 0.75rem 0 0;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: ${theme.colors.white};
  }

  .react-datepicker__header__dropdown {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.25rem 0;
  }

  .react-datepicker__month-dropdown-container,
  .react-datepicker__year-dropdown-container {
    margin: 0;
  }

  .react-datepicker__month-select,
  .react-datepicker__year-select {
    background: rgba(255,255,255,0.15);
    color: ${theme.colors.white};
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 0.375rem;
    padding: 0.125rem 0.375rem;
    font-size: 0.875rem;
    font-family: inherit;
    outline: none;
    cursor: pointer;

    option {
      background: ${theme.colors.brand};
      color: ${theme.colors.white};
    }
  }

  .react-datepicker__navigation-icon::before {
    border-color: ${theme.colors.white};
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: ${theme.colors.brand};
    border-radius: 0.375rem;
  }

  .react-datepicker__day:hover {
    background: ${theme.colors.brand}22;
    border-radius: 0.375rem;
  }

  .react-datepicker__day--today {
    font-weight: 700;
    color: ${theme.colors.accent};
  }
`;

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function DatePicker({ value, onChange, placeholder }: Props) {
  const selected = value ? new Date(value) : null;

  return (
    <Wrapper>
      <ReactDatePicker
        selected={selected}
        onChange={(date: Date | null) => onChange(date ? date.toISOString().slice(0, 10) : "")}
        dateFormat="yyyy-MM-dd"
        locale="ko"
        placeholderText={placeholder ?? "날짜 선택"}
        dateFormatCalendar="yyyy년 M월"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
    </Wrapper>
  );
}
