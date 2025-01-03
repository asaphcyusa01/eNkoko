import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface CourseProgressProps {
  totalModules: number;
  completedModules: number;
}

export default function CourseProgress({ totalModules, completedModules }: CourseProgressProps) {
  const progress = (completedModules / totalModules) * 100;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Aho Ugeze mu Isomo</h3>
        <span className="text-green-600">{completedModules}/{totalModules} amasomo</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        <CheckCircle2 className="inline-block w-4 h-4 mr-1 text-green-600" />
        {Math.round(progress)}% Byarangiye
      </p>
    </div>
  );
}