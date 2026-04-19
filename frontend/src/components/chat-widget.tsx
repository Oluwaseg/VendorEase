'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-context';
import { useSocket } from '@/contexts/socket-context';
import {
  useChatMessages,
  useMarkChatRead,
  useSendChatMessage,
  useSupportChat,
} from '@/hooks/use-chat';
import { ChatMessage } from '@/types/chat';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const formatTime = (isoDate?: string) => {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ChatWidget() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { socket, isConnected, joinChat, leaveChat, sendTyping, stopTyping } =
    useSocket();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [page] = useState(1);
  const [pageSize] = useState(50);
  const [chatId, setChatId] = useState<string | null>(null);
  const [hasMarkedRead, setHasMarkedRead] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [someoneTyping, setSomeoneTyping] = useState<string | null>(null);
  const [realTimeMessages, setRealTimeMessages] = useState<ChatMessage[]>([]);

  const {
    mutateAsync: createSupportChat,
    data: supportChat,
    isPending: creatingSupport,
    isSuccess: supportChatLoaded,
  } = useSupportChat();

  const messagesQuery = useChatMessages(chatId ?? '', page, pageSize);
  const sendMessageMutation = useSendChatMessage(chatId ?? '');
  const markReadMutation = useMarkChatRead(chatId ?? '');

  const messages = messagesQuery.data?.messages || [];
  const isLoadingMessages = messagesQuery.isLoading || messagesQuery.isFetching;

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated && !supportChat && !creatingSupport) {
      createSupportChat().catch((error) => {
        toast.error(error.message || 'Could not open support chat');
      });
    }
  }, [
    createSupportChat,
    isAuthenticated,
    isOpen,
    supportChat,
    creatingSupport,
  ]);

  useEffect(() => {
    if (supportChat?._id && !hasMarkedRead) {
      setChatId(supportChat._id);
      markReadMutation.mutate();
      setHasMarkedRead(true);
    }
  }, [supportChat, hasMarkedRead, markReadMutation]);

  useEffect(() => {
    if (!socket || !chatId || !isConnected) return;

    joinChat(chatId);

    return () => {
      leaveChat(chatId);
    };
  }, [socket, chatId, isConnected, joinChat, leaveChat]);

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleMessageCreated = (payload: {
      chatId: string;
      message: ChatMessage;
    }) => {
      if (payload.chatId !== chatId) return;

      setRealTimeMessages((prev) =>
        prev.some((m) => m._id === payload.message._id)
          ? prev
          : [...prev, payload.message]
      );

      queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] });
      queryClient.invalidateQueries({
        queryKey: ['chat-conversation', chatId],
      });
    };

    const handleUserTyping = (payload: { conversationId: string }) => {
      if (payload.conversationId !== chatId) return;
      setSomeoneTyping('Support team is typing...');
    };

    const handleStopTyping = (payload: { conversationId: string }) => {
      if (payload.conversationId !== chatId) return;
      setSomeoneTyping(null);
    };

    socket.on('message.created', handleMessageCreated);
    socket.on('user.typing', handleUserTyping);
    socket.on('user.stop-typing', handleStopTyping);

    return () => {
      socket.off('message.created', handleMessageCreated);
      socket.off('user.typing', handleUserTyping);
      socket.off('user.stop-typing', handleStopTyping);
    };
  }, [socket, chatId, queryClient]);

  const hasMessages = messages.length > 0;

  // Combine API messages with real-time messages
  const allMessages = useMemo(() => {
    const combined = [...messages, ...realTimeMessages];
    // Remove duplicates based on _id
    const unique = combined.filter(
      (message, index, self) =>
        index === self.findIndex((m) => m._id === message._id)
    );
    // Sort by createdAt
    return unique.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages, realTimeMessages]);

  useEffect(() => {
    if (!isOpen) return;
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [allMessages.length, isOpen]);

  // Socket event listeners

  const handleSend = async () => {
    if (!draft.trim()) {
      return;
    }
    if (!chatId) {
      toast.error('Unable to send message yet. Please wait for chat to start.');
      return;
    }

    try {
      await sendMessageMutation.mutateAsync(draft.trim());
      setDraft('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  const content = useMemo(() => {
    if (authLoading) {
      return (
        <div className='flex h-full items-center justify-center'>
          <div className='text-center space-y-4'>
            <div className='flex justify-center'>
              <div className='relative h-10 w-10'>
                <div className='absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-800'></div>
                <div
                  className='absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin'
                  style={{ animationDuration: '1s' }}
                ></div>
              </div>
            </div>
            <p className='text-xs text-slate-600 dark:text-slate-400 font-medium'>
              Loading...
            </p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className='flex h-full flex-col items-center justify-center gap-6 p-8 text-center'>
          <div className='relative'>
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-400/10 blur-2xl'></div>
            <div className='relative rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 p-4 border border-blue-200 dark:border-blue-800'>
              <svg
                className='h-8 w-8 text-blue-600 dark:text-blue-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
            </div>
          </div>
          <div className='space-y-2'>
            <p className='text-sm font-semibold text-foreground'>
              Sign in to get support
            </p>
            <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs'>
              Please log in to start chatting with our support team
            </p>
          </div>
          <Link href='/login' className='w-full'>
            <Button className='w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium shadow-lg transition-all duration-200'>
              Sign in
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className='flex h-full flex-col overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800'>
        {/* Loading State */}
        {creatingSupport || isLoadingMessages ? (
          <div className='flex flex-1 items-center justify-center'>
            <div className='text-center space-y-4'>
              <div className='flex justify-center gap-2'>
                <div
                  className='h-2.5 w-2.5 animate-bounce rounded-full bg-blue-600'
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className='h-2.5 w-2.5 animate-bounce rounded-full bg-blue-600'
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className='h-2.5 w-2.5 animate-bounce rounded-full bg-blue-600'
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
              <p className='text-xs text-slate-600 dark:text-slate-400 font-medium'>
                {creatingSupport ? 'Opening chat...' : 'Loading...'}
              </p>
            </div>
          </div>
        ) : !allMessages.length ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center'>
            <div className='relative'>
              <div className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-400/10 blur-2xl'></div>
              <div className='relative rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 p-5 border border-blue-200 dark:border-blue-800'>
                <svg
                  className='h-8 w-8 text-blue-600 dark:text-blue-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2h-3l-4 4z'
                  />
                </svg>
              </div>
            </div>
            <div className='space-y-2'>
              <p className='text-sm font-semibold text-foreground'>
                Start a conversation
              </p>
              <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs'>
                Say hello! Our support team is ready to assist you.
              </p>
            </div>
          </div>
        ) : (
          <div
            ref={listRef}
            className='flex-1 space-y-4 overflow-y-auto px-6 py-6 flex flex-col'
          >
            {allMessages.map((message: ChatMessage, idx) => {
              const isMine = message.sender._id === supportChat?.createdBy._id;
              const isSupport = !isMine;
              return (
                <div
                  key={message._id}
                  className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    isMine ? 'flex-row-reverse self-end' : 'flex-row self-start'
                  } max-w-sm`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white ${
                      isMine ? 'bg-blue-600' : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                  >
                    {message.sender.name.charAt(0).toUpperCase()}
                  </div>
                  <div className='flex flex-col gap-1'>
                    {isSupport && (
                      <span className='text-xs font-semibold text-slate-600 dark:text-slate-300 px-2'>
                        {message.sender.name}
                      </span>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-all duration-200 ${
                        isMine
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-100 dark:bg-slate-700 text-foreground rounded-bl-none'
                      }`}
                    >
                      {message.content}
                    </div>
                    <span className='text-xs px-2 text-slate-500 dark:text-slate-400'>
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
            {someoneTyping && (
              <div className='flex gap-3 self-start max-w-sm animate-in fade-in duration-200'>
                <div className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white bg-slate-400 dark:bg-slate-600'>
                  S
                </div>
                <div className='flex flex-col gap-1'>
                  <span className='text-xs font-semibold text-slate-600 dark:text-slate-300 px-2'>
                    Support Agent
                  </span>
                  <div className='rounded-2xl rounded-bl-none bg-slate-100 dark:bg-slate-700 px-4 py-3 shadow-sm'>
                    <div className='flex gap-1.5'>
                      <div className='h-2 w-2 animate-bounce rounded-full bg-blue-600'></div>
                      <div
                        className='h-2 w-2 animate-bounce rounded-full bg-blue-600'
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className='h-2 w-2 animate-bounce rounded-full bg-blue-600'
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }, [
    authLoading,
    chatId,
    creatingSupport,
    draft,
    handleSend,
    hasMessages,
    isAuthenticated,
    isLoadingMessages,
    messages,
    sendMessageMutation.isPending,
    supportChat,
    someoneTyping,
  ]);

  return (
    <>
      {/* Chat Button - Modern floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label='Open chat'
          className='fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl shadow-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/60 hover:scale-110 active:scale-95'
        >
          {/* Message count badge */}
          {allMessages.length > 0 && isAuthenticated && (
            <div className='absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg'>
              {allMessages.length > 9 ? '9+' : allMessages.length}
            </div>
          )}
          <svg className='h-7 w-7' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z' />
          </svg>
        </button>
      )}

      {/* Full Screen Chat Modal */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200'
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Container - Full Screen on Mobile, Centered on Desktop */}
          <div className='fixed inset-0 z-50 flex items-end md:items-center md:justify-center animate-in fade-in duration-200 md:p-4'>
            <div className='w-full md:w-[600px] md:max-w-2xl h-full md:h-[90vh] md:rounded-2xl bg-background flex flex-col shadow-2xl md:shadow-2xl overflow-hidden'>
              {/* Header - Modern Design */}
              <div className='relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-6 py-6 text-white shadow-lg'>
                {/* Decorative blur element */}
                <div className='absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl'></div>

                <div className='relative flex items-start justify-between gap-4'>
                  <div className='flex-1'>
                    {/* Chat Label */}
                    <div className='flex items-center gap-2 mb-3'>
                      <svg
                        className='h-5 w-5'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z' />
                      </svg>
                      <span className='text-sm font-semibold tracking-wide'>
                        Chat
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className='text-xl font-bold leading-tight'>
                      Get Instant Support
                    </h2>

                    {/* Status */}
                    <div className='mt-2 flex items-center gap-2'>
                      <div className='h-2 w-2 rounded-full bg-green-300 animate-pulse'></div>
                      <span className='text-sm text-blue-50 opacity-90'>
                        Support team is online
                      </span>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label='Close chat'
                    className='mt-1 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 transition-colors hover:bg-white/30 focus:outline-none'
                  >
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className='flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800'>
                {content}
              </div>

              {/* Input Area */}
              <div className='border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 shadow-lg'>
                <div className='flex gap-3 items-end'>
                  <div className='flex-1 relative'>
                    <Textarea
                      className='resize-none rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-11 max-h-24'
                      placeholder='Type your message...'
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      disabled={!chatId || sendMessageMutation.isPending}
                    />
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={
                      !draft.trim() || !chatId || sendMessageMutation.isPending
                    }
                    size='sm'
                    className='h-11 w-11 flex-shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {sendMessageMutation.isPending ? (
                      <div className='flex gap-1'>
                        <div className='h-1.5 w-1.5 animate-bounce rounded-full bg-white'></div>
                        <div
                          className='h-1.5 w-1.5 animate-bounce rounded-full bg-white'
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                      </div>
                    ) : (
                      <svg
                        className='h-5 w-5'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z' />
                      </svg>
                    )}
                  </Button>
                </div>
                {!chatId && (
                  <p className='mt-2 text-xs text-slate-500 dark:text-slate-400'>
                    Connecting...
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
