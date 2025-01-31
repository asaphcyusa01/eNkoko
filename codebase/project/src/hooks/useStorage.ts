import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useStorage(bucket: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    try {
      setLoading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading file');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (path: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (deleteError) throw deleteError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting file');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadFile,
    deleteFile,
    loading,
    error
  };
}