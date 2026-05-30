import { Send } from 'lucide-react'
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'

interface ChatInputProps {
  disabled: boolean
  onSend: (message: string) => void
}

export function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = '42px'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [value])

  function submit(event?: FormEvent) {
    event?.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form onSubmit={submit} className="flex shrink-0 gap-2 border-t border-borderSoft bg-soft px-3.5 py-3" aria-label="Enviar mensagem">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite sua resposta... (Enter para enviar, Shift+Enter para nova linha)"
        rows={1}
        disabled={disabled}
        className="h-[42px] max-h-[120px] flex-1 resize-none overflow-y-auto rounded-[10px] border border-[#d5d2c8] bg-white px-3 py-2.5 font-sans text-sm leading-5 text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] bg-brand text-white transition hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-40"
        aria-label="Enviar mensagem"
      >
        <Send size={17} aria-hidden="true" />
      </button>
    </form>
  )
}
