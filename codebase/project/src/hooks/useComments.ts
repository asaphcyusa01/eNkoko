import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Comment {
  id: string;
  module_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent_id: string | null;
  replies_count: number;
}

export function useComments(moduleId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (moduleId) {
      fetchComments();
      subscribeToComments();
    }
    return () => {
      supabase.channel('comments').unsubscribe();
    };
  }, [moduleId]);

  async function fetchComments() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          replies_count:comments(count)
        `)
        .eq('module_id', moduleId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  function subscribeToComments() {
    supabase
      .channel('comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `module_id=eq.${moduleId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();
  }

  async function addComment(content: string, parentId: string | null = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('comments')
        .insert({
          module_id: moduleId,
          user_id: user.id,
          user_name: user.user_metadata.full_name || 'Anonymous',
          content,
          parent_id: parentId
        })
        .select()
        .single();

      if (error) throw error;
      if (!parentId) {
        setComments(prev => [data, ...prev]);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function updateComment(id: string, content: string) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setComments(prev => prev.map(comment => 
        comment.id === id ? data : comment
      ));
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function deleteComment(id: string) {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setComments(prev => prev.filter(comment => comment.id !== id));
    } catch (error) {
      throw error;
    }
  }

  async function getReplies(parentId: string) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('parent_id', parentId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    getReplies,
    refreshComments: fetchComments
  };
}