import { apiClient } from './client'
import { webSocketService } from '../websocket.service'
import type {
  Chat,
  ChatListResponse,
  ChatMessage,
  ChatMessagesResponse,
  CreateChatRequest,
  CreateMessageRequest,
} from '../../models/chat.model'

export const chatService = {
  // ==================== HTTP Methods (Initial Data Load) ====================

  // GET /chats - get all chats for current user
  async getChats(limit: number = 50, offset: number = 0): Promise<ChatListResponse> {
    const response = await apiClient.get<ChatListResponse>('/chats', {
      params: { limit, offset },
    })
    return response.data
  },

  // GET /chats/{chat_id} - get specific chat details
  async getChatById(chatId: string): Promise<Chat> {
    const response = await apiClient.get<Chat>(`/chats/${chatId}`)
    return response.data
  },

  // POST /chats - create new chat with user
  async createChat(data: CreateChatRequest): Promise<Chat> {
    const response = await apiClient.post<Chat>('/chats', data)
    return response.data
  },

  // GET /chats/{chat_id}/messages - get message history
  async getMessages(chatId: string, limit: number = 50, offset: number = 0): Promise<ChatMessagesResponse> {
    const response = await apiClient.get<ChatMessagesResponse>(`/chats/${chatId}/messages`, {
      params: { limit, offset },
    })
    return response.data
  },

  // DELETE /chats/{chat_id} - delete chat (optional)
  async deleteChat(chatId: string): Promise<string> {
    const response = await apiClient.delete<string>(`/chats/${chatId}`)
    return response.data
  },

  // ==================== WebSocket Methods (Real-time Communication) ====================

  // Join chat room and listen for messages
  joinChat(chatId: string, callback: (message: ChatMessage) => void): void {
    // Emit join event to server
    webSocketService.emit('chat:join', { chat_id: chatId })

    // Listen for incoming messages
    webSocketService.on(`chat:${chatId}:message`, callback)
  },

  // Leave chat room
  leaveChat(chatId: string, callback?: (message: ChatMessage) => void): void {
    webSocketService.emit('chat:leave', { chat_id: chatId })

    if (callback) {
      webSocketService.off(`chat:${chatId}:message`, callback)
    }
  },

  // Send message via WebSocket
  sendMessage(chatId: string, data: CreateMessageRequest): void {
    webSocketService.emit('message:send', {
      chat_id: chatId,
      content: data.content,
    })
  },

  // Listen for chat list updates
  onChatsUpdated(callback: (chats: Chat[]) => void): void {
    webSocketService.on('chats:updated', callback)
  },

  // Stop listening for chat list updates
  offChatsUpdated(callback: (chats: Chat[]) => void): void {
    webSocketService.off('chats:updated', callback)
  },

  // Listen for user online/offline status
  onUserStatusChanged(callback: (data: { user_id: string; status: string }) => void): void {
    webSocketService.on('user:status_changed', callback)
  },

  // Stop listening for user status
  offUserStatusChanged(callback: (data: { user_id: string; status: string }) => void): void {
    webSocketService.off('user:status_changed', callback)
  },
}
