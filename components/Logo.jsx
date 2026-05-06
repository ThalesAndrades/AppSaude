export default function Logo({ className = '', withWordmark = true, size = 32 }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="mf-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#mf-grad)" />
        <path
          d="M9 22V11.5c0-.7.83-1.07 1.35-.6L16 16l5.65-5.1c.52-.47 1.35-.1 1.35.6V22"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="16" r="1.6" fill="white" />
      </svg>
      {withWordmark && (
        <span className="font-display text-[1.35rem] leading-none font-semibold tracking-tight text-text-strong">
          mettafit
        </span>
      )}
    </span>
  );
}
