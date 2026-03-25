# 포텐업 출판사 웹사이트

Next.js + Supabase + styled-components 기반 출판사 웹사이트

## 기술 스택

- **Next.js** (App Router)
- **styled-components** (SSR 지원)
- **Supabase** (PostgreSQL + Storage)
- **Tiptap** (리치 텍스트 에디터)
- **GSAP** (애니메이션)

## 주요 기능

- 도서 / 뉴스 / 작가 소개 페이지
- 관리자 페이지 (`/admin`) - HMAC 토큰 인증, 로그인 시도 제한
- 이미지 업로드 (Supabase Storage)
- 리치 텍스트 에디터 (굵기, 기울기, 컬러, 폰트 크기 등)
- 추천 도서 / NEW 뱃지 관리

## 환경 변수

`.env.local` 파일에 아래 값 설정 필요:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
ADMIN_PASSWORD=
COOKIE_SECRET=
```

## 개발 서버 실행

```bash
npm run dev
```

## 배포

Vercel 연동 후 GitHub push 시 자동 배포
