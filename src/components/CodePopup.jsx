"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "./Modal";
import IconButton from "./ui/IconButton";

function highlightSearch(text, query) {
  if (!query) return [text];
  const escaped = query.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="rounded-sm bg-[#3B82F6]/20 text-[#F8FAFC]">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export default function CodePopup({
  code,
  onClose,
  alternatives = [],
  onSelectAlternative,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [wordWrap, setWordWrap] = useState(true);
  const [activeLine, setActiveLine] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleResize = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleResize);
    } else {
      mediaQuery.addListener(handleResize);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleResize);
      } else {
        mediaQuery.removeListener(handleResize);
      }
    };
  }, []);

  const lines = useMemo(() => code?.snippet?.split(/\r?\n/) || [""], [code]);

  const supportedTags = useMemo(() => {
    const tags = [];
    if (code.language) tags.push({ label: code.language, tone: "primary" });
    if (code.difficulty)
      tags.push({ label: `Difficulty: ${code.difficulty}`, tone: "warning" });
    if (code.complexity)
      tags.push({ label: code.complexity, tone: "secondary" });
    if (code.tags) {
      code.tags.forEach((tag) => tags.push({ label: tag, tone: "muted" }));
    }
    return tags;
  }, [code]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.snippet || "");
  };

  const handleDownload = () => {
    const blob = new Blob([code.snippet || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${code.label || "solution"}.${code.language?.toLowerCase() || "txt"}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const activeIndex = alternatives.findIndex(
    (item) => item.label === code.label,
  );
  const previousCode = alternatives[activeIndex - 1];
  const nextCode = alternatives[activeIndex + 1];

  return (
    <Modal onClose={onClose}>
      <div
        className={`relative h-[90vh] w-full ${isFullscreen ? "max-w-[100vw]" : "max-w-[1120px]"}`}
      >
        <div className="flex flex-col gap-4 rounded-[20px] bg-[#0F172A] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.25)] h-full">
          {!isMobile && (
            <div className="sticky top-0 z-10 rounded-[20px] border border-white/10 bg-[#0F172A] px-4 py-4 shadow-sm shadow-[#020617]/50 backdrop-blur-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#94A3B8]">
                    Code reader
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <h3 className="truncate text-2xl font-semibold text-white">
                      {code.label}
                    </h3>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.35em] text-[#94A3B8]">
                      {code.language || "Plain text"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <IconButton
                    icon={<span>⎘</span>}
                    label="Copy"
                    onClick={handleCopy}
                    className="text-[#F8FAFC]"
                  />
                  <IconButton
                    icon={<span>⬇</span>}
                    label="Download"
                    onClick={handleDownload}
                    className="text-[#F8FAFC]"
                  />
                  <IconButton
                    icon={<span>{wordWrap ? "↔" : "↔"}</span>}
                    label={wordWrap ? "Wrap on" : "Wrap off"}
                    onClick={() => setWordWrap((current) => !current)}
                    className="text-[#F8FAFC]"
                  />
                  <IconButton
                    icon={<span>⤢</span>}
                    label={isFullscreen ? "Exit" : "Fullscreen"}
                    onClick={() => setIsFullscreen((current) => !current)}
                    className="text-[#F8FAFC]"
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                <div className="rounded-[18px] border border-white/10 bg-[#111827] px-4 py-3">
                  <label className="text-xs uppercase tracking-[0.35em] text-[#94A3B8]">
                    Search code
                  </label>
                  <input
                    ref={searchInputRef}
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search inside code..."
                    className="mt-2 w-full rounded-[14px] border border-white/10 bg-[#0F172A] px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={
                      previousCode
                        ? () => onSelectAlternative(previousCode)
                        : undefined
                    }
                    className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F8FAFC] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!previousCode}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={
                      nextCode ? () => onSelectAlternative(nextCode) : undefined
                    }
                    className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F8FAFC] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!nextCode}
                  >
                    Next
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {supportedTags.map((tag) => (
                  <span
                    key={tag.label}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#94A3B8]"
                  >
                    {tag.label}
                  </span>
                ))}
                {alternatives.length > 1 ? (
                  <span className="rounded-full border border-white/10 bg-[#3B82F6]/10 px-3 py-1 text-xs text-[#3B82F6]">
                    {alternatives.length} code solutions
                  </span>
                ) : null}
              </div>
            </div>
          )}

          <div className="relative flex-1 overflow-hidden rounded-[20px] border border-white/10 bg-[#0B1121]">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-[#0B1121]/90 px-4 py-3 text-xs uppercase tracking-[0.35em] text-[#94A3B8]">
              <span>Code lines</span>
              <span>{lines.length} lines</span>
            </div>
            <div
              className={`h-full overflow-auto px-0 py-4 ${wordWrap ? "whitespace-pre-wrap" : "whitespace-pre"}`}
            >
              <div className="min-w-full">
                {lines.map((line, index) => {
                  const isMatch = searchTerm
                    ? line.toLowerCase().includes(searchTerm.toLowerCase())
                    : false;
                  return (
                    <button
                      key={`${code.label}-${index}`}
                      type="button"
                      onClick={() => setActiveLine(index)}
                      className={`group grid w-full grid-cols-[48px_minmax(0,1fr)] gap-4 border-b border-white/10 px-4 py-2 text-left text-sm transition ${
                        activeLine === index
                          ? "bg-[#1A2335]"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`select-none text-right text-xs text-[#64748B] ${activeLine === index ? "text-[#3B82F6]" : ""}`}
                      >
                        {index + 1}
                      </span>
                      <span
                        className={`block text-sm leading-6 ${wordWrap ? "break-words" : "overflow-x-auto"}`}
                      >
                        {highlightSearch(line, searchTerm)}
                        {isMatch && searchTerm ? null : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
