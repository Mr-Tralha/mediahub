import { NextRequest, NextResponse } from 'next/server';

export interface Post {
  id: string;
  prompt: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
}

/**
 * POST /api/posts/[id]/save
 * Salva um post específico como arquivo JSON para download
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const post: Post = body.post;

    if (!post || !post.id) {
      return NextResponse.json(
        { error: 'Post inválido' },
        { status: 400 }
      );
    }

    // Retorna o JSON do post para download
    return new NextResponse(JSON.stringify(post, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="post-${post.id}.json"`,
      },
    });
  } catch (error) {
    console.error('[API] Erro ao salvar post:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao salvar post',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
