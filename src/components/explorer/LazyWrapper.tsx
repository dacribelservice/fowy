"use client";

import React, { useState, useEffect, useRef } from "react";

interface LazyWrapperProps {
  children: React.ReactNode;
  height?: string;
}

export function LazyWrapper({ children, height = "220px" }: LazyWrapperProps) {
  const [isIntersected, setIsIntersected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "150px", // Comienza a cargar cuando esté a 150px de entrar en pantalla
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!isIntersected) {
    return (
      <div
        ref={containerRef}
        style={{ height }}
        className="bg-white/80 backdrop-blur-md rounded-[28px] border border-white/60 p-3 space-y-3 animate-pulse"
      >
        {/* Skeleton de Imagen */}
        <div className="h-32 w-full bg-slate-200/50 rounded-2xl" />
        
        {/* Skeletons de Textos */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200/60 rounded-full w-5/6" />
          <div className="h-3 bg-slate-200/40 rounded-full w-2/3" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
