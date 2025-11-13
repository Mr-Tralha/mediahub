'use client';

import { useState } from 'react';
import ChatInput from '@/components/ChatInput';
import PostCard from '@/components/PostCard';

interface Post {
  id: string;
  prompt: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePost = async (prompt: string, generateImage: boolean) => {
    setLoading(true);
    setError(null);
    setGeneratedPost(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, generateImage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar post');
      }

      setGeneratedPost(data.post);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🚀 MediaHub AI
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Crie posts incríveis automaticamente com IA
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Input Section */}
          <ChatInput onSubmit={handleGeneratePost} loading={loading} />

          {/* Error Message */}
          {error && (
            <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Erro ao gerar post</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Generated Post */}
          {generatedPost && (
            <div className="animate-fade-in">
              <PostCard post={generatedPost} />
            </div>
          )}

          {/* Empty State */}
          {!loading && !generatedPost && !error && (
            <div className="max-w-3xl mx-auto text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Pronto para criar?
              </h3>
              <p className="text-gray-600">
                Digite um tema acima e deixe a IA criar um post incrível para você!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            MediaHub AI - Sistema de criação automática de posts com IA
          </p>
        </div>
      </footer>
    </div>
  );
}
