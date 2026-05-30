interface ProgressBarProps {
  percentage: number
}

export function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="h-[3px] shrink-0 bg-[#ece9e0]" aria-hidden="true">
      <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${percentage}%` }} />
    </div>
  )
}
