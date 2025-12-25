import React from 'react';
import { GenerationResult, LoadingState } from '../types';
import { ImageIcon, AlignLeft, Info } from 'lucide-react';

interface ResultDisplayProps {
  result: GenerationResult | null;
  loadingState: LoadingState;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, loadingState, error }) => {
  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-red-900/20 border border-red-800 rounded-xl text-center">
        <div className="text-red-400 text-lg font-semibold mb-2">Something went wrong</div>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  // Initial State
  if (!result && !loadingState.isGeneratingImage && !loadingState.isGeneratingText) {
    return (
      <div className="max-w-4xl mx-auto mt-12 text-center text-gray-500">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
            <Info className="w-10 h-10 text-gray-600" />
          </div>
        </div>
        <p className="text-xl font-medium">Ready to create</p>
        <p className="mt-2 text-sm">Enter an item above to see the visualization.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* Image Section */}
      <div className="w-full aspect-square bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl relative group">
        {loadingState.isGeneratingImage ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <p className="text-indigo-300 animate-pulse font-medium">Rendering preview...</p>
          </div>
        ) : result?.imageUrl ? (
          <img
            src={result.imageUrl}
            alt={result.prompt}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
             <ImageIcon className="w-12 h-12 mb-2" />
             <p>Image will appear here</p>
          </div>
        )}
      </div>

      {/* Description Section */}
      <div className="flex flex-col space-y-6">
        <div className="bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl backdrop-blur-sm min-h-[300px] flex flex-col">
           <div className="flex items-center space-x-3 mb-6 border-b border-gray-700 pb-4">
             <AlignLeft className="w-6 h-6 text-purple-400" />
             <h2 className="text-2xl font-bold text-white capitalize">
               {result?.prompt || "Description"}
             </h2>
           </div>

           <div className="flex-grow">
             {loadingState.isGeneratingText ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <p className="pt-4 text-purple-300 text-sm">Generating text...</p>
                </div>
             ) : result?.description ? (
               <div className="prose prose-invert max-w-none">
                 <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                   {result.description}
                 </p>
               </div>
             ) : (
               <p className="text-gray-500 italic">Description will appear here...</p>
             )}
           </div>
        </div>
        
        {/* Status badges */}
        {result?.prompt && !loadingState.isGeneratingImage && !loadingState.isGeneratingText && (
            <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full border border-gray-600">
                    Mock Mode
                </span>
                <span className="px-3 py-1 bg-indigo-900/50 text-indigo-300 text-sm rounded-full border border-indigo-800">
                    AI Disabled
                </span>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;