'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-context';
import { useSocket } from '@/contexts/socket-context';
import { useGetAllUsers } from '@/hooks/use-admin';
import {
  useAdminActiveChats,
  useAssignChat,
  useChatConversation,
  useChatMessages,
  useCloseChat,
  useDeleteChat,
  useResolveChat,
  useSendChatMessage,
} from '@/hooks/use-chat';
import { ChatConversation } from '@/types/chat';
import { useQueryClient } from '@tanstack/react-query';
import { Clock, MessageCircle, User, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const formatTime = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  });
};

export default function AdminSupportPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [page] = useState(1);
  const [pageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'resolved' | 'closed'
  >('active');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignStaffId, setAssignStaffId] = useState('');
  const { user: currentUser } = useAuth();
  const { socket, isConnected, joinChat, leaveChat } = useSocket();
  const queryClient = useQueryClient();

  const {
    data: activeChats,
    isLoading: loadingChats,
    error: chatsError,
  } = useAdminActiveChats(page, 20, statusFilter);

  const selectedChatQuery = useChatConversation(selectedChatId ?? '');
  const messagesQuery = useChatMessages(selectedChatId ?? '', page, pageSize);
  const sendMessageMutation = useSendChatMessage(selectedChatId ?? '');
  const resolveChatMutation = useResolveChat(selectedChatId ?? '');
  const closeChatMutation = useCloseChat(selectedChatId ?? '');
  const deleteChatMutation = useDeleteChat(selectedChatId ?? '');
  const assignChatMutation = useAssignChat(selectedChatId ?? '');
  const { data: staffMembers = [] } = useGetAllUsers('admin');
  const { data: moderators = [] } = useGetAllUsers('moderator');

  const chats = (activeChats?.data || []).filter(
    (chat) => chat.createdBy._id !== currentUser?._id
  );
  const selectedChat = selectedChatQuery.data;
  const messages = messagesQuery.data?.messages || selectedChat?.messages || [];
  const availableStaff = [...staffMembers, ...moderators].filter(
    (staff) => staff._id !== currentUser?._id
  );

  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      setSelectedChatId(chats[0]._id);
      return;
    }

    if (
      selectedChatId &&
      chats.length > 0 &&
      !chats.some((chat) => chat._id === selectedChatId)
    ) {
      setSelectedChatId(chats[0]._id);
    }
  }, [chats, selectedChatId]);

  useEffect(() => {
    if (!socket || !selectedChatId || !isConnected) return;

    joinChat(selectedChatId);

    return () => {
      leaveChat(selectedChatId);
    };
  }, [socket, selectedChatId, isConnected, joinChat, leaveChat]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageCreated = (payload: { chatId: string }) => {
      if (payload.chatId === selectedChatId) {
        queryClient.invalidateQueries({
          queryKey: ['chat-messages', selectedChatId],
        });
        queryClient.invalidateQueries({
          queryKey: ['chat-conversation', selectedChatId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ['admin-active-chats', page, pageSize],
      });
    };

    const handleChatUpdated = (payload: { chatId: string }) => {
      if (payload.chatId === selectedChatId) {
        queryClient.invalidateQueries({
          queryKey: ['chat-conversation', selectedChatId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ['admin-active-chats', page, pageSize],
      });
    };

    socket.on('message.created', handleMessageCreated);
    socket.on('chat.updated', handleChatUpdated);
    socket.on('chat.assigned', handleChatUpdated);
    socket.on('chat.resolved', handleChatUpdated);
    socket.on('chat.closed', handleChatUpdated);

    return () => {
      socket.off('message.created', handleMessageCreated);
      socket.off('chat.updated', handleChatUpdated);
      socket.off('chat.assigned', handleChatUpdated);
      socket.off('chat.resolved', handleChatUpdated);
      socket.off('chat.closed', handleChatUpdated);
    };
  }, [socket, selectedChatId, page, pageSize, queryClient]);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [messages.length, selectedChatId]);

  const handleSelectChat = (chat: ChatConversation) => {
    setSelectedChatId(chat._id);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChatId) return;

    try {
      await sendMessageMutation.mutateAsync(message.trim());
      setMessage('');
      toast.success('Message sent to customer');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  const handleResolveChat = async () => {
    if (!selectedChatId) return;

    try {
      await resolveChatMutation.mutateAsync();
      toast.success('Chat marked as resolved');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resolve chat');
    }
  };

  const handleCloseChat = async () => {
    if (!selectedChatId) return;

    try {
      await closeChatMutation.mutateAsync();
      toast.success('Chat closed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to close chat');
    }
  };

  const handleDeleteChat = async () => {
    if (!selectedChatId) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this resolved chat? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await deleteChatMutation.mutateAsync();
      setSelectedChatId(null);
      toast.success('Chat deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete chat');
    }
  };

  const handleAssignChat = async () => {
    if (!assignStaffId.trim() || !selectedChatId) return;

    try {
      await assignChatMutation.mutateAsync(assignStaffId.trim());
      toast.success('Chat assigned successfully');
      setAssignStaffId('');
      setShowAssignModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign chat');
    }
  };

  const chatCount = chats.length;
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-emerald-100 text-emerald-700';
      case 'resolved':
        return 'bg-blue-100 text-blue-700';
      case 'closed':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const content = useMemo(() => {
    if (loadingChats) {
      return (
        <div className='flex min-h-[240px] items-center justify-center'>
          <Spinner className='w-8 h-8' />
        </div>
      );
    }

    if (chatsError) {
      return (
        <div className='p-6 text-sm text-destructive'>
          Failed to load support chats. Please refresh.
        </div>
      );
    }

    if (chats.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <MessageCircle className='w-12 h-12 text-muted-foreground mb-3 opacity-40' />
          <p className='text-sm text-muted-foreground'>
            No active support conversations
          </p>
          <p className='text-xs text-muted-foreground mt-1'>
            Conversations will appear here
          </p>
        </div>
      );
    }

    return (
      <div className='space-y-2'>
        {chats.map((chat) => {
          const isSelected = chat._id === selectedChatId;
          return (
            <button
              key={chat._id}
              type='button'
              onClick={() => handleSelectChat(chat)}
              className={`w-full text-left transition-all duration-200 rounded-xl border-2 p-4 ${
                isSelected
                  ? 'border-primary bg-primary/8 shadow-sm'
                  : 'border-border bg-card hover:border-primary/30 hover:bg-muted/50'
              }`}
            >
              <div className='flex items-start justify-between gap-2 mb-3'>
                <div className='flex-1 min-w-0'>
                  <p className='font-semibold text-foreground truncate text-sm'>
                    {chat.subject || `Support #${chat._id.slice(-6)}`}
                  </p>
                  <div className='flex items-center gap-1 mt-1.5'>
                    <User className='w-3 h-3 text-muted-foreground flex-shrink-0' />
                    <p className='text-xs text-muted-foreground truncate'>
                      {chat.createdBy?.name || 'Unknown'} •{' '}
                      {chat.createdBy?.email || 'No email'}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase whitespace-nowrap flex-shrink-0 ${getStatusColor(chat.status)}`}
                >
                  {chat.status}
                </span>
              </div>
              <div className='flex items-center justify-between gap-2 text-xs'>
                <span className='text-muted-foreground truncate line-clamp-1'>
                  {chat.lastMessage || 'No messages yet'}
                </span>
                <span className='text-muted-foreground flex-shrink-0 flex items-center gap-1'>
                  <Clock className='w-3 h-3' />
                  {chat.lastMessageAt ? formatTime(chat.lastMessageAt) : '—'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }, [chats, chatsError, loadingChats, selectedChatId]);

  return (
    <main className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-10'>
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
            <div>
              <h1 className='text-4xl sm:text-5xl font-bold text-foreground text-balance tracking-tight'>
                Support Center
              </h1>
              <p className='mt-3 text-base text-muted-foreground max-w-xl'>
                Manage customer conversations and provide support in real-time.
              </p>
            </div>
            <div className='inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/8 border-2 border-primary/20'>
              <MessageCircle className='w-5 h-5 text-primary' />
              <div>
                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                  Active
                </p>
                <p className='text-2xl font-bold text-foreground'>
                  {chatCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className='grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6'>
          {/* Conversations Sidebar */}
          <section className='rounded-2xl border-2 border-border bg-card p-5 shadow-sm h-fit xl:h-[calc(100vh-180px)] xl:sticky xl:top-8 overflow-hidden flex flex-col'>
            <div className='mb-5 pb-4 border-b-2 border-border'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                <div>
                  <h2 className='text-lg font-bold text-foreground'>
                    Conversations
                  </h2>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {chatCount} {chatCount === 1 ? 'chat' : 'chats'} waiting
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <label className='text-xs font-medium text-muted-foreground'>
                    Status:
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value as
                          | 'all'
                          | 'active'
                          | 'resolved'
                          | 'closed'
                      )
                    }
                    className='rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                  >
                    <option value='all'>All</option>
                    <option value='active'>Active</option>
                    <option value='resolved'>Resolved</option>
                    <option value='closed'>Closed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='flex-1 overflow-y-auto pr-2 space-y-0'>
              {content}
            </div>
          </section>

          {/* Chat Panel */}
          <section className='rounded-2xl border-2 border-border bg-card p-6 shadow-sm flex flex-col'>
            {!selectedChat ? (
              <div className='flex flex-col items-center justify-center h-full text-center'>
                <MessageCircle className='w-16 h-16 text-muted-foreground mb-4 opacity-20' />
                <h3 className='text-lg font-semibold text-foreground mb-2'>
                  No conversation selected
                </h3>
                <p className='text-sm text-muted-foreground max-w-xs'>
                  Select a conversation from the list to start responding to
                  customers.
                </p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className='pb-4 border-b border-border mb-4'>
                  <div className='flex items-start justify-between gap-3 mb-3'>
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-base font-bold text-foreground'>
                        {selectedChat.subject || 'Support Conversation'}
                      </h3>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {selectedChat.createdBy?.name || 'Unknown'} •{' '}
                        {selectedChat.createdBy?.email || 'No email'}
                      </p>
                    </div>
                    <div
                      className={`rounded-full px-2.5 py-1 font-semibold text-xs whitespace-nowrap flex-shrink-0 ${getStatusColor(selectedChat.status)}`}
                    >
                      {selectedChat.status.charAt(0).toUpperCase() +
                        selectedChat.status.slice(1)}
                    </div>
                  </div>

                  <div className='flex flex-wrap items-center gap-2 text-xs mb-3'>
                    <span className='text-muted-foreground'>Assigned to:</span>
                    <span className='font-semibold text-foreground'>
                      {selectedChat.assignedTo?.name || 'Unassigned'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex flex-wrap gap-2'>
                    <Button
                      onClick={() => setShowAssignModal(true)}
                      variant='outline'
                      size='sm'
                      className='text-xs'
                    >
                      Assign
                    </Button>
                    {selectedChat.status !== 'resolved' && (
                      <Button
                        onClick={handleResolveChat}
                        disabled={resolveChatMutation.isPending}
                        variant='outline'
                        size='sm'
                        className='text-xs'
                      >
                        {resolveChatMutation.isPending
                          ? 'Resolving...'
                          : 'Resolve'}
                      </Button>
                    )}
                    {selectedChat.status !== 'closed' && (
                      <Button
                        onClick={handleCloseChat}
                        disabled={closeChatMutation.isPending}
                        variant='destructive'
                        size='sm'
                        className='text-xs'
                      >
                        {closeChatMutation.isPending ? 'Closing...' : 'Close'}
                      </Button>
                    )}
                    {currentUser?.role === 'admin' &&
                      selectedChat.status === 'resolved' && (
                        <Button
                          onClick={handleDeleteChat}
                          disabled={deleteChatMutation.isPending}
                          variant='destructive'
                          size='sm'
                          className='text-xs'
                        >
                          {deleteChatMutation.isPending
                            ? 'Deleting...'
                            : 'Delete'}
                        </Button>
                      )}
                  </div>
                </div>

                {/* Messages Area */}
                <div className='flex-1 overflow-hidden mb-5'>
                  <div
                    ref={panelRef}
                    className='space-y-4 overflow-y-auto pr-2 pb-4 max-h-[calc(100vh-28rem)]'
                  >
                    {messages.length === 0 ? (
                      <div className='rounded-3xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground'>
                        No messages yet. Write the first reply to start the
                        conversation.
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isAdmin = message.sender.role !== 'user';
                        return (
                          <div
                            key={message._id}
                            className={`flex gap-2 ${isAdmin ? 'flex-row-reverse justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${isAdmin ? 'bg-primary text-primary-foreground' : 'bg-slate-200 text-slate-700'}`}
                            >
                              {isAdmin ? 'S' : 'C'}
                            </div>
                            <div
                              className={`flex flex-col gap-1 max-w-xs ${isAdmin ? 'items-end' : 'items-start'}`}
                            >
                              <p className='text-xs font-medium text-muted-foreground px-2'>
                                {message.sender.name}
                              </p>
                              <div
                                className={`rounded-xl px-3 py-2 text-sm leading-relaxed break-words ${
                                  isAdmin
                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                    : 'bg-muted text-foreground rounded-tl-none'
                                }`}
                              >
                                {message.content}
                              </div>
                              <p className='text-xs text-muted-foreground px-2'>
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Input Area */}
                <div className='border-t-2 border-border pt-5'>
                  <Textarea
                    className='min-h-[100px] mb-4 resize-none rounded-xl'
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder='Type your response here...'
                  />
                  <div className='flex items-center justify-between gap-3'>
                    <p className='text-xs text-muted-foreground font-medium'>
                      {selectedChat.participants.length} participant
                      {selectedChat.participants.length !== 1 ? 's' : ''}
                    </p>
                    <Button
                      onClick={handleSendMessage}
                      disabled={
                        !message.trim() || sendMessageMutation.isPending
                      }
                      className='font-semibold'
                    >
                      {sendMessageMutation.isPending
                        ? 'Sending...'
                        : 'Send Reply'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      {/* Assign Chat Modal */}
      {showAssignModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-background border-2 border-border rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95'>
            {/* Modal Header */}
            <div className='border-b-2 border-border px-6 py-5 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-foreground'>Assign Chat</h2>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setAssignStaffId('');
                }}
                className='p-1 hover:bg-muted rounded-lg transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='p-6 space-y-5'>
              <div>
                <label className='block text-sm font-semibold text-foreground mb-3'>
                  Select Staff Member
                </label>
                <select
                  value={assignStaffId}
                  onChange={(e) => setAssignStaffId(e.target.value)}
                  className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium'
                >
                  <option value=''>-- Choose Staff --</option>
                  {availableStaff.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.name} ({staff.role})
                    </option>
                  ))}
                </select>
                {availableStaff.length === 0 && (
                  <p className='text-xs text-muted-foreground mt-3 font-medium'>
                    No available staff members
                  </p>
                )}
              </div>

              <div className='flex gap-3 justify-end pt-2'>
                <Button
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssignStaffId('');
                  }}
                  variant='outline'
                  className='font-semibold'
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignChat}
                  disabled={
                    !assignStaffId.trim() || assignChatMutation.isPending
                  }
                  className='font-semibold'
                >
                  {assignChatMutation.isPending ? 'Assigning...' : 'Assign'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
