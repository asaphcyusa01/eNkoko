import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Note {
  id: string;
  module_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function useNotes(moduleId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (moduleId) {
      fetchNotes();
    }
  }, [moduleId]);

  async function fetchNotes() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('module_id', moduleId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function addNote(content: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .insert({
          module_id: moduleId,
          user_id: user.id,
          content
        })
        .select()
        .single();

      if (error) throw error;
      setNotes(prev => [data, ...prev]);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function updateNote(id: string, content: string) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setNotes(prev => prev.map(note => 
        note.id === id ? data : note
      ));
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function deleteNote(id: string) {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (error) {
      throw error;
    }
  }

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    refreshNotes: fetchNotes
  };
}