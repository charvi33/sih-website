type ProgressRingProps = {
  progress: number; // 0..100
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export default function ProgressRing({ progress, size = 64, strokeWidth = 4, className = '' }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg width={size} height={size} className={className} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-neutral-700"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="text-yellow-400 transition-all duration-700 ease-out"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
