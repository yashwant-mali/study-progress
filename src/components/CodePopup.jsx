import Modal from "./Modal";

export default function CodePopup({
  code,
  onClose,
  alternatives,
  onSelectAlternative,
}) {
  return (
    <Modal onClose={onClose}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">{code.label}</h3>
            <p className="text-sm text-slate-400">{code.language}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {alternatives.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onSelectAlternative(item)}
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-200 transition hover:border-slate-500"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <pre className="max-h-[60vh] overflow-auto rounded-3xl bg-slate-900 px-4 py-5 text-sm leading-6 text-slate-100">
          <code>{code.snippet}</code>
        </pre>
      </div>
    </Modal>
  );
}
