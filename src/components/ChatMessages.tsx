import { MessageBubble } from '@/components/MessageBubble'
import type { ChatMessage } from '@/types/chat'
import { useEffect, useRef } from 'react'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isTyping: boolean
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isTyping])

  return (
    <main className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" role="main" aria-live="polite">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isTyping && (
        <article className="flex max-w-[95%] items-start gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bot text-[11px] font-semibold text-brand" aria-hidden="true">
            LP
          </div>
          <div className="rounded-[14px] border border-borderSoft bg-white px-3.5 py-2.5">
            <div className="flex items-center gap-1 py-1.5" aria-label="Agente digitando">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#aaa]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#aaa] [animation-delay:200ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#aaa] [animation-delay:400ms]" />
            </div>
          </div>
        </article>
      )}
      <div ref={endRef} />
    </main>
  )
}
