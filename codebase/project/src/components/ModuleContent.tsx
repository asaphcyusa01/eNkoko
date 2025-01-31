import React, { useState } from 'react';
import { Play, FileText, CheckCircle2, BookOpen, MessageSquare } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import ModuleNotes from './ModuleNotes';
import ModuleDiscussion from './ModuleDiscussion';

interface ModuleContentProps {
  module: {
    id: string;
    title: string;
    type: 'video' | 'reading';
    content: string;
    duration: string;
  };
}

export default function ModuleContent({ module }: ModuleContentProps) {
  const { progress, markAsCompleted, loading } = useProgress(module.id);
  const [showNotes, setShowNotes] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);

  const handleComplete = async () => {
    try {
      await markAsCompleted();
    } catch (error) {
      console.error('Error marking module as completed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {module.type === 'video' ? (
              <Play className="h-6 w-6 text-orange-600" />
            ) : (
              <FileText className="h-6 w-6 text-orange-600" />
            )}
            <h2 className="text-2xl font-bold">{module.title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setShowNotes(!showNotes);
                setShowDiscussion(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-300"
            >
              <BookOpen className="h-5 w-5" />
              <span>{showNotes ? 'Hisha Notes' : 'Erekana Notes'}</span>
            </button>
            <button
              onClick={() => {
                setShowDiscussion(!showDiscussion);
                setShowNotes(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-300"
            >
              <MessageSquare className="h-5 w-5" />
              <span>{showDiscussion ? 'Hisha Ibiganiro' : 'Erekana Ibiganiro'}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{module.duration}</span>
              {progress?.completed && (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
            </div>
          </div>
        </div>

        {module.type === 'video' ? (
          <div className="aspect-video bg-gray-100 rounded-lg mb-6">
            <iframe
              src={module.content}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="prose max-w-none mb-6">
            {module.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        <button
          onClick={handleComplete}
          disabled={loading || progress?.completed}
          className={`w-full py-3 rounded-lg text-white transition duration-300 ${
            progress?.completed
              ? 'bg-green-600 cursor-not-allowed'
              : loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          {progress?.completed
            ? 'Warangije'
            : loading
            ? 'Tegereza gato...'
            : 'Rangiza Inyigisho'}
        </button>
      </div>

      {showNotes && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Notes</h3>
          <ModuleNotes moduleId={module.id} />
        </div>
      )}

      {showDiscussion && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Ibiganiro</h3>
          <ModuleDiscussion moduleId={module.id} />
        </div>
      )}
    </div>
  );
}