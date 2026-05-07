export default function Logo({ className = '', withWordmark = true, size = 34 }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M32 26.5c-2.4-3.4-7-6.1-12.6-7.2-3.2-.6-6.1-.5-8.6.2 3.4 3.2 7.4 5.7 11.8 7.4 3.2 1.2 6.4 1.9 9.4 2.1z"
          fill="#cc9835"
        />
        <path
          d="M32 26.5c2.4-3.4 7-6.1 12.6-7.2 3.2-.6 6.1-.5 8.6.2-3.4 3.2-7.4 5.7-11.8 7.4-3.2 1.2-6.4 1.9-9.4 2.1z"
          fill="#cc9835"
        />
        <path
          d="M19.3 30.1c5.1 5.7 11.4 8.6 18.7 8.6s13.6-2.9 18.7-8.6c-5.7 8.8-13.9 13.2-24.7 13.2S25 38.9 19.3 30.1z"
          fill="#a77728"
          opacity="0.92"
        />
        <path
          d="M32 25.2c-2 2.9-3 6-3 9.4 0 1.7.2 3.4.7 5.1 1-.6 2-.9 2.3-.9.3 0 1.3.3 2.3.9.5-1.7.7-3.4.7-5.1 0-3.4-1-6.5-3-9.4z"
          fill="#cc9835"
        />
      </svg>
      {withWordmark && (
        <span className="leading-none">
          <span className="block text-[0.95rem] sm:text-[1.05rem] font-semibold tracking-[0.18em] text-text-strong uppercase">
            Mulheres
          </span>
          <span className="block text-[0.78rem] sm:text-[0.85rem] font-semibold tracking-[0.14em] text-text-muted uppercase mt-1">
            em movimento
          </span>
        </span>
      )}
    </span>
  );
}
