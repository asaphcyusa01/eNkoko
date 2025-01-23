import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Module {
  id: string;
  course_id: string;
  title: string;
  type: 'video' | 'reading';
  content: string;
  duration: string;
  order: number;
}

export function useModules(courseId: string) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  async function fetchModules() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order', { ascending: true });

      if (error) throw error;
      setModules(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function addModule(module: Omit<Module, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('modules')
        .insert(module)
        .select()
        .single();

      if (error) throw error;
      setModules(prev => [...prev, data]);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function updateModule(id: string, updates: Partial<Module>) {
    try {
      const { data, error } = await supabase
        .from('modules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setModules(prev => prev.map(module => 
        module.id === id ? { ...module, ...data } : module
      ));
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function deleteModule(id: string) {
    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setModules(prev => prev.filter(module => module.id !== id));
    } catch (error) {
      throw error;
    }
  }

  return {
    modules,
    loading,
    error,
    addModule,
    updateModule,
    deleteModule,
    refreshModules: fetchModules
  };
}