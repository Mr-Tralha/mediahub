'use client';

interface Post {
  id: string;
  prompt: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Texto copiado!');
  };

  const savePostAsJSON = () => {
    // Cria um blob com o JSON do post
    const postJSON = JSON.stringify(post, null, 2);
    const blob = new Blob([postJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Cria link para download
    const link = document.createElement('a');
    link.href = url;
    link.download = `post-${post.id}.json`;
    link.click();

    // Limpa o URL temporário
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Imagem */}
      {post.image && (
        <div className="w-full aspect-square relative bg-gray-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-6 space-y-4">
        {/* Título */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>

        {/* Prompt Original */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Prompt:</span> {post.prompt}
          </p>
        </div>

        {/* Conteúdo do Post */}
        <div className="prose max-w-none">
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => copyToClipboard(`${post.title}\n\n${post.content}`)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copiar Texto</span>
          </button>

          {post.image && (
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = post.image;
                link.download = `post-${post.id}.png`;
                link.click();
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Baixar Imagem</span>
            </button>
          )}

          <button
            onClick={savePostAsJSON}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>Salvar JSON</span>
          </button>
        </div>

        {/* ID do Post (útil para debug) */}
        <p className="text-xs text-gray-400 text-center pt-2">
          ID: {post.id}
        </p>
      </div>
    </div>
  );
}
