/**
 * The surface every glass pane sits on.
 *
 * Glass only reads as glass when there is something varied behind it to
 * refract, so this is a warm mocha field with a cream light source at the
 * top, two coloured pools drifting at the corners, and a film grain to keep
 * the large blurred areas from looking like flat plastic.
 */
export default function VaultBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-mocha-400" aria-hidden="true">
      {/* Base wash: bright cream overhead falling to deep taupe at the edges */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_78%_at_50%_-12%,#fdfaf3_0%,#efe5d2_26%,#dbcaad_52%,#c3aa89_76%,#a89073_100%)]" />

      {/* Warm light pool, top right */}
      <div className="absolute -top-40 -right-32 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(255,244,220,0.9)_0%,rgba(255,244,220,0)_65%)] blur-3xl animate-driftSlow" />

      {/* Bronze pool, bottom left */}
      <div
        className="absolute -bottom-56 -left-32 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(150,113,66,0.30)_0%,rgba(150,113,66,0)_68%)] blur-3xl animate-driftSlow"
        style={{ animationDelay: '-8s' }}
      />

      {/* Soft centre highlight so mid-page glass has contrast to pick up */}
      <div
        className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_62%)] blur-3xl animate-driftSlow"
        style={{ animationDelay: '-16s' }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_40%,transparent_45%,rgba(72,58,42,0.16)_100%)]" />

      <div className="absolute inset-0 grain" />
    </div>
  );
}
