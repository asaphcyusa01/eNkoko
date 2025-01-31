import React, { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import { Pencil, Trash2, Save, X } from 'lucide-react';

interface ModuleNotesProps {
  moduleId: string;
}

export default function ModuleNotes({ moduleId }: ModuleNotesProps) {
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes(moduleId);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<{ id: string; content: string } | null>(null);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await addNote(newNote);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleUpdateNote = async (id: string) => {
    if (!editingNote || !editingNote.content.trim()) return;

    try {
      await updateNote(id, editingNote.content);
      setEditingNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!window.confirm('Uremeza ko ushaka gusiba iyi note?')) return;

    try {
      await deleteNote(id);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddNote} className="space-y-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Andika note yawe hano..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3}
        ></textarea>
        <button
          type="submit"
          disabled={!newNote.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Ongeramo Note
        </button>
      </form>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white p-4 rounded-lg border">
            {editingNote?.id === note.id ? (
              <div className="space-y-4">
                <textarea
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingNote(null)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleUpdateNote(note.id)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                  >
                    <Save className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 whitespace-pre-wrap mb-4">{note.content}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingNote({ id: note.id, content: note.content })}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}