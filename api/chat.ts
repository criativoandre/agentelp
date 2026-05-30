import type { VercelRequest, VercelResponse } from '@vercel/node'

type IncomingMessage = {
  role: 'user' | 'assistant'
  content: string
}

type AnthropicContent = {
  type: string
  text?: string
}

type AnthropicResponse = {
  content?: AnthropicContent[]
  error?: {
    message?: string
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514'

  if (!apiKey) {
    return res.status(200).json({
      content: null,
      fallback: true,
      message: 'ANTHROPIC_API_KEY ausente. O frontend usará o fluxo local.'
    })
  }

  try {
    const { system, messages } = req.body as { system?: string; messages?: IncomingMessage[] }

    if (!system || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Payload inválido.' })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        system,
        messages: messages.map((message) => ({
          role: message.role,
          content: message.content
        }))
      })
    })

    const data = (await response.json()) as AnthropicResponse

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'Erro ao chamar a API de IA.'
      })
    }

    const content = data.content?.map((item) => item.text || '').join('\n').trim() || null
    return res.status(200).json({ content })
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro interno.'
    })
  }
}
