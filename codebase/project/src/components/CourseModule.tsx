import React from 'react';
import { Play, FileText, CheckCircle2, Lock } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading';
  completed: boolean;
  locked: boolean;
}

interface CourseModuleProps {
  module: Module;
  onModuleClick: (moduleId: string) => void;
}

export default function CourseModule({ module, onModuleClick }: CourseModuleProps) {
  return (
    <button
      onClick={() => !module.locked && onModuleClick(module.id)}
      className={`w-full text-left p-4 rounded-lg mb-2 transition-all duration-200 ${
        module.locked 
          ? 'bg-gray-100 cursor-not-allowed' 
          : module.completed
          ? 'bg-green-50 hover:bg-green-100'
          : 'bg-white hover:bg-gray-50'
      } border`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {module.type === 'video' ? (
            <Play className="h-5 w-5 text-orange-600" />
          ) : (
            <FileText className="h-5 w-5 text-orange-600" />
          )}
          <div>
            <h4 className="font-medium">{module.title}</h4>
            <p className="text-sm text-gray-600">{module.duration}</p>
          </div>
        </div>
        {module.locked ? (
          <Lock className="h-5 w-5 text-gray-400" />
        ) : module.completed ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : null}
      </div>
    </button>
  );
}