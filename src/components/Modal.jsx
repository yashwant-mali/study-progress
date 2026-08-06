export default function Modal({ children, onClose }) {
  return (
    <div
      data-component="Modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/90 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-4xl overflow-hidden rounded-[24px] border border-white/10 bg-[#111827] text-[#F8FAFC] shadow-[0_50px_120px_rgba(0,0,0,0.4)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold">Code viewer</h2>
          <button
            type="button"
            className="rounded-[18px] border border-white/10 px-3 py-1 text-sm text-[#F8FAFC] transition hover:bg-white/5"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
