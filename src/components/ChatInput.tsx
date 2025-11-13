'use client';

import { useState, FormEvent } from 'react';

interface ChatInputProps {
  onSubmit: (prompt: string, generateImage: boolean) => void;
  loading: boolean;
}

export default function ChatInput({ onSubmit, loading }: ChatInputProps) {
  const [prompt, setPrompt] = useState('');
  const [generateImage, setGenerateImage] = useState(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onSubmit(prompt, generateImage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Descreva o tema do seu post
          </label>
          <textarea
            id="prompt"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
            placeholder="Ex: Dicas de produtividade para empreendedores digitais..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="generateImage"
            checked={generateImage}
            onChange={(e) => setGenerateImage(e.target.checked)}
            disabled={loading}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="generateImage" className="text-sm text-gray-700">
            Gerar imagem ilustrativa
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Gerando post...</span>
            </>
          ) : (
            <span>Gerar Post</span>
          )}
        </button>
      </div>
    </form>
  );
}
