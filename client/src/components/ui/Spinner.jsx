export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizes[size]}
          rounded-full animate-spin
          border-transparent
          border-t-violet-500 border-r-blue-500
          border-b-cyan-400 border-l-transparent
        `}
      />
    </div>
  );
}
