/**
 * Agente especializado em geração de imagens
 * Cria imagens ilustrativas para posts
 */

import { llm } from '../utils/llm';

/**
 * Gera uma imagem relacionada ao tema do post
 */
export async function run(prompt: string): Promise<string> {
  // Otimiza o prompt para geração de imagem
  const imagePrompt = `Create a professional, eye-catching social media post image about: ${prompt}. 
Style: modern, vibrant, high-quality, suitable for Instagram/Facebook. 
No text in the image.`;

  try {
    const imageBase64 = await llm.generateImage(imagePrompt, {
      size: '1024x1024',
      quality: 'standard',
    });

    return imageBase64;
  } catch (error) {
    console.error('Erro no imageAgent:', error);
    // Retorna uma imagem placeholder em caso de erro
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2VtIG7Do28gZGlzcG9uw612ZWw8L3RleHQ+PC9zdmc+';
  }
}
