import express from 'express';
import chatController from '../controllers/chat.controller';
import authMiddleware from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = express.Router();

// Protected: all routes require authentication
router.use(authMiddleware);

// ====== USER ENDPOINTS ======

/**
 * Get or create support chat for authenticated user
 * POST /api/chat/support
 */
router.post('/support', chatController.getSupportChat);

/**
 * Get user's conversations
 * GET /api/chat/conversations?page=1&pageSize=10
 */
router.get('/conversations', chatController.getUserConversations);

/**
 * Get specific conversation
 * GET /api/chat/conversations/:chatId
 */
router.get('/conversations/:chatId', chatController.getChat);

/**
 * Get messages in a conversation
 * GET /api/chat/conversations/:chatId/messages?page=1&pageSize=20
 */
router.get('/conversations/:chatId/messages', chatController.getMessages);

/**
 * Send a message
 * POST /api/chat/conversations/:chatId/messages
 * Body: { content: string }
 */
router.post('/conversations/:chatId/messages', chatController.sendMessage);

/**
 * Mark conversation as read
 * PATCH /api/chat/conversations/:chatId/read
 */
router.patch('/conversations/:chatId/read', chatController.markAsRead);

// ====== ADMIN/MODERATOR ENDPOINTS ======

/**
 * Get all active support chats
 * GET /api/chat/admin/chats?page=1&pageSize=10
 */
router.get(
  '/admin/chats',
  authorize('admin', 'moderator'),
  chatController.getAllActiveChats
);

/**
 * Get chats assigned to current staff member
 * GET /api/chat/admin/my-chats?page=1&pageSize=10
 */
router.get(
  '/admin/my-chats',
  authorize('admin', 'moderator'),
  chatController.getAssignedChats
);

/**
 * Assign a chat to a staff member
 * PATCH /api/chat/admin/chats/:chatId/assign
 * Body: { staffId: string }
 */
router.patch(
  '/admin/chats/:chatId/assign',
  authorize('admin'),
  chatController.assignChat
);

/**
 * Resolve a chat
 * PATCH /api/chat/admin/chats/:chatId/resolve
 */
router.patch(
  '/admin/chats/:chatId/resolve',
  authorize('admin', 'moderator'),
  chatController.resolveChat
);

/**
 * Close a chat
 * PATCH /api/chat/admin/chats/:chatId/close
 */
router.patch(
  '/admin/chats/:chatId/close',
  authorize('admin', 'moderator'),
  chatController.closeChat
);

/**
 * Delete a resolved chat
 * DELETE /api/chat/admin/chats/:chatId
 */
router.delete(
  '/admin/chats/:chatId',
  authorize('admin'),
  chatController.deleteChat
);

export default router;
