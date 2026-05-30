# Agente LP — Prompt Mestre

Aplicação web em Vite + React + TypeScript + Tailwind CSS para conduzir um usuário por 10 passos e gerar um Prompt Final para Lovable criar Landing Pages profissionais.

## Como rodar localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy no Vercel

1. Suba o projeto para o GitHub.
2. Importe no Vercel.
3. Configure o build command como:

```bash
npm run build
```

4. Configure o output como:

```txt
dist
```

## Variáveis de ambiente

Crie um arquivo `.env` localmente ou configure no painel do Vercel:

```txt
AI_PROVIDER="anthropic"
ANTHROPIC_API_KEY="sua-chave-aqui"
ANTHROPIC_MODEL="claude-sonnet-4-20250514"
```

Sem a chave, a aplicação continua funcionando com fluxo local pré-programado.

## Segurança

A chave da API não fica no frontend. A chamada para IA é feita pela rota serverless:

```txt
/api/chat
```

## Estrutura

```txt
/
├── api/chat.ts
├── src/components
├── src/data
├── src/types
├── src/utils
└── demais arquivos de configuração
```
