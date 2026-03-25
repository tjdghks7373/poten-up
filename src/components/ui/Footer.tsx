import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--brand)] text-white/70 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="text-white text-xl font-bold mb-2">포텐업</p>
            <p className="text-sm">좋은 글이 세상을 바꿉니다.</p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <p className="text-white font-medium mb-1">바로가기</p>
              <Link href="/books" className="hover:text-white transition-colors">도서 목록</Link>
              <Link href="/news" className="hover:text-white transition-colors">뉴스/공지</Link>
              <Link href="/authors" className="hover:text-white transition-colors">작가 소개</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 text-xs text-center">
          © {new Date().getFullYear()} 포텐업 출판사. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
