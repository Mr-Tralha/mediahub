import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as textAgent from '@/lib/agents/textAgent';
import * as imageAgent from '@/lib/agents/imageAgent';

export interface Post {
  id: string;
  prompt: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
}

// Armazenamento em memória dos posts
const postsCache = new Map<string, Post>();

// Limite de posts em memória (previne overflow)
const MAX_POSTS_IN_MEMORY = 50;

/**
 * POST /api/posts
 * Cria um novo post baseado no prompt do usuário
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, generateImage = true } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt é obrigatório' },
        { status: 400 }
      );
    }

    // Gera o texto do post
    console.log('[API] Gerando texto...');
    const textResult = await textAgent.run(prompt);

    // Gera a imagem (opcional)
    let imageData = '';
    if (generateImage) {
      console.log('[API] Gerando imagem...');
      try {
        imageData = await imageAgent.run(prompt);
      } catch (error) {
        console.error('[API] Erro ao gerar imagem:', error);
        // Continua sem imagem em caso de erro
      }
    }

    // Cria o objeto do post
    const post: Post = {
      id: uuidv4(),
      prompt,
      title: textResult.title,
      content: textResult.content,
      image: imageData,
      createdAt: new Date().toISOString(),
    };

    // Gerenciamento de memória: remove o post mais antigo se exceder o limite
    if (postsCache.size >= MAX_POSTS_IN_MEMORY) {
      const firstKey = postsCache.keys().next().value;
      if (firstKey) {
        postsCache.delete(firstKey);
        console.log(`[API] Post antigo removido da memória: ${firstKey}`);
      }
    }

    // Armazena o post em memória
    postsCache.set(post.id, post);
    console.log(`[API] Post armazenado em memória. Total: ${postsCache.size}`);

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('[API] Erro ao criar post:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao gerar post',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/posts
 * Lista todos os posts armazenados em memória
 */
export async function GET() {
  const posts = Array.from(postsCache.values()).reverse(); // Mais recentes primeiro
  
  return NextResponse.json({
    success: true,
    count: posts.length,
    posts,
  });
}

/**
 * DELETE /api/posts
 * Limpa todos os posts da memória
 */
export async function DELETE() {
  const count = postsCache.size;
  postsCache.clear();
  
  return NextResponse.json({
    success: true,
    message: `${count} posts removidos da memória`,
  });
}
