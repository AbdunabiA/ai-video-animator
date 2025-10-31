
import React from 'react';
import { KeyIcon, ExternalLinkIcon } from './icons';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      onKeySelected();
    } else {
      alert("AI Studio context is not available. Please set API_KEY in your environment for local development.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="max-w-md w-full bg-gray-800/50 rounded-lg p-8 text-center shadow-lg border border-gray-700">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500">
          <KeyIcon className="h-6 w-6 text-white" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-white">Select Your API Key</h2>
        <p className="mt-2 text-sm text-gray-400">
          This application uses the Veo video generation model, which requires you to select your own API key. Your key is used only for processing your requests.
        </p>
        <button
          onClick={handleSelectKey}
          className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors"
        >
          Select API Key
        </button>
        <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 text-xs text-gray-500 hover:text-indigo-400 transition-colors inline-flex items-center"
        >
            Learn about billing <ExternalLinkIcon className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default ApiKeySelector;
