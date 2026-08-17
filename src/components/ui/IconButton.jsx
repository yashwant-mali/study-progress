export default function IconButton({
  icon,
  label,
  onClick,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex h-10 min-w-[40px] items-center justify-center rounded-[14px] border border-white/14 bg-white/5 px-3 text-white transition duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] ${className}`}
      {...props}
    >
      {icon}
      {label ? (
        <span className="ml-2 text-sm font-semibold">{label}</span>
      ) : null}
    </button>
  );
}
