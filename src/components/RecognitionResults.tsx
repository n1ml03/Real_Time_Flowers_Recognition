import React from 'react';
import { Flower } from 'lucide-react';

interface RecognitionResultsProps {
  result: { name: string; confidence: number } | null;
}

const RecognitionResults: React.FC<RecognitionResultsProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-6 w-full max-w-md bg-white rounded-lg shadow-lg p-6 animate-fade-in-up">
      <h2 className="text-2xl font-semibold mb-4 flex items-center text-green-700">
        <Flower className="mr-2" /> Recognition Result
      </h2>
      <div className="space-y-2">
        <p className="text-xl">
          <span className="font-medium text-gray-700">Flower:</span>{' '}
          <span className="text-green-600 font-bold">{result.name}</span>
        </p>
        <p className="text-xl">
          <span className="font-medium text-gray-700">Confidence:</span>{' '}
          <span className="text-blue-600 font-bold">{(result.confidence * 100).toFixed(2)}%</span>
        </p>
      </div>
    </div>
  );
};

export default RecognitionResults;