/**
 * Camada de abstração para chamadas de LLM
 * Facilita a troca de providers (OpenAI, Anthropic, etc.)
 */

interface TextGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

interface ImageGenerationOptions {
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  model?: string;
}

export const llm = {
  /**
   * Gera texto usando a API da OpenAI
   */
  async generateText(
    prompt: string,
    options: TextGenerationOptions = {}
  ): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    const {
      temperature = 0.7,
      maxTokens = 1000,
      model = 'gpt-4o-mini'
    } = options;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente especializado em criar conteúdo criativo para redes sociais.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Erro ao gerar texto:', error);
      throw error;
    }
  },

  /**
   * Gera imagem usando a API da OpenAI (DALL-E)
   */
  async generateImage(
    prompt: string,
    options: ImageGenerationOptions = {}
  ): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    const {
      size = '1024x1024',
      quality = 'standard',
      model = 'dall-e-3'
    } = options;

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          prompt,
          n: 1,
          size,
          quality,
          response_format: 'b64_json', // Retorna base64
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const base64Image = data.data[0]?.b64_json;
      
      if (!base64Image) {
        throw new Error('Imagem não gerada');
      }

      return `data:image/png;base64,${base64Image}`;
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      throw error;
    }
  },
};
