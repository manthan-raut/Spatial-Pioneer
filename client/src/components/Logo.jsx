export default function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="#EDE6D6" strokeOpacity=".35" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="12" stroke="#EDE6D6" strokeOpacity=".55" strokeWidth="1.2" strokeDasharray="2 3" />
      <path d="M20 4 L25 20 L20 36 L15 20 Z" fill="#E9A23B" />
      <path d="M20 20 L25 20 L20 36 L15 20 Z" fill="#EDE6D6" />
      <circle cx="20" cy="20" r="2.2" fill="#0B1A14" />
    </svg>
  );
}
