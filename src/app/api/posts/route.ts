import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
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

    // Salva o post em arquivo JSON
    const dataDir = join(process.cwd(), 'data', 'posts');
    
    // Garante que o diretório existe
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    const filePath = join(dataDir, `${post.id}.json`);
    writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf-8');

    console.log(`[API] Post salvo: ${filePath}`);

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
 * Lista todos os posts salvos (funcionalidade futura)
 */
export async function GET() {
  return NextResponse.json({
    message: 'Listagem de posts - em breve',
  });
}
