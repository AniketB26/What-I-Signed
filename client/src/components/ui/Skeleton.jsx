export default function Skeleton({ className = '', variant = 'text' }) {
  const base = 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%] animate-shimmer rounded-lg';

  const variants = {
    text: `h-4 w-full ${base}`,
    title: `h-6 w-3/4 ${base}`,
    card: `h-48 w-full ${base} rounded-2xl`,
    avatar: `h-10 w-10 ${base} rounded-full`,
    badge: `h-6 w-20 ${base} rounded-full`,
    button: `h-10 w-24 ${base} rounded-xl`,
  };

  return <div className={`${variants[variant] || variants.text} ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="title" className="w-2/3" />
        <Skeleton variant="badge" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-5/6" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="badge" />
        <Skeleton variant="badge" className="w-16" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-5 flex items-center gap-4">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-1/3" />
            <Skeleton variant="text" className="w-2/3" />
          </div>
          <Skeleton variant="badge" />
        </div>
      ))}
    </div>
  );
}
