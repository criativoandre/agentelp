import { CopyButton } from '@/components/CopyButton'
import type { ChatMessage } from '@/types/chat'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <article className={`flex max-w-[95%] items-start gap-2 ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
          isUser ? 'bg-brand text-white' : 'bg-bot text-brand'
        }`}
        aria-hidden="true"
      >
        {isUser ? 'Eu' : 'LP'}
      </div>
      <div
        className={`rounded-[14px] border px-3.5 py-2.5 text-sm leading-7 shadow-sm ${
          isUser ? 'border-transparent bg-brand text-white' : 'border-borderSoft bg-white text-ink'
        }`}
      >
        {message.pill && (
          <span className="mb-1 inline-block rounded-full bg-bot px-2.5 py-0.5 text-[11px] font-semibold text-brand">
            {message.pill}
          </span>
        )}
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        {message.copyable && <CopyButton text={message.content} />}
      </div>
    </article>
  )
}
