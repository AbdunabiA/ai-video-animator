
import React, { useState, useRef } from 'react';
import { AnimationType } from '../types';
import { UploadIcon, SparklesIcon, XIcon } from './icons';

interface VideoGeneratorProps {
  onGenerate: (prompt: string, imageFile: File | null, animationType: AnimationType) => void;
  isLoading: boolean;
}

const AnimationTypeButton: React.FC<{
    type: AnimationType;
    currentType: AnimationType;
    onClick: (type: AnimationType) => void;
}> = ({ type, currentType, onClick }) => (
  <button
    onClick={() => onClick(type)}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 ${
      currentType === type
        ? 'bg-indigo-600 text-white shadow-md'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {type}
  </button>
);


const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [animationType, setAnimationType] = useState<AnimationType>(AnimationType.PRODUCT_SHOWCASE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGenerate(prompt, imageFile, animationType);
  };

  const showImageUpload = animationType !== AnimationType.TEXT_TO_VIDEO;

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
                1. Choose Animation Type
            </label>
            <div className="flex space-x-2">
                <AnimationTypeButton type={AnimationType.PRODUCT_SHOWCASE} currentType={animationType} onClick={setAnimationType} />
                <AnimationTypeButton type={AnimationType.LOGO_ANIMATION} currentType={animationType} onClick={setAnimationType} />
                <AnimationTypeButton type={AnimationType.TEXT_TO_VIDEO} currentType={animationType} onClick={setAnimationType} />
            </div>
        </div>

        {showImageUpload && (
          <div className="mb-4">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">
              2. Upload Image (Product, Logo, etc.)
            </label>
            {!imagePreview ? (
              <div
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-1 text-center">
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
                  <div className="flex text-sm text-gray-400">
                    <p className="pl-1">Click to upload a file</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
              </div>
            ) : (
              <div className="mt-2 relative">
                <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-48 object-contain rounded-md bg-gray-900"/>
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-2 right-2 bg-gray-800/70 rounded-full p-1 text-white hover:bg-red-500/80 transition-colors"
                  aria-label="Remove image"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex-grow flex flex-col">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            {showImageUpload ? '3.' : '2.'} Describe Your Vision
          </label>
          <textarea
            id="prompt"
            name="prompt"
            rows={6}
            className="shadow-sm block w-full sm:text-sm border-gray-600 bg-gray-900 rounded-md focus:ring-indigo-500 focus:border-indigo-500 flex-grow"
            placeholder={`e.g., "A cinematic 360-degree view of the product on a mountain peak at sunrise."`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
               <> <SparklesIcon className="h-5 w-5 mr-2" /> Generate Video </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoGenerator;
