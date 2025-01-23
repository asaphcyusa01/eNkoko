import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Course } from '../types';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data as Course[]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function addCourse(course: Omit<Course, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert(course)
        .select()
        .single();

      if (error) throw error;
      setCourses(prev => [data as Course, ...prev]);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function updateCourse(id: string, updates: Partial<Course>) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCourses(prev => prev.map(course => 
        course.id === id ? { ...course, ...data } : course
      ));
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function deleteCourse(id: string) {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (error) {
      throw error;
    }
  }

  return {
    courses,
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    refreshCourses: fetchCourses
  };
}