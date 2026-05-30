import { AgentHeader } from '@/components/AgentHeader'
import { ChatInput } from '@/components/ChatInput'
import { ChatMessages } from '@/components/ChatMessages'
import { ProgressBar } from '@/components/ProgressBar'
import { STEPS } from '@/data/steps'
import { SYSTEM_PROMPT } from '@/data/systemPrompt'
import { createId, isFinalPrompt } from '@/utils/formatPrompt'
import { createLocalAgentResponse, detectNextStep, getInitialMessage, updateCollectedData } from '@/utils/agentLogic'
import type { AgentData, ApiMessage, ChatMessage } from '@/types/chat'
import { useMemo, useState } from 'react'

const STORAGE_KEY = 'agente-lp-state-v1'

type StoredState = {
  step: number
  data: AgentData
  messages: ChatMessage[]
  apiHistory: ApiMessage[]
}

function loadStoredState(): StoredState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredState) : null
  } catch {
    return null
  }
}

function saveStoredState(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage pode estar indisponível em alguns navegadores.
  }
}

const initialMessage: ChatMessage = {
  id: createId('welcome'),
  role: 'assistant',
  content: getInitialMessage(),
  pill: 'Passo 1'
}

export default function App() {
  const stored = loadStoredState()
  const [step, setStep] = useState(stored?.step || 1)
  const [data, setData] = useState<AgentData>(stored?.data || {})
  const [messages, setMessages] = useState<ChatMessage[]>(stored?.messages || [initialMessage])
  const [apiHistory, setApiHistory] = useState<ApiMessage[]>(stored?.apiHistory || [])
  const [isTyping, setIsTyping] = useState(false)

  const currentStep = useMemo(() => STEPS[Math.min(step - 1, STEPS.length - 1)], [step])

  async function callAiApi(nextStep: number, nextData: AgentData, nextHistory: ApiMessage[]): Promise<string | null> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `${SYSTEM_PROMPT}\n\nPASSO ATUAL: ${nextStep}\nDADOS COLETADOS: ${JSON.stringify(nextData)}`,
          messages: nextHistory,
          step: nextStep,
          data: nextData
        })
      })

      if (!response.ok) return null
      const json = (await response.json()) as { content?: string }
      return json.content || null
    } catch {
      return null
    }
  }

  async function handleSend(userText: string) {
    const userMessage: ChatMessage = {
      id: createId('user'),
      role: 'user',
      content: userText
    }

    const nextData = updateCollectedData(step, userText, data)
    const nextStep = detectNextStep(step, userText)
    const nextApiHistory: ApiMessage[] = [...apiHistory, { role: 'user', content: userText }]
    const messagesWithUser = [...messages, userMessage]

    setMessages(messagesWithUser)
    setData(nextData)
    setIsTyping(true)

    const apiAnswer = await callAiApi(nextStep, nextData, nextApiHistory)
    const fallbackAnswer = createLocalAgentResponse(nextStep, nextData, userText)
    const answer = apiAnswer || fallbackAnswer

    const assistantMessage: ChatMessage = {
      id: createId('assistant'),
      role: 'assistant',
      content: answer,
      copyable: isFinalPrompt(answer),
      pill: `Passo ${nextStep}`
    }

    const finalMessages = [...messagesWithUser, assistantMessage]
    const finalApiHistory: ApiMessage[] = [...nextApiHistory, { role: 'assistant', content: answer }]

    setMessages(finalMessages)
    setApiHistory(finalApiHistory)
    setStep(nextStep)
    setIsTyping(false)

    saveStoredState({ step: nextStep, data: nextData, messages: finalMessages, apiHistory: finalApiHistory })
  }

  function resetConversation() {
    localStorage.removeItem(STORAGE_KEY)
    setStep(1)
    setData({})
    setApiHistory([])
    setMessages([{ ...initialMessage, id: createId('welcome') }])
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-3 sm:p-4">
      <section className="flex h-[calc(100vh-24px)] w-full max-w-[780px] flex-col overflow-hidden rounded-2xl border border-[#e0ddd5] bg-panel shadow-card sm:h-[680px]" aria-label="Agente LP Prompt Mestre">
        <AgentHeader step={currentStep} />
        <ProgressBar percentage={currentStep.pct} />
        <div className="border-b border-borderSoft bg-white px-4 py-2 text-right">
          <button
            type="button"
            onClick={resetConversation}
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-bot hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Reiniciar conversa
          </button>
        </div>
        <ChatMessages messages={messages} isTyping={isTyping} />
        <ChatInput disabled={isTyping} onSend={handleSend} />
      </section>
    </div>
  )
}
