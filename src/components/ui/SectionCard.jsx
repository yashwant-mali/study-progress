export default function SectionCard({
  title,
  description,
  children,
  footer,
  className = "",
}) {
  return (
    <section
      className={`space-y-4 rounded-[20px] border border-white/14 bg-[#111827] p-6 shadow-[0_40px_80px_rgba(0,0,0,0.12)] ${className}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#94A3B8]">
              {title}
            </p>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-[#94A3B8]">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
      {footer ? <div className="pt-4">{footer}</div> : null}
    </section>
  );
}
