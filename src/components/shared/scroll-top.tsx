"use client";

import { useEffect, useState } from "react";

import { ArrowUpIcon } from "~/components/shared/icons";
import { cn } from "~/utils/shadcn-helper";

import { Button } from "../shadcn/button";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function ScrollTop() {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Button
      className={cn(
        "fixed bottom-12 right-6 p-2 shadow-lg transition-opacity duration-200",
        showScrollButton ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      size="icon"
      onClick={scrollToTop}
    >
      <ArrowUpIcon className="w-5 h-5" />
      <span className="sr-only">Scroll to top</span>
    </Button>
  );
}