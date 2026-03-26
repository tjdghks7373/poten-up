"use client";

import { useEffect } from "react";

export default function PageTracker({ type }: { type: string }) {
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug: null, title: type }),
    }).catch(() => {});
  }, [type]);

  return null;
}
