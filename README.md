# MediaHub AI - Sistema de Criação Automática de Posts

🚀 MVP funcional para geração automática de posts usando IA (OpenAI GPT-4 + DALL-E).

## 📋 Funcionalidades

- ✅ Interface de chat simples para inserção de prompts
- ✅ Geração automática de texto (título + conteúdo)
- ✅ Geração automática de imagem ilustrativa (opcional)
- ✅ **Armazenamento em memória** (até 50 posts)
- ✅ **Download opcional** de posts em JSON
- ✅ Arquitetura com agentes especializados
- ✅ Abstração de LLM para fácil troca de providers

## 🏗️ Estrutura do Projeto

```
mediahub/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── posts/
│   │   │       └── route.ts          # API endpoint principal
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Interface principal
│   │   └── globals.css
│   ├── components/
│   │   ├── ChatInput.tsx             # Input de prompt
│   │   └── PostCard.tsx              # Exibição do post gerado
│   └── lib/
│       ├── agents/
│       │   ├── textAgent.ts          # Geração de texto
│       │   ├── imageAgent.ts         # Geração de imagem
│       │   └── researchAgent.ts      # (placeholder) Pesquisa contextual
│       └── utils/
│           └── llm.ts                # Abstração de chamadas LLM
├── data/
│   └── posts/                        # JSONs com posts salvos
├── .env.example
└── package.json
```

## 🚀 Como Usar

### 1. Instalação

```bash
npm install
```

### 2. Configuração

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione sua chave da OpenAI:

```env
OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

> 🔑 Obtenha sua chave em: https://platform.openai.com/api-keys

### 3. Executar

```bash
npm run dev
```

Acesse: http://localhost:3000

## 💡 Como Funciona

1. **Usuário** insere um prompt no campo de texto
2. **Frontend** envia requisição POST para `/api/posts`
3. **API** aciona os agentes:
   - `textAgent` → gera título e conteúdo
   - `imageAgent` → gera imagem relacionada (se habilitado)
4. **Resultado** é armazenado em memória e retornado ao frontend
5. **PostCard** exibe o resultado com opções de:
   - 📋 Copiar texto
   - 🖼️ Baixar imagem
   - 💾 Salvar post como JSON

## 💾 Gerenciamento de Memória

- Posts são armazenados em **memória volátil** (RAM)
- Limite de **50 posts** em memória (FIFO - First In, First Out)
- Posts são perdidos ao reiniciar o servidor
- **Salve manualmente** posts importantes usando o botão "Salvar JSON"
- Ideal para ambientes serverless (Vercel, Netlify, etc.)

## 🧩 Arquitetura de Agentes

Cada agente é independente e focado em uma tarefa:

```typescript
// textAgent.ts
export async function run(prompt: string): Promise<TextOutput>

// imageAgent.ts
export async function run(prompt: string): Promise<string>

// researchAgent.ts (futuro)
export async function run(topic: string): Promise<ResearchData>
```

## 🔧 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **OpenAI API** (GPT-4 + DALL-E 3)
- **UUID** para IDs únicos
- **Node.js fs** para armazenamento local

## 📦 Estrutura de Dados (Post)

```json
{
  "id": "uuid-v4",
  "prompt": "tema original do usuário",
  "title": "Título do Post",
  "content": "Conteúdo completo...",
  "image": "data:image/png;base64,...",
  "createdAt": "2025-11-13T12:00:00.000Z"
}
```

## 🔮 Roadmap Futuro

- [ ] Integração com `researchAgent` para pesquisa web
- [ ] Listagem de posts salvos (GET `/api/posts`)
- [ ] Edição de posts gerados
- [ ] Agendamento automático para redes sociais
- [ ] Suporte para múltiplos providers de IA
- [ ] Dashboard de analytics
- [ ] Exportação em múltiplos formatos

## 🤝 Contribuindo

Este é um MVP. Contribuições são bem-vindas!

## 📄 Licença

MIT

