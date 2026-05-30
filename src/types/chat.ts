export type Role = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: Role
  content: string
  copyable?: boolean
  pill?: string
}

export type StepItem = {
  n: number
  pct: number
  label: string
}

export type AgentData = {
  niche?: string
  briefing?: string
  missingFields?: string[]
  materials?: string
}

export type ApiMessage = {
  role: 'user' | 'assistant'
  content: string
}
