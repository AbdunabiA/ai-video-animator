
import React, { useState, useEffect, useCallback } from 'react';
import { generateVideo } from './services/geminiService';
import type { VideoGenerationResult } from './types';
import { AnimationType } from './types';
import Header from './components/Header';
import ApiKeySelector from './components/ApiKeySelector';
import VideoGenerator from './components/VideoGenerator';
import VideoPlayer from './components/VideoPlayer';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [isKeySelected, setIsKeySelected] = useState<boolean>(false);
  const [isCheckingKey, setIsCheckingKey] = useState<true | false>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const checkApiKey = useCallback(async () => {
    setIsCheckingKey(true);
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setIsKeySelected(hasKey);
    } else {
      // Fallback for local development or if aistudio is not available
      setIsKeySelected(!!process.env.API_KEY);
    }
    setIsCheckingKey(false);
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleGenerate = async (prompt: string, imageFile: File | null, animationType: AnimationType) => {
    if (!prompt) {
      setError('Please enter a prompt to generate the video.');
      return;
    }

    if (animationType !== AnimationType.TEXT_TO_VIDEO && !imageFile) {
        setError('Please upload an image for this animation type.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedVideoUrl(null);
    setLoadingMessage('Initializing video generation...');

    try {
      const imageBase64 = imageFile ? await fileToBase64(imageFile) : null;

      const result: VideoGenerationResult = await generateVideo(
        prompt,
        imageBase64,
        (message) => setLoadingMessage(message)
      );
      
      const response = await fetch(`${result.videoUrl}&key=${process.env.API_KEY}`);
      if (!response.ok) {
        throw new Error('Failed to fetch the generated video file.');
      }
      const videoBlob = await response.blob();
      const objectUrl = URL.createObjectURL(videoBlob);

      setGeneratedVideoUrl(objectUrl);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Requested entity was not found")) {
        setError("Your API key is invalid. Please select a valid key.");
        setIsKeySelected(false);
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleKeySelected = () => {
    setIsKeySelected(true);
    checkApiKey(); // re-check to be sure
  }

  if (isCheckingKey) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-xl text-gray-300">Checking API Key...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="p-4 md:p-8">
        {!isKeySelected ? (
          <ApiKeySelector onKeySelected={handleKeySelected} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <VideoGenerator onGenerate={handleGenerate} isLoading={isLoading} />
            <VideoPlayer
              videoUrl={generatedVideoUrl}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              error={error}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
