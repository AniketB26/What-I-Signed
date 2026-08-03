/**
 * The circular vault emblem from the Stitch design — a bronze ring with a
 * glass highlight and a stylised document/seal mark at its centre.
 */
export default function VaultMark({ size = 42, className = '' }) {
  return (
    <span
      className={`relative inline-flex flex-shrink-0 items-center justify-center rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Bronze ring + glass face */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'linear-gradient(150deg, #e8d3ab 0%, #c9a468 45%, #9a7539 100%)',
          boxShadow:
            'inset 0 1px 0 0 rgba(255,255,255,0.75), 0 6px 16px -8px rgba(94,68,32,0.75)',
        }}
      />
      <span
        className="absolute rounded-full"
        style={{
          inset: Math.max(2, size * 0.075),
          background:
            'linear-gradient(160deg, rgba(255,253,247,0.95) 0%, rgba(246,235,216,0.82) 100%)',
          boxShadow: 'inset 0 1px 2px 0 rgba(122,90,42,0.22)',
        }}
      />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="relative text-gold-700"
        style={{ width: size * 0.5, height: size * 0.5 }}
      >
        <path
          d="M7 3.5h6.5L17.5 7.5V20a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M13 3.5V8h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="12" cy="14" r="2.6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 16.6V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {/* Specular sweep across the top-left of the disc */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 45%)',
        }}
      />
    </span>
  );
}
