"use client";

import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { Heart, Reply, Send, MoreHorizontal, Trash2 } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import config from "@/types/config";
import { apiRequest } from "@/services/requests/apiRequest";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  parent_comment_id?: number;
  user: {
    id: number;
    name: string;
    rol?: string;
    student?: { photo_pic?: string };
    company?: { logo?: string };
    institution?: { logo?: string };
  };
  replies?: Comment[];
}

interface CommentProps {
  publicationId: number;
  isOpen: boolean;
  onClose: () => void;
  onCommentChange?: () => void;
}

export default function CommentModal({ publicationId, isOpen, onClose, onCommentChange }: CommentProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const { userData, allUsers } = useContext(AuthContext);

  const getUserAvatar = (userId: number) => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return "/default-avatar.png";

    if (user.rol === "student" && user.student?.photo_pic) {
      return user.student.photo_pic.startsWith('http') ? user.student.photo_pic : `${config.storageUrl}${user.student.photo_pic}`;
    } else if (user.rol === "company" && user.company?.logo) {
      return user.company.logo.startsWith('http') ? user.company.logo : `${config.storageUrl}${user.company.logo}`;
    } else if (user.rol === "institutions" && user.institution?.logo) {
      return user.institution.logo.startsWith('http') ? user.institution.logo : `${config.storageUrl}${user.institution.logo}`;
    }
    return "/default-avatar.png";
  };

  const getUserName = (userId: number) => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return "Usuario";

    if (user.rol === "student") {
      return user.student?.name || user.name;
    } else if (user.rol === "company") {
      return user.company?.name || user.name;
    } else if (user.rol === "institutions") {
      return user.institution?.name || user.name;
    }
    return user.name;
  };

  useEffect(() => {
    if (isOpen) fetchComments();
  }, [isOpen, publicationId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest(`publications/${publicationId}/comments`, 'GET');
      if (response.status === 'success' && Array.isArray(response.data)) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await apiRequest(`publications/${publicationId}/comments`, 'POST', {
        content: newComment,
        parent_comment_id: replyingTo?.id || null
      });
      if (response.status === 'success') {
        setComments(prev => [...prev, response.data]);
        setNewComment("");
        setReplyingTo(null);
        onCommentChange?.();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await apiRequest(`publications/${publicationId}/comments/${commentId}`, 'DELETE');
      if (response.status === 'success') {
        fetchComments();
        onCommentChange?.();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const canDelete = userData?.id === comment.user_id;
    return (
      <div key={comment.id} className={`flex space-x-3 pb-4 ${!isReply ? 'border-b' : 'mt-4'}`}>
        <div className="w-10 h-10 flex-shrink-0">
          <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden relative">
            <Image
              src={getUserAvatar(comment.user_id)}
              alt={getUserName(comment.user_id)}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-start">
              <p className="font-semibold text-gray-900">{getUserName(comment.user_id)}</p>
              {canDelete && (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === comment.id ? null : comment.id)}
                    className="p-1 hover:bg-gray-200 rounded-full"
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                  </button>
                  {openMenuId === comment.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <button
                        onClick={() => {
                          handleDeleteComment(comment.id);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="text-gray-700 mt-1">{comment.content}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{new Date(comment.created_at).toLocaleDateString()}</span>
              {!isReply && (
                <button
                  onClick={() => setReplyingTo(comment)}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <Reply className="w-4 h-4" />
                  Responder
                </button>
              )}
            </div>
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 space-y-2">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[80vh] overflow-hidden mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Comentarios</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto max-h-[50vh]">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Cargando comentarios...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No hay comentarios aún</div>
          ) : (
            comments.map(comment => renderComment(comment))
          )}
        </div>
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex-shrink-0">
              <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden relative">
                <Image
                  src={userData ? getUserAvatar(userData.id) : "/default-avatar.png"}
                  alt="Tu avatar"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1">
                {replyingTo && (
                  <div className="mb-2 text-sm text-gray-600 flex items-center justify-between">
                    <span>Respondiendo a {getUserName(replyingTo.user_id)}</span>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={replyingTo ? "Escribe una respuesta..." : "Escribe un comentario..."}
                  className="w-full bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => { if (e.key === 'Enter') handleSubmitComment(); }}
                />
              </div>
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
