import {
  assignChat,
  closeChat,
  deleteChat,
  getAdminActiveChats,
  getAssignedChats,
  getChatConversation,
  getChatConversations,
  getChatMessages,
  getSupportChat,
  markChatRead,
  resolveChat,
  sendChatMessage,
} from '@/services/chat.service';
import {
  ChatConversation,
  ChatConversationList,
  ChatMessage,
  ChatMessagesPayload,
} from '@/types/chat';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useSupportChat = () => {
  const queryClient = useQueryClient();

  return useMutation<ChatConversation, Error, void>({
    mutationFn: getSupportChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    },
  });
};

export const useChatConversations = (
  page: number = 1,
  pageSize: number = 10
) => {
  return useQuery<ChatConversationList, Error>({
    queryKey: ['chat-conversations', page, pageSize],
    queryFn: () => getChatConversations(page, pageSize),
    staleTime: 1000 * 60 * 2,
  });
};

export const useAdminActiveChats = (
  page: number = 1,
  pageSize: number = 10,
  status: string = 'active'
) => {
  return useQuery<ChatConversationList, Error>({
    queryKey: ['admin-active-chats', page, pageSize, status],
    queryFn: () => getAdminActiveChats(page, pageSize, status),
    staleTime: 1000 * 60 * 2,
  });
};

export const useChatConversation = (chatId: string) => {
  return useQuery<ChatConversation, Error>({
    queryKey: ['chat-conversation', chatId],
    queryFn: () => getChatConversation(chatId),
    enabled: Boolean(chatId),
    staleTime: 1000 * 60 * 2,
  });
};

export const useChatMessages = (
  chatId: string,
  page: number = 1,
  pageSize: number = 20
) => {
  return useQuery<ChatMessagesPayload, Error>({
    queryKey: ['chat-messages', chatId, page, pageSize],
    queryFn: () => getChatMessages(chatId, page, pageSize),
    enabled: Boolean(chatId),
    staleTime: 1000 * 60 * 1,
  });
};

export const useSendChatMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ChatMessage, Error, string>({
    mutationFn: (content: string) => sendChatMessage(chatId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
      queryClient.invalidateQueries({
        queryKey: ['chat-conversation', chatId],
      });
    },
  });
};

export const useMarkChatRead = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ChatConversation, Error, void>({
    mutationFn: () => markChatRead(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat-conversation', chatId],
      });
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    },
  });
};

export const useGetAssignedChats = (
  page: number = 1,
  pageSize: number = 10
) => {
  return useQuery<ChatConversationList, Error>({
    queryKey: ['assigned-chats', page, pageSize],
    queryFn: () => getAssignedChats(page, pageSize),
    staleTime: 1000 * 60 * 2,
  });
};

export const useAssignChat = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ChatConversation, Error, string>({
    mutationFn: (staffId: string) => assignChat(chatId, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat-conversation', chatId],
      });
      queryClient.invalidateQueries({ queryKey: ['admin-active-chats'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-chats'] });
    },
  });
};

export const useResolveChat = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ChatConversation, Error, void>({
    mutationFn: () => resolveChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat-conversation', chatId],
      });
      queryClient.invalidateQueries({ queryKey: ['admin-active-chats'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-chats'] });
    },
  });
};

export const useCloseChat = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ChatConversation, Error, void>({
    mutationFn: () => closeChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat-conversation', chatId],
      });
      queryClient.invalidateQueries({ queryKey: ['admin-active-chats'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-chats'] });
    },
  });
};

export const useDeleteChat = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-active-chats'],
      });
      queryClient.invalidateQueries({
        queryKey: ['assigned-chats'],
      });
      queryClient.invalidateQueries({
        queryKey: ['chat-conversation', chatId],
      });
    },
  });
};
