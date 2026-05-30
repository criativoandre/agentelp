export function isFinalPrompt(text: string): boolean {
  return text.includes('═══ PROMPT FINAL PARA A LOVABLE ═══')
}

export function createId(prefix = 'msg'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
