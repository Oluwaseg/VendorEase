import mongoose from 'mongoose';
import logger from '../libs/logger';
import { Chat, IMessage } from '../models/Chat';
import { User } from '../models/User';

class ChatService {
  /**
   * Get or create a support conversation for a user
   * If user already has an active support chat, return it
   * Otherwise create a new one
   */
  async getOrCreateSupportChat(userId: string) {
    try {
      // Check if user has active support conversation
      let chat = await Chat.findOne({
        createdBy: userId,
        type: 'support',
        status: { $in: ['active', 'resolved'] },
      })
        .populate('participants', 'name email avatar')
        .populate('assignedTo', 'name email avatar');

      // If exists, return it
      if (chat) {
        return chat;
      }

      // Create new support chat
      const user = await User.findById(userId).select('_id name email');
      if (!user) {
        throw new Error('User not found');
      }

      chat = new Chat({
        createdBy: userId,
        participants: [userId],
        type: 'support',
        status: 'active',
        subject: `Support: ${user.name}`,
        unreadCount: new Map([[userId, 0]]),
      });

      await chat.save();
      await chat.populate('participants', 'name email avatar');

      return chat;
    } catch (error) {
      logger.error(`Error creating support chat: ${error}`);
      throw error;
    }
  }

  /**
   * Add a message to a chat
   */
  async addMessage(
    chatId: string,
    senderId: string,
    content: string,
    type: 'text' | 'system' = 'text'
  ): Promise<IMessage> {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        throw new Error('Chat not found');
      }

      // Verify sender is a participant
      const isParticipant = chat.participants.some(
        (pid) => pid.toString() === senderId
      );
      if (!isParticipant) {
        throw new Error('User is not a participant in this chat');
      }

      const message: IMessage = {
        sender: new mongoose.Types.ObjectId(senderId),
        content,
        type,
        createdAt: new Date(),
        readBy: [new mongoose.Types.ObjectId(senderId)], // Sender always reads own message
      };

      chat.messages.push(message);
      chat.lastMessage = content;
      chat.lastMessageAt = new Date();

      // Increment unread for other participants
      chat.participants.forEach((participantId) => {
        if (participantId.toString() !== senderId) {
          const currentUnread =
            chat.unreadCount.get(participantId.toString()) || 0;
          chat.unreadCount.set(participantId.toString(), currentUnread + 1);
        }
      });

      await chat.save();

      // Return the new message with sender details populated
      const populatedChat = await Chat.findById(chatId).populate(
        'messages.sender',
        'name email avatar'
      );
      return populatedChat?.messages[populatedChat.messages.length - 1]!;
    } catch (error) {
      logger.error(`Error adding message: ${error}`);
      throw error;
    }
  }

  /**
   * Mark messages in a chat as read by a user
   */
  async markAsRead(chatId: string, userId: string) {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        throw new Error('Chat not found');
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);
      let hasUnread = false;

      // Mark unread messages as read by this user
      chat.messages = chat.messages.map((msg) => {
        if (!msg.readBy.some((uid) => uid.toString() === userId)) {
          msg.readBy.push(userObjectId);
          hasUnread = true;
        }
        return msg;
      });

      // Reset unread count for this user
      chat.unreadCount.set(userId, 0);

      if (hasUnread) {
        await chat.save();
      }

      return chat;
    } catch (error) {
      logger.error(`Error marking as read: ${error}`);
      throw error;
    }
  }

  /**
   * Assign a support chat to a moderator/admin
   */
  async assignChat(chatId: string, staffId: string) {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        throw new Error('Chat not found');
      }

      const staffUser = await User.findById(staffId);
      if (!staffUser || !['admin', 'moderator'].includes(staffUser.role)) {
        throw new Error('Invalid staff member');
      }

      // Add staff to participants if not already there
      if (!chat.participants.some((pid) => pid.toString() === staffId)) {
        chat.participants.push(new mongoose.Types.ObjectId(staffId));
        chat.unreadCount.set(staffId, 0);
      }

      chat.assignedTo = new mongoose.Types.ObjectId(staffId);
      await chat.save();

      return chat;
    } catch (error) {
      logger.error(`Error assigning chat: ${error}`);
      throw error;
    }
  }

  /**
   * Get user's conversations (pagination)
   */
  async getUserConversations(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ) {
    try {
      const skip = (page - 1) * pageSize;

      const conversations = await Chat.find({
        participants: userId,
      })
        .sort({ lastMessageAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('participants', 'name email avatar')
        .populate('assignedTo', 'name email avatar')
        .populate('createdBy', 'name email avatar');

      const total = await Chat.countDocuments({
        participants: userId,
      });

      return {
        data: conversations,
        pagination: {
          total,
          page,
          pageSize,
          pages: Math.ceil(total / pageSize),
        },
      };
    } catch (error) {
      logger.error(`Error fetching user conversations: ${error}`);
      throw error;
    }
  }

  /**
   * Get messages in a conversation (pagination)
   */
  async getMessages(chatId: string, page: number = 1, pageSize: number = 20) {
    try {
      const chat = await Chat.findById(chatId).populate(
        'messages.sender',
        'name email avatar'
      );

      if (!chat) {
        throw new Error('Chat not found');
      }

      // Paginate messages (most recent last)
      const totalMessages = chat.messages.length;
      const start = Math.max(0, totalMessages - page * pageSize);
      const end = Math.max(0, totalMessages - (page - 1) * pageSize);

      return {
        chatId,
        messages: chat.messages.slice(start, end),
        pagination: {
          total: totalMessages,
          page,
          pageSize,
          pages: Math.ceil(totalMessages / pageSize),
        },
      };
    } catch (error) {
      logger.error(`Error fetching messages: ${error}`);
      throw error;
    }
  }

  /**
   * Resolve a support chat (admin/moderator only)
   */
  async resolveChat(chatId: string) {
    try {
      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { status: 'resolved' },
        { new: true }
      ).populate('participants', 'name email avatar');

      return chat;
    } catch (error) {
      logger.error(`Error resolving chat: ${error}`);
      throw error;
    }
  }

  /**
   * Close a support chat (admin/moderator only)
   */
  async closeChat(chatId: string) {
    try {
      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { status: 'closed' },
        { new: true }
      ).populate('participants', 'name email avatar');

      return chat;
    } catch (error) {
      logger.error(`Error closing chat: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a resolved support chat (admin only)
   */
  async deleteChat(chatId: string) {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        throw new Error('Chat not found');
      }
      if (chat.status !== 'resolved') {
        throw new Error('Only resolved chats can be deleted');
      }

      await Chat.findByIdAndDelete(chatId);
      return true;
    } catch (error) {
      logger.error(`Error deleting chat: ${error}`);
      throw error;
    }
  }

  /**
   * Get all active support chats (admin/moderator only)
   */
  async getAllActiveChats(
    page: number = 1,
    pageSize: number = 10,
    status: string = 'active'
  ) {
    try {
      const skip = (page - 1) * pageSize;
      const query: any = { type: 'support' };

      if (status && status !== 'all') {
        query.status = status;
      }

      const chats = await Chat.find(query)
        .sort({ lastMessageAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('participants', 'name email avatar')
        .populate('assignedTo', 'name email avatar')
        .populate('createdBy', 'name email avatar');

      const total = await Chat.countDocuments(query);

      return {
        data: chats,
        pagination: {
          total,
          page,
          pageSize,
          pages: Math.ceil(total / pageSize),
        },
      };
    } catch (error) {
      logger.error(`Error fetching all chats: ${error}`);
      throw error;
    }
  }

  /**
   * Get chats assigned to a specific moderator/admin
   */
  async getAssignedChats(
    staffId: string,
    page: number = 1,
    pageSize: number = 10
  ) {
    try {
      const skip = (page - 1) * pageSize;

      const chats = await Chat.find({
        assignedTo: staffId,
        type: 'support',
      })
        .sort({ lastMessageAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('participants', 'name email avatar')
        .populate('createdBy', 'name email avatar');

      const total = await Chat.countDocuments({
        assignedTo: staffId,
        type: 'support',
      });

      return {
        data: chats,
        pagination: {
          total,
          page,
          pageSize,
          pages: Math.ceil(total / pageSize),
        },
      };
    } catch (error) {
      logger.error(`Error fetching assigned chats: ${error}`);
      throw error;
    }
  }

  /**
   * Get chat by ID with validation
   */
  async getChatById(chatId: string) {
    try {
      const chat = await Chat.findById(chatId)
        .populate('participants', 'name email avatar role')
        .populate('assignedTo', 'name email avatar role')
        .populate('createdBy', 'name email avatar')
        .populate('messages.sender', 'name email avatar');

      return chat;
    } catch (error) {
      logger.error(`Error fetching chat: ${error}`);
      throw error;
    }
  }
}

export default new ChatService();
