"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface ReelDeepLinkHandlerProps {
  onOpenReelId: (reelId: string) => void;
}

export function ReelDeepLinkHandler({ onOpenReelId }: ReelDeepLinkHandlerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const reelId = searchParams.get("reel");
    if (reelId) {
      onOpenReelId(reelId);
    }
  }, [searchParams, onOpenReelId]);

  return null;
}
