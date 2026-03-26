# 포텐업 출판사 웹사이트

Next.js + Supabase + styled-components 기반 출판사 웹사이트

## 기술 스택

- **Next.js** (App Router)
- **styled-components** (SSR 지원)
- **Supabase** (PostgreSQL + Storage)
- **Tiptap** (리치 텍스트 에디터)
- **GSAP** (애니메이션)
- **react-datepicker** (날짜 선택)
- **recharts** (통계 차트)

## 주요 기능

### 공개 페이지
- 홈 — 추천 도서 / 최신 뉴스 / 작가 소개 (데이터 없으면 섹션 숨김)
- 도서 목록 — 제목·저자·장르 검색/필터, 페이지네이션 (10개)
- 도서 상세 — Schema.org 구조화 데이터, 카카오톡 공유, 링크 복사, 구매하기 버튼
- 뉴스 목록 — 페이지네이션 (10개)
- 뉴스 상세
- 작가 소개

### 관리자 페이지 (`/admin`)
- HMAC 토큰 인증, 로그인 시도 제한
- **도서 관리** — 추가/수정/삭제, 추천·NEW 뱃지, 구매 링크, 표지 이미지 업로드, 드래그&드롭 순서 변경, 저장 전 미리보기
- **뉴스 관리** — 추가/수정/삭제, 저장 전 미리보기
- **작가 관리** — 추가/수정/삭제
- **통계** — 일별 방문 추이, 섹션별 클릭 비율, 도서/뉴스 TOP 10, 카카오 공유/링크 복사 TOP 10, 날짜 범위 필터 (오늘/7일/30일/전체/직접 입력)

### 기타
- 이미지 업로드 시 클라이언트 자동 리사이징 (최대 800px, JPEG 85%)
- Google Search Console 사이트맵 등록 (`/sitemap.xml`)
- Vercel 자동 배포 (GitHub push 연동)

## DB 테이블 (Supabase)

| 테이블 | 주요 컬럼 |
|---|---|
| `books` | id, slug, title, author, cover, description, published_at, genre, featured, is_new, shop_url, sort_order |
| `news` | id, slug, title, content, date, category, thumbnail |
| `authors` | id, name, photo, bio, books |
| `page_views` | id, type, slug, title, created_at |

## 환경 변수

`.env.local` 파일에 아래 값 설정 필요:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
ADMIN_PASSWORD=
COOKIE_SECRET=
NEXT_PUBLIC_KAKAO_APP_KEY=
```

## 개발 서버 실행

```bash
npm run dev
```

## 배포

Vercel 연동 후 GitHub push 시 자동 배포
