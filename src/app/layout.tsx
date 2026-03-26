import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import StyledComponentsRegistry from "@/lib/registry";

export const metadata: Metadata = {
  title: "포텐업 출판사",
  description: "포텐업 출판사 공식 홈페이지",
  verification: {
    google: "ln8cXC2cxfZXikpa4sSsUZs7S0zxdsUs5FxHkbkheUY",
  },
  openGraph: {
    title: "포텐업 출판사",
    description: "포텐업 출판사 공식 홈페이지",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})()` }} />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
