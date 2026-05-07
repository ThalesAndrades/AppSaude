export function isDemoAuthBypassEnabled() {
  if (process.env.NODE_ENV === 'production') return false;
  const v =
    process.env.DEMO_AUTH_BYPASS ||
    process.env.NEXT_PUBLIC_DEMO_AUTH_BYPASS ||
    '';
  return String(v).toLowerCase() === '1' || String(v).toLowerCase() === 'true';
}

