import { Request, Response } from 'express';
import mongoose from 'mongoose';
import logger from '../libs/logger';
import chatService from '../services/chat.service';

const isAdminOrModerator = (req: Request) => {
  const role = (req as any).user?.role;
  return role === 'admin' || role === 'moderator';
};

const emitAdminChatUpdate = (req: Request, payload: any) => {
  const io = (req as any).app?.get('io');
  if (io) {
    io.to('admins').emit('chat.updated', payload);
  }
};

const userCanAccessChat = (chat: any, req: Request) => {
  const userId = (req as any).user._id;
  return (
    chat.participants.some(
      (p: any) => p._id.toString() === userId.toString()
    ) || isAdminOrModerator(req)
  );
};

class ChatController {
  /**
   * Get or create a support chat for the authenticated user
   * POST /api/chat/support
   */
  async getSupportChat(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id;

      const chat = await chatService.getOrCreateSupportChat(userId);

      return (res as any).success(chat, 'Support chat retrieved', 200);
    } catch (error: any) {
      logger.error(`Error getting support chat: ${error.message}`);
      return (res as any).error(error.message, 'CHAT_ERROR', 500);
    }
  }

  /**
   * Get user's conversations
   * GET /api/chat/conversations?page=1&pageSize=10
   */
  async getUserConversations(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.max(
        1,
        parseInt(req.query.pageSize as string) || 10
      );

      const result = await chatService.getUserConversations(
        userId,
        page,
        pageSize
      );

      return (res as any).success(result, 'Conversations retrieved', 200);
    } catch (error: any) {
      logger.error(`Error fetching conversations: ${error.message}`);
      return (res as any).error(error.message, 'FETCH_ERROR', 500);
    }
  }

  /**
   * Get messages in a conversation
   * GET /api/chat/conversations/:chatId/messages?page=1&pageSize=20
   */
  async getMessages(req: Request, res: Response) {
    try {
      const chatId = String(req.params.chatId);
      const userId = (req as any).user._id;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.max(
        1,
        parseInt(req.query.pageSize as string) || 20
      );

      // Verify user is participant
      const chat = await chatService.getChatById(chatId);
      if (!chat) {
        return (res as any).error('Chat not found', 'NOT_FOUND', 404);
      }

      if (!userCanAccessChat(chat, req)) {
        return (res as any).error('Not authorized', 'FORBIDDEN', 403);
      }

      const result = await chatService.getMessages(chatId, page, pageSize);

      return (res as any).success(result, 'Messages retrieved', 200);
    } catch (error: any) {
      logger.error(`Error fetching messages: ${error.message}`);
      return (res as any).error(error.message, 'FETCH_ERROR', 500);
    }
  }

  /**
   * Send a message in a conversation
   * POST /api/chat/conversations/:chatId/messages
   * Body: { content: string }
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const chatId = String(req.params.chatId);
      const { content } = req.body;
      const userId = (req as any).user._id;

      if (!content || !content.trim()) {
        return (res as any).error(
          'Content is required',
          'VALIDATION_ERROR',
          400
        );
      }

      // Verify user is participant
      const chat = await chatService.getChatById(chatId);
      if (!chat) {
        return (res as any).error('Chat not found', 'NOT_FOUND', 404);
      }

      if (!userCanAccessChat(chat, req)) {
        return (res as any).error('Not authorized', 'FORBIDDEN', 403);
      }

      if (!chat.participants.some((p: any) => p._id.toString() === userId)) {
        if (isAdminOrModerator(req)) {
          chat.participants.push(new mongoose.Types.ObjectId(userId));
          chat.unreadCount.set(userId, 0);
          await chat.save();
        }
      }

      const message = await chatService.addMessage(
        chatId,
        userId,
        content.trim()
      );

      // Emit real-time event via Socket.IO
      const io = (req as any).app?.get('io');
      if (io) {
        io.to(chatId).emit('message.created', {
          chatId,
          message,
        });
        emitAdminChatUpdate(req, {
          chatId,
          type: 'message.created',
          lastMessage: content.trim(),
          lastMessageAt: new Date().toISOString(),
        });
      }

      return (res as any).success({ message }, 'Message sent', 201);
    } catch (error: any) {
      logger.error(`Error sending message: ${error.message}`);
      return (res as any).error(error.message, 'SEND_ERROR', 500);
    }
  }

  /**
   * Mark chat as read
   * PATCH /api/chat/conversations/:chatId/read
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const chatId = String(req.params.chatId);
      const userId = (req as any).user._id;

      const chat = await chatService.markAsRead(chatId, userId);

      // Emit read event
      const io = (req as any).app?.get('io');
      if (io) {
        io.to(chatId).emit('messages.read', {
          chatId,
          userId,
        });
      }

      return (res as any).success({ chat }, 'Marked as read', 200);
    } catch (error: any) {
      logger.error(`Error marking as read: ${error.message}`);
      return (res as any).error(error.message, 'ERROR', 500);
    }
  }

  /**
   * Get chat details
   * GET /api/chat/conversations/:chatId
   */
  async getChat(req: Request, res: Response) {
    try {
      const chatId = String(req.params.chatId);
      const userId = (req as any).user._id;

      const chat = await chatService.getChatById(chatId);
      if (!chat) {
        return (res as any).error('Chat not found', 'NOT_FOUND', 404);
      }

      if (!userCanAccessChat(chat, req)) {
        return (res as any).error('Not authorized', 'FORBIDDEN', 403);
      }

      return (res as any).success({ chat }, 'Chat retrieved', 200);
    } catch (error: any) {
      logger.error(`Error fetching chat: ${error.message}`);
      return (res as any).error(error.message, 'ERROR', 500);
    }
  }

  // ====== ADMIN/MODERATOR ENDPOINTS ======

  /**
   * Get all active support chats (admin/moderator only)
   * GET /api/chat/admin/chats?page=1&pageSize=10
   */
  async getAllActiveChats(req: Request, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.max(
        1,
        parseInt(req.query.pageSize as string) || 10
      );
      const status = (req.query.status as string) || 'active';

      const result = await chatService.getAllActiveChats(
        page,
        pageSize,
        status
      );

      return (res as any).success(result, 'Active chats retrieved', 200);
    } catch (error: any) {
      logger.error(`Error fetching active chats: ${error.message}`);
      return (res as any).error(error.message, 'FETCH_ERROR', 500);
    }
  }

  /**
   * Get chats assigned to current staff member
   * GET /api/chat/admin/my-chats?page=1&pageSize=10
   */
  async getAssignedChats(req: Request, res: Response) {
    try {
      const staffId = (req as any).user._id;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.max(
        1,
        parseInt(req.query.pageSize as string) || 10
      );

      const result = await chatService.getAssignedChats(
        staffId,
        page,
        pageSize
      );

      return (res as any).success(result, 'Assigned chats retrieved', 200);
    } catch (error: any) {
      logger.error(`Error fetching assigned chats: ${error.message}`);
      return (res as any).error(error.message, 'FETCH_ERROR', 500);
    }
  }

  /**
   * Assign a chat to a staff member
   * PATCH /api/chat/admin/chats/:chatId/assign
   * Body: { staffId: string }
   */
  async assignChat(req: Request, res: Response) {
    try {
      const chatId = String(req.params.chatId);
      const { staffId } = req.body;

      if (!staffId) {
        return (res as any).error(
          'staffId is required',
          'VALIDATION_ERROR',
          400
        );
      }

      const chat = await chatService.assignChat(chatId, staffId);

      // Emit assignment event
      const io = (req as any).app?.get('io');
      if (io) {
        io.to(chatId).emit('chat.assigned', {
          chatId,
          assignedTo: staffId,
        });
        emitAdminChatUpdate(req, {
          chatId,
          type: 'chat.assigned',
          assignedTo: staffId,
        });
      }

      return (res as any).success({ chat }, 'Chat assigned', 200);
    } catch (error: any) {
      logger.error(`Error assigning chat: ${error.message}`);
      return (res as any).error(error.message, 'ERROR', 500);
    }
  }

  /**
   * Resolve a support chat
   * PATCH /api/chat/admin/chats/:chatId/resolve
   */
  async resolveChat(req: Request, res: Response) {
    try {
      const chatId = String(req.params.chatId);

      const chat = await chatService.resolveChat(chatId);

      // Emit resolution event
      const io = (req as any).app?.get('io');
      if (io) {
        io.to(chatId).emit('chat.resolved', { chatId });
        emitAdminChatUpdate(req, {
          chatId,
          type: 'chat.resolved',
        });
      }

      return (res as any).success({ chat }, 'Chat resolved', 200);
    } catch (error: any) {
      logger.error(`Error resolving chat: ${error.message}`);
      return (res as any).error(error.message, 'ERROR', 500);
    }
  }

  /**
   * Close a support chat
   * PATCH /api/chat/admin/chats/:chatId/close
   */
  async closeChat(req: Request, res: Response) {
    try {
      const chatId = String(req.params.chatId);

      const chat = await chatService.closeChat(chatId);

      // Emit close event
      const io = (req as any).app?.get('io');
      if (io) {
        io.to(chatId).emit('chat.closed', { chatId });
        emitAdminChatUpdate(req, {
          chatId,
          type: 'chat.closed',
        });
      }

      return (res as any).success({ chat }, 'Chat closed', 200);
    } catch (error: any) {
      logger.error(`Error closing chat: ${error.message}`);
      return (res as any).error(error.message, 'ERROR', 500);
    }
  }

  /**
   * Delete a resolved support chat
   * DELETE /api/chat/admin/chats/:chatId
   */
  async deleteChat(req: Request, res: Response) {
    try {
      const chatId = String(req.params.chatId);

      await chatService.deleteChat(chatId);

      const io = (req as any).app?.get('io');
      if (io) {
        emitAdminChatUpdate(req, {
          chatId,
          type: 'chat.deleted',
        });
      }

      return (res as any).success(null, 'Chat deleted', 200);
    } catch (error: any) {
      logger.error(`Error deleting chat: ${error.message}`);
      return (res as any).error(error.message, 'ERROR', 500);
    }
  }
}

export default new ChatController();
