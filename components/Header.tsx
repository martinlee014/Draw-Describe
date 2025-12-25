import React from 'react';
import { Pencil, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 flex flex-col items-center justify-center space-y-2 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
          <Pencil className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Draw & Describe
        </h1>
        <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-gray-400 text-sm md:text-base max-w-md text-center">
        Name any item, and our AI will visualize and explain it for you instantly.
      </p>
    </header>
  );
};

export default Header;