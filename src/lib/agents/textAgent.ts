/**
 * Agente especializado em geração de texto
 * Cria títulos e conteúdo de posts baseado em prompts
 */

import { llm } from '../utils/llm';

export interface TextOutput {
  title: string;
  content: string;
}

/**
 * Gera um post textual completo (título + conteúdo)
 */
export async function run(prompt: string): Promise<TextOutput> {
  const systemPrompt = `Crie um post criativo e envolvente para redes sociais com base no seguinte tema: "${prompt}"

Retorne a resposta no seguinte formato JSON:
{
  "title": "Título chamativo do post (máximo 100 caracteres)",
  "content": "Conteúdo completo do post (2-3 parágrafos, formato engajador)"
}`;

  try {
    const response = await llm.generateText(systemPrompt, {
      temperature: 0.8,
      maxTokens: 800,
    });

    // Parse da resposta JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: parsed.title || 'Post sem título',
        content: parsed.content || response,
      };
    }

    // Fallback se não vier no formato JSON
    const lines = response.split('\n').filter(l => l.trim());
    return {
      title: lines[0] || 'Post criativo',
      content: lines.slice(1).join('\n') || response,
    };
  } catch (error) {
    console.error('Erro no textAgent:', error);
    throw new Error('Falha ao gerar texto do post');
  }
}
