import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import {
  ChatConversation,
  ChatConversationList,
  ChatMessage,
  ChatMessagesPayload,
} from '@/types/chat';

export const getSupportChat = async (): Promise<ChatConversation> => {
  const res = (await axiosInstance.post<ApiResponse<ChatConversation>>(
    ApiRoutes.chat.support
  )) as unknown as ApiResponse<ChatConversation>;

  return unwrap(res);
};

export const getChatConversations = async (
  page: number = 1,
  pageSize: number = 10
): Promise<ChatConversationList> => {
  const res = (await axiosInstance.get<ApiResponse<ChatConversationList>>(
    ApiRoutes.chat.conversations,
    { params: { page, pageSize } }
  )) as unknown as ApiResponse<ChatConversationList>;

  return unwrap(res);
};

export const getChatConversation = async (
  chatId: string
): Promise<ChatConversation> => {
  const res = (await axiosInstance.get<ApiResponse<{ chat: ChatConversation }>>(
    ApiRoutes.chat.conversation(chatId)
  )) as unknown as ApiResponse<{ chat: ChatConversation }>;

  const payload = unwrap(res);
  return 'chat' in payload ? payload.chat : payload;
};

export const getChatMessages = async (
  chatId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<ChatMessagesPayload> => {
  const res = (await axiosInstance.get<ApiResponse<ChatMessagesPayload>>(
    ApiRoutes.chat.messages(chatId),
    { params: { page, pageSize } }
  )) as unknown as ApiResponse<ChatMessagesPayload>;

  return unwrap(res);
};

export const getAdminActiveChats = async (
  page: number = 1,
  pageSize: number = 10
): Promise<ChatConversationList> => {
  const res = (await axiosInstance.get<ApiResponse<ChatConversationList>>(
    ApiRoutes.chat.adminChats,
    { params: { page, pageSize } }
  )) as unknown as ApiResponse<ChatConversationList>;

  return unwrap(res);
};

export const sendChatMessage = async (
  chatId: string,
  content: string
): Promise<ChatMessage> => {
  const res = (await axiosInstance.post<ApiResponse<{ message: ChatMessage }>>(
    ApiRoutes.chat.messages(chatId),
    { content }
  )) as unknown as ApiResponse<{ message: ChatMessage }>;

  const payload = unwrap(res);
  return 'message' in payload ? payload.message : payload;
};

export const markChatRead = async (
  chatId: string
): Promise<ChatConversation> => {
  const res = (await axiosInstance.patch<
    ApiResponse<{ chat: ChatConversation }>
  >(ApiRoutes.chat.markAsRead(chatId))) as unknown as ApiResponse<{
    chat: ChatConversation;
  }>;

  const payload = unwrap(res);
  return 'chat' in payload ? payload.chat : payload;
};

export const getAssignedChats = async (
  page: number = 1,
  pageSize: number = 10
): Promise<ChatConversationList> => {
  const res = (await axiosInstance.get<ApiResponse<ChatConversationList>>(
    ApiRoutes.chat.assignedChats,
    { params: { page, pageSize } }
  )) as unknown as ApiResponse<ChatConversationList>;

  return unwrap(res);
};

export const assignChat = async (
  chatId: string,
  staffId: string
): Promise<ChatConversation> => {
  const res = (await axiosInstance.patch<
    ApiResponse<{ chat: ChatConversation }>
  >(ApiRoutes.chat.assignChat(chatId), {
    staffId,
  })) as unknown as ApiResponse<{ chat: ChatConversation }>;

  const payload = unwrap(res);
  return 'chat' in payload ? payload.chat : payload;
};

export const resolveChat = async (
  chatId: string
): Promise<ChatConversation> => {
  const res = (await axiosInstance.patch<
    ApiResponse<{ chat: ChatConversation }>
  >(ApiRoutes.chat.resolveChat(chatId))) as unknown as ApiResponse<{
    chat: ChatConversation;
  }>;

  const payload = unwrap(res);
  return 'chat' in payload ? payload.chat : payload;
};

export const closeChat = async (chatId: string): Promise<ChatConversation> => {
  const res = (await axiosInstance.patch<
    ApiResponse<{ chat: ChatConversation }>
  >(ApiRoutes.chat.closeChat(chatId))) as unknown as ApiResponse<{
    chat: ChatConversation;
  }>;

  const payload = unwrap(res);
  return 'chat' in payload ? payload.chat : payload;
};
