import { BRIEFING_TEXT } from '@/data/systemPrompt'
import type { AgentData } from '@/types/chat'

const strategicFillTriggers = ['preencha', 'preencher', 'ia preencher', 'estrategicamente', 'pode completar', 'complete', 'com base']
const noMaterialsTriggers = ['não', 'nao', 'não tenho', 'nao tenho', 'sem materiais', 'pode prosseguir', 'prossiga']

export function getInitialMessage(): string {
  return 'Qual é o nicho, segmento ou tipo de negócio da Landing Page que você deseja criar?'
}

export function detectNextStep(currentStep: number, userMessage: string): number {
  const normalized = userMessage.toLowerCase().trim()

  if (currentStep === 1) return 2
  if (currentStep === 2) return 3
  if (currentStep === 3) return 4
  if (currentStep === 4) return 5
  if (currentStep === 5) return 6
  if (currentStep === 6) {
    if (strategicFillTriggers.some((trigger) => normalized.includes(trigger))) return 7
    return 7
  }
  if (currentStep === 7) return 8
  if (currentStep === 8) return 9
  if (currentStep === 9) return 10
  return 10
}

export function updateCollectedData(currentStep: number, userMessage: string, data: AgentData): AgentData {
  if (currentStep === 1) return { ...data, niche: userMessage.trim() }
  if (currentStep === 3) return { ...data, briefing: userMessage.trim() }
  if (currentStep === 7) return { ...data, materials: userMessage.trim() }
  return data
}

export function createLocalAgentResponse(nextStep: number, data: AgentData, userMessage: string): string {
  switch (nextStep) {
    case 2:
      return `Perfeito. Vou criar o briefing estratégico para uma Landing Page no nicho de ${data.niche || userMessage}.`
    case 3:
      return BRIEFING_TEXT
    case 4:
      return `Ótimo. Vou analisar o briefing com foco em clareza estratégica, conversão, oferta, público, CTA, SEO e estrutura da Landing Page.\n\nPara seguir, envie "continuar".`
    case 5:
      return createBriefingSummary(data)
    case 6:
      return createMissingFieldsValidation(data)
    case 7:
      return 'Você possui materiais de referência para adicionar? Links, textos, PDFs, logotipo, identidade visual, concorrentes, catálogos ou exemplos de LPs.'
    case 8:
      return analyzeMaterials(data)
    case 9:
      return createStrategicAnalysis(data)
    case 10:
      return createFinalPrompt(data)
    default:
      return getInitialMessage()
  }
}

function createBriefingSummary(data: AgentData): string {
  const briefing = data.briefing || ''
  const lower = briefing.toLowerCase()
  const missing: string[] = []

  if (!lower.includes('whatsapp')) missing.push('CTA e WhatsApp')
  if (!lower.includes('pixel') && !lower.includes('analytics') && !lower.includes('gtm')) missing.push('Analytics e rastreamento')
  if (!lower.includes('seo') && !lower.includes('palavra-chave')) missing.push('SEO')
  if (!lower.includes('logo') && !lower.includes('cor')) missing.push('Identidade visual')
  if (!lower.includes('depoimento') && !lower.includes('prova')) missing.push('Provas sociais')

  data.missingFields = missing

  return `Resumo estratégico do briefing\n\n1. Nicho\n${data.niche || 'Não informado claramente.'}\n\n2. Oferta\nSerá extraída das respostas fornecidas no briefing. Caso esteja incompleta, será refinada estrategicamente.\n\n3. Público-alvo\nSerá estruturado com base nas dores, desejos, objeções e nível de consciência indicados.\n\n4. Objetivo da LP\nA página será pensada para conversão direta, seja por WhatsApp, formulário, orçamento, agendamento ou venda.\n\n5. CTA principal\nSerá ajustado para unir ação + benefício, evitando chamadas genéricas.\n\n6. Estilo visual\nSerá definido a partir das cores, referências e posicionamento da marca.\n\n7. Principais dores\nSerão transformadas em blocos de copy, seção de problema e argumentos de conversão.\n\n8. Principais desejos\nSerão usados na headline, benefícios, CTA e proposta de valor.\n\n9. Diferenciais\nSerão posicionados como motivos claros para escolher a empresa e não o concorrente.\n\n10. Pontos fortes\nO briefing já fornece base para estratégia, copy, estrutura, SEO e conversão.\n\n11. Pontos a complementar\n${missing.length ? missing.map((item) => `• ${item}`).join('\n') : '• Nenhum ponto crítico identificado até aqui.'}`
}

function createMissingFieldsValidation(data: AgentData): string {
  const missing = data.missingFields?.length ? data.missingFields : ['CTA final', 'Provas sociais', 'SEO', 'Analytics', 'Materiais visuais']
  return `Campos em aberto ou que podem ser fortalecidos:\n\n${missing.map((item) => `• ${item}`).join('\n')}\n\nVocê prefere responder agora ou deseja que eu preencha estrategicamente com base nas informações já fornecidas?`
}

function analyzeMaterials(data: AgentData): string {
  const materials = data.materials?.toLowerCase().trim() || ''
  if (!materials || noMaterialsTriggers.some((trigger) => materials === trigger || materials.includes(trigger))) {
    return 'Sem problemas. Vou prosseguir usando o briefing e boas práticas estratégicas para o nicho informado.\n\nPara seguir para a análise estratégica completa, envie "continuar".'
  }

  return `Análise dos materiais recebidos\n\n• Identidade visual: os materiais serão usados como referência para cores, estilo e hierarquia visual.\n• Tom de voz: a copy será adaptada para manter consistência com a comunicação atual.\n• Diferenciais: qualquer argumento de autoridade, experiência, método, garantia ou resultado será priorizado.\n• Provas sociais: depoimentos, prints, cases e dados serão posicionados próximos aos CTAs.\n• SEO: termos recorrentes nos materiais serão reaproveitados como palavras-chave e variações semânticas.\n• Conteúdos reaproveitáveis: textos institucionais, benefícios, objeções e perguntas frequentes serão transformados em seções estratégicas.\n\nPara seguir para a análise estratégica completa, envie "continuar".`
}

function createStrategicAnalysis(data: AgentData): string {
  const niche = data.niche || 'nicho informado'
  return `A) PERSONA DETALHADA\n\nNome fictício: Cliente Ideal da solução\nIdade: definida conforme o perfil do público do nicho de ${niche}\nPerfil: pessoa ou empresa que já percebe uma necessidade, mas precisa de clareza, confiança e segurança para avançar.\nObjetivos: resolver um problema específico, economizar tempo, reduzir riscos e tomar uma decisão com mais confiança.\nDores: falta de clareza, medo de errar, insegurança com fornecedores, dúvidas sobre preço e receio de não ter resultado.\nDesejos: solução prática, atendimento confiável, resultado perceptível, diferenciação e facilidade no contato.\nObjeções: preço, confiança, prazo, qualidade, garantia, comparação com concorrentes e medo de contratar errado.\nMotivações: benefício claro, prova social, autoridade, atendimento rápido e CTA simples.\nComo decide: compara opções, observa reputação, busca provas, verifica clareza da oferta e facilidade de contato.\nO que precisa ver na LP: headline forte, promessa clara, diferenciais, provas, FAQ, CTA visível e experiência mobile rápida.\n\nB) PÚBLICO-ALVO\n\nPrimário: pessoas ou empresas com intenção direta de contratar, comprar, solicitar orçamento ou agendar atendimento no nicho de ${niche}.\nSecundário: visitantes em fase de pesquisa, comparação ou consideração.\nSegmentação por intenção: busca ativa, comparação de alternativas, solução para dor específica e decisão de compra.\nSegmentação por consciência: problema consciente, solução consciente e pronto para converter.\nSegmentação por canal: Google para intenção alta, Meta/Instagram para desejo e remarketing, WhatsApp para fechamento, SEO para demanda contínua.\n\nC) FUNIL DE VENDAS E LEADS\n\nTopo: atrair com dores, dúvidas, conteúdos educativos e promessa clara.\nMeio: apresentar método, benefícios, diferenciais, provas e objeções quebradas.\nFundo: CTA direto para WhatsApp, formulário, orçamento, agendamento ou checkout.\nConversão: reduzir atrito com botão visível, mensagem pré-preenchida, formulário curto e prova próxima ao CTA.\nPós-lead: página de obrigado, confirmação, próximo passo e possibilidade de remarketing.\n\nD) MELHORES CANAIS DE ATRAÇÃO\n\nGoogle Ads: ideal para captar pessoas com intenção ativa.\nMeta Ads: forte para desejo, reconhecimento, remarketing e criativos visuais.\nInstagram: bom para prova, bastidores, autoridade e relacionamento.\nFacebook: útil para públicos locais, remarketing e segmentações amplas.\nTikTok: indicado se houver apelo visual, educativo ou demonstração rápida.\nYouTube: bom para autoridade, demonstração, VSL e remarketing.\nSEO: constrói tráfego orgânico e reduz dependência de mídia paga.\nGoogle Meu Negócio: essencial para negócios locais.\nWhatsApp: canal central para conversão rápida.\nE-mail: útil para nutrição de leads.\nParcerias: bom para autoridade e aquisição qualificada.\n\nE) REDES SOCIAIS\n\n1. Instagram\nConteúdos: provas sociais, bastidores, antes/depois, diferenciais, reels educativos e ofertas.\n\n2. Facebook\nConteúdos: campanhas locais, depoimentos, publicações de confiança e remarketing.\n\n3. YouTube ou TikTok\nConteúdos: vídeos curtos de explicação, demonstrações, respostas a objeções e autoridade.\n\nF) DICAS DE OURO — OTIMIZAÇÃO DA LP\n\n1. Abrir com uma headline baseada em dor ou desejo, não com o nome da empresa.\n2. Usar CTA com ação + benefício.\n3. Colocar prova social antes e depois da oferta.\n4. Deixar o hero claro acima da dobra no mobile.\n5. Reduzir campos do formulário ao essencial.\n6. Usar botão fixo no mobile quando o destino for WhatsApp.\n7. Trabalhar FAQ como quebra de objeções.\n8. Priorizar imagens leves em WebP.\n9. Usar seções curtas, escaneáveis e com hierarquia visual forte.\n10. Repetir o CTA em pontos estratégicos da página.\n\nPara gerar o Prompt Final para Lovable, envie "gerar prompt final".`
}

function createFinalPrompt(data: AgentData): string {
  const niche = data.niche || '[NICHO]'
  return `═══ PROMPT FINAL PARA A LOVABLE ═══\n\nCrie uma Landing Page profissional de alta conversão para o nicho de ${niche}, usando obrigatoriamente Vite + React + TypeScript + Tailwind CSS, pronta para deploy no Vercel via GitHub.\n\n1. CONTEXTO DO PROJETO\n\nNicho: ${niche}\nEmpresa/oferta: usar os dados fornecidos no briefing.\nPúblico: pessoas ou empresas com intenção de contratar, comprar, solicitar orçamento, agendar atendimento ou obter mais informações.\nTransformação desejada: levar o visitante de dúvida, insegurança ou pesquisa para clareza, confiança e ação.\n\n2. OBJETIVO DA LANDING PAGE\n\nCriar uma página focada em conversão, podendo direcionar para WhatsApp, formulário, orçamento, agendamento ou checkout conforme o briefing. A experiência deve ser rápida, clara, mobile-first e orientada a gerar leads qualificados.\n\n3. ESTRATÉGIA DE COPYWRITING\n\n- Headline com dor ou desejo, nunca abrir com o nome da empresa.\n- H1 com keyword + benefício em até 10 palavras.\n- Subheadline persuasiva em 1 a 2 linhas.\n- Parágrafos com no máximo 3 linhas.\n- Bullets orientados a resultado, priorizando transformação em vez de característica.\n- CTAs com ação + benefício.\n- Quebra de cada objeção com argumento + prova.\n- Prova social integrada ao longo da página.\n- FAQ estratégico para remover dúvidas antes da conversão.\n- CTA final forte, direto e seguro.\n\n4. ESTRUTURA DA LANDING PAGE\n\nHeader limpo e objetivo.\nHero acima da dobra com headline, subheadline, CTA e elemento visual.\nBenefícios principais.\nProblema/dor.\nSolução ou método.\nComo funciona.\nDiferenciais.\nProva social/depoimentos.\nOferta.\nFormulário ou CTA WhatsApp.\nFAQ.\nCTA final.\nFooter com informações essenciais.\n\n5. REQUISITOS DE DESIGN\n\nVisual moderno, mobile-first, alta legibilidade, hierarquia clara, botões chamativos, espaçamento generoso, layout responsivo, coerente com o nicho de ${niche}, contraste adequado, Tailwind CSS, componentização React, cards bem distribuídos, seções escaneáveis e foco absoluto em conversão.\n\n6. SEO TÉCNICO OBRIGATÓRIO\n\n- Meta title com até 60 caracteres e palavra-chave principal.\n- Meta description com até 155 caracteres, CTA e keyword.\n- Slug amigável.\n- Canonical tag.\n- Open Graph completo: og:title, og:description, og:image, og:url, og:type.\n- Twitter Card.\n- JSON-LD Schema Markup usando LocalBusiness, Product ou Service conforme o projeto.\n- FAQ com dados estruturados se aplicável.\n- html com lang=\"pt-BR\".\n- Favicon.\n- Headings lógicos H1 → H2 → H3.\n- Alt em todas as imagens.\n\n7. PERFORMANCE E CORE WEB VITALS\n\n- PageSpeed 90+ no mobile.\n- Mobile-first.\n- Imagens WebP com picture + fallback.\n- loading=\"lazy\" em todas as imagens, exceto hero.\n- Hero com loading=\"eager\" e fetchpriority=\"high\".\n- width e height em todos os img.\n- CSS crítico inline no head para above-the-fold.\n- Restante em arquivo externo com preload.\n- Zero frameworks pesados.\n- Máximo 1 script externo para analytics.\n- Todo JS com defer ou type=\"module\".\n- font-display: swap.\n- Máximo 2 pesos de fonte + fallback.\n- Evitar CLS, scripts bloqueantes e cálculos pesados no main thread.\n\n8. ACESSIBILIDADE\n\n- Contraste mínimo 4.5:1 para texto normal e 3:1 para texto grande.\n- aria-label em botões e links sem texto descritivo.\n- :focus-visible em todos os elementos interativos.\n- HTML semântico com main, navigation e contentinfo.\n- button para ações.\n- a para navegação.\n\n9. ANALYTICS E EVENTOS\n\nSe houver IDs no briefing, configurar GA4, Meta Pixel e GTM. Criar eventos para clique no CTA, clique no WhatsApp e envio de formulário. Scripts devem ficar no final do body com defer. Variáveis no .env.example com prefixo VITE_.\n\n10. ESTRUTURA TÉCNICA OBRIGATÓRIA\n\n/\n├── index.html\n├── package.json\n├── vite.config.ts\n├── tailwind.config.ts\n├── postcss.config.js\n├── tsconfig.json\n├── tsconfig.app.json\n├── tsconfig.node.json\n├── .env.example\n├── .gitignore\n├── vercel.json\n└── src/\n    ├── main.tsx\n    ├── App.tsx\n    ├── index.css\n    ├── components/\n    ├── data/\n    ├── assets/\n    └── utils/\n\n11. package.json OBRIGATÓRIO\n\nScripts obrigatórios:\n{ \"dev\":\"vite\", \"build\":\"tsc -b && vite build\", \"preview\":\"vite preview\", \"lint\":\"eslint .\" }\n\n12. vite.config.ts OBRIGATÓRIO\n\nimport { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nexport default defineConfig({ plugins:[react()], resolve:{ alias:{ '@':'/src' } } })\n\n13. index.html OBRIGATÓRIO\n\nCriar index.html na raiz com html lang=\"pt-BR\", meta charset, viewport, title SEO, meta tags, Open Graph, Twitter Card, Schema JSON-LD, div id=\"root\" e script type=\"module\" apontando para /src/main.tsx.\n\n14. REGRAS ABSOLUTAS — A LOVABLE NÃO DEVE\n\n- Não usar dependências do Lovable ou Supabase se não solicitado.\n- Não criar server.js, server.ts ou Express.\n- Não gerar imports quebrados ou arquivos inexistentes.\n- Não incluir node_modules, dist ou .env com valores reais.\n- Não usar type=\"module\" no package.json se quebrar Tailwind/PostCSS.\n- Tailwind content deve ser ['./index.html','./src/**/*.{ts,tsx}'].\n- Deploy: build command = npm run build | output = dist.\n\n15. vercel.json OBRIGATÓRIO\n\n{\n  \"headers\": [\n    { \"source\":\"/(.*)\", \"headers\":[\n      {\"key\":\"X-Content-Type-Options\",\"value\":\"nosniff\"},\n      {\"key\":\"X-Frame-Options\",\"value\":\"DENY\"},\n      {\"key\":\"X-XSS-Protection\",\"value\":\"1; mode=block\"}\n    ]},\n    { \"source\":\"/assets/(.*)\", \"headers\":[\n      {\"key\":\"Cache-Control\",\"value\":\"public, max-age=31536000, immutable\"}\n    ]},\n    { \"source\":\"/index.html\", \"headers\":[\n      {\"key\":\"Cache-Control\",\"value\":\"public, max-age=0, must-revalidate\"}\n    ]}\n  ]\n}\n\n16. ENTREGÁVEIS E ZIP FINAL\n\nEntregar projeto completo com todos os arquivos da estrutura, meta tags, Schema JSON-LD, copy completa, checklist PageSpeed e checklist de deploy. Gerar ZIP sem node_modules, sem dist e sem .env real. Objetivo: baixar ZIP → npm install && npm run build → GitHub → Vercel. Zero ajustes manuais.\n\nCHECKLIST INTERNO\n\n- Nicho identificado.\n- Briefing analisado.\n- Lacunas tratadas.\n- Materiais analisados ou ausência considerada.\n- Persona criada.\n- Público definido.\n- Funil criado.\n- Canais recomendados.\n- Redes sociais indicadas.\n- Dicas de ouro entregues.\n- Prompt final com todas as 16 seções.\n- Stack Vite + React + TypeScript + Tailwind.\n- Deploy Vercel.\n- ZIP solicitado.\n- Regras absolutas incluídas.`
}
