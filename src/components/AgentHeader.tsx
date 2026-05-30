import type { StepItem } from '@/types/chat'

interface AgentHeaderProps {
  step: StepItem
}

export function AgentHeader({ step }: AgentHeaderProps) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-borderSoft bg-soft px-4 py-3 sm:px-[18px]" role="banner">
      <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
        LP
      </div>
      <div className="min-w-0">
        <h1 className="truncate text-sm font-semibold text-ink">Agente LP — Prompt Mestre</h1>
        <p className="truncate text-xs text-muted">Estratégia · Copy · Dev · SEO · Deploy Vercel</p>
      </div>
      <div className="ml-auto whitespace-nowrap rounded-full bg-badgeBg px-3 py-1 text-[11px] font-semibold text-badgeText">
        {step.label}
      </div>
    </header>
  )
}
