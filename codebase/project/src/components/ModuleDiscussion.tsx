import React, { useState } from 'react';
import { useComments } from '../hooks/useComments';
import { MessageSquare, Pencil, Trash2, Save, X, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ModuleDiscussionProps {
  moduleId: string;
}

export default function ModuleDiscussion({ moduleId }: ModuleDiscussionProps) {
  const { comments, loading, addComment, updateComment, deleteComment, getReplies } = useComments(moduleId);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<{ id: string; content: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string; userName: string } | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());
  const [replies, setReplies] = useState<{ [key: string]: any[] }>({});

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdateComment = async (id: string) => {
    if (!editingComment || !editingComment.content.trim()) return;

    try {
      await updateComment(id, editingComment.content);
      setEditingComment(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm('Uremeza ko ushaka gusiba iyi comment?')) return;

    try {
      await deleteComment(id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyContent.trim()) return;

    try {
      await addComment(replyContent, replyingTo.id);
      setReplyContent('');
      setReplyingTo(null);
      await loadReplies(replyingTo.id);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const loadReplies = async (commentId: string) => {
    try {
      setLoadingReplies(prev => new Set(prev).add(commentId));
      const repliesData = await getReplies(commentId);
      setReplies(prev => ({ ...prev, [commentId]: repliesData }));
      setExpandedComments(prev => new Set(prev).add(commentId));
    } catch (error) {
      console.error('Error loading replies:', error);
    } finally {
      setLoadingReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const toggleReplies = async (commentId: string) => {
    if (expandedComments.has(commentId)) {
      setExpandedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    } else if (!replies[commentId]) {
      await loadReplies(commentId);
    } else {
      setExpandedComments(prev => new Set(prev).add(commentId));
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
      <form onSubmit={handleAddComment} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Andika igitekerezo cyawe hano..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3}
        ></textarea>
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Tanga Igitekerezo
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg border">
            {editingComment?.id === comment.id ? (
              <div className="space-y-4">
                <textarea
                  value={editingComment.content}
                  onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingComment(null)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleUpdateComment(comment.id)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                  >
                    <Save className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{comment.user_name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('rw-RW')}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap mb-4">{comment.content}</p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReplyingTo({ id: comment.id, userName: comment.user_name })}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                    >
                      <Reply className="h-4 w-4" />
                      <span className="text-sm">Subiza</span>
                    </button>
                    {comment.replies_count > 0 && (
                      <button
                        onClick={() => toggleReplies(comment.id)}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-700"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">{comment.replies_count} ibisubizo</span>
                        {expandedComments.has(comment.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingComment({ id: comment.id, content: comment.content })}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {replyingTo?.id === comment.id && (
              <form onSubmit={handleAddReply} className="mt-4 pl-8 border-l-2 border-gray-200">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Subiza {replyingTo.userName}
                  </p>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Andika igisubizo cyawe hano..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={2}
                  ></textarea>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Reka
                    </button>
                    <button
                      type="submit"
                      disabled={!replyContent.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Ohereza
                    </button>
                  </div>
                </div>
              </form>
            )}

            {expandedComments.has(comment.id) && (
              <div className="mt-4 pl-8 space-y-4 border-l-2 border-gray-200">
                {loadingReplies.has(comment.id) ? (
                  <div className="text-center py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mx-auto"></div>
                  </div>
                ) : (
                  replies[comment.id]?.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{reply.user_name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(reply.created_at).toLocaleDateString('rw-RW')}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}