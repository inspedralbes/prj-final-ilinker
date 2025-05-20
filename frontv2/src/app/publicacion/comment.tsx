"use client";

import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { Heart, Reply, Send, MoreHorizontal, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import config from "@/types/config";
import { apiRequest } from "@/services/requests/apiRequest";
import ReplyThread from "@/components/comments/ReplyThread";

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
  const [expandedComments, setExpandedComments] = useState<boolean>(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
  const { userData, allUsers } = useContext(AuthContext);

  // Guardar el estado de comentarios expandidos en localStorage
  useEffect(() => {
    // Cargar el estado guardado al iniciar
    const savedExpandedReplies = localStorage.getItem('expandedReplies');
    const savedExpandedComments = localStorage.getItem('expandedComments');

    if (savedExpandedReplies) {
      setExpandedReplies(new Set(JSON.parse(savedExpandedReplies)));
    }

    if (savedExpandedComments) {
      setExpandedComments(JSON.parse(savedExpandedComments));
    }
  }, []);

  // Guardar el estado cada vez que cambie
  useEffect(() => {
    // Guardar en localStorage si todos los comentarios estan expandidos
    localStorage.setItem('expandedComments', JSON.stringify(expandedComments));
  }, [expandedComments]);

  useEffect(() => {
    // Guardar en localStorage que comentarios estan expandidos
    localStorage.setItem('expandedReplies', JSON.stringify([...expandedReplies]));
  }, [expandedReplies]);

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

  // Función para obtener los comentarios desde bd usando api
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
        const currentUser = allUsers.find(u => u.id === userData?.id);
        const newCommentData = {
          ...response.data,
          user: currentUser,
          replies: []
        };

        // Update comments state immediately with the new comment
        if (replyingTo) {
          // Get the parent comment and add reply directly to it
          const parentComment = comments.find(c => c.id === replyingTo.id) || 
                              comments.find(c => c.replies?.some(r => r.id === replyingTo.id));

          if (parentComment) {
            setComments(prev => prev.map(comment => {
              if (comment.id === parentComment.id) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), { 
                    ...newCommentData, 
                    parent_comment_id: parentComment.id 
                  }]
                };
              }
              return comment;
            }));
          }

          // Automáticamente expandir las respuesta del comentario al que se está respondiendo
          setExpandedReplies(prev => {
            const newSet = new Set(prev);
            newSet.add(replyingTo.id);
            return newSet;
          });
        } else {
          setComments(prev => [...prev, newCommentData]);
        }
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

  const toggleReplies = (commentId: number) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Nueva función para manejar el click en responder usando ReplyThread
  const handleReplyClick = (reply: Comment) => {
    setReplyingTo(reply);
  };

  // Nueva función para renderizar comentarios usando ReplyThread
  const renderCommentsWithReplyThread = () => {
    // Si solo se muestran los primeros 3 comentarios
    const visibleComments = expandedComments ? comments : comments.slice(0, 3);
    return visibleComments.map(comment => (
      <ReplyThread
        key={comment.id}
        reply={comment}
        handleReplyClick={handleReplyClick}
      />
    ));
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
            <div className="space-y-4">
              {renderCommentsWithReplyThread()}
              {comments.length > 3 && (
                <div className="text-center">
                  <button
                    onClick={() => setExpandedComments(!expandedComments)}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-700"
                  >
                    <div className="flex items-center gap-1">
                      {expandedComments ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          <span>Mostrar menos</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          <span>{`Ver ${comments.length - 3} más`}</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex-shrink-0">
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
            <div className="flex-1">
              {replyingTo && (
                <div className="mb-2 text-sm text-gray-600 flex items-center justify-between">
                  <span>Respondiendo a <b>{getUserName(replyingTo.user_id)}</b></span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={replyingTo ? "Escribe una respuesta..." : "Agrega un comentario..."}
                  className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => { if (e.key === 'Enter') handleSubmitComment(); }}
                />
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
    </div>
  );
}
