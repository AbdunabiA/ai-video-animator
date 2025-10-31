
import React from 'react';
import { FilmIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center space-x-3">
            <FilmIcon className="h-8 w-8 text-indigo-400" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              AI Video Animator
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
