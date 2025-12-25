import React, { useState } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import ResultDisplay from './components/ResultDisplay';
import { generateImage, generateDescription } from './services/geminiService';
import { GenerationResult, LoadingState } from './types';

const App: React.FC = () => {
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isGeneratingImage: false,
    isGeneratingText: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (item: string) => {
    // Reset state for new search
    setResult({
        imageUrl: null,
        description: null,
        timestamp: Date.now(),
        prompt: item
    });
    setError(null);
    setLoadingState({ isGeneratingImage: true, isGeneratingText: true });

    // We run these in parallel to make the UI feel faster, but handle errors individually
    
    // 1. Trigger Image Generation
    const imagePromise = generateImage(item)
      .then((url) => {
        setResult((prev) => prev ? { ...prev, imageUrl: url } : null);
      })
      .catch((err) => {
        console.error("Image gen failed", err);
        setError((prev) => prev ? `${prev}. Image generation failed.` : "Image generation failed.");
      })
      .finally(() => {
        setLoadingState((prev) => ({ ...prev, isGeneratingImage: false }));
      });

    // 2. Trigger Description Generation
    const textPromise = generateDescription(item)
      .then((desc) => {
        setResult((prev) => prev ? { ...prev, description: desc } : null);
      })
      .catch((err) => {
        console.error("Text gen failed", err);
        setError((prev) => prev ? `${prev}. Description generation failed.` : "Description generation failed.");
      })
      .finally(() => {
        setLoadingState((prev) => ({ ...prev, isGeneratingText: false }));
      });

    await Promise.all([imagePromise, textPromise]);
  };

  const isLoading = loadingState.isGeneratingImage || loadingState.isGeneratingText;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 selection:bg-indigo-500 selection:text-white pb-12">
      <Header />
      
      <main className="container mx-auto">
        <InputArea onSearch={handleSearch} isLoading={isLoading} />
        
        <ResultDisplay 
          result={result} 
          loadingState={loadingState} 
          error={error}
        />
      </main>

      <footer className="mt-20 text-center text-gray-600 text-sm pb-6">
        <p>Powered by Gemini 2.5 Flash & Gemini 3 Flash</p>
      </footer>
    </div>
  );
};

export default App;