"use client";

import { useMemo, useState } from "react";
import { getImageCandidateUrls, resolveImageUrl } from "@/lib/utils";

interface SmartImageProps {
  src: string;
  alt: string;
  width?: number;
  className?: string;
  loading?: "eager" | "lazy";
  decoding?: "async" | "auto" | "sync";
}

export default function SmartImage({
  src,
  alt,
  width,
  className,
  loading = "lazy",
  decoding = "async",
}: SmartImageProps) {
  const candidates = useMemo(() => {
    if (!src) return [];
    if (!width) return [src];

    const resolved = resolveImageUrl(src, width);
    const list = getImageCandidateUrls(resolved, width);
    return list.length > 0 ? list : [resolved];
  }, [src, width]);

  const [idx, setIdx] = useState(0);
  const currentSrc = candidates[idx] || src;

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      onError={() => {
        if (idx < candidates.length - 1) setIdx(idx + 1);
      }}
    />
  );
}
