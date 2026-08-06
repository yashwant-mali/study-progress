export default function Chip({ children, tone = "neutral", className = "" }) {
  const toneStyles = {
    neutral: "border-white/14 bg-white/5 text-[#F8FAFC]",
    primary: "border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#3B82F6]",
    secondary: "border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#06B6D4]",
    success: "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]",
    warning: "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]",
    danger: "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[13px] font-semibold tracking-[0.02em] ${
        toneStyles[tone] || toneStyles.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
}
