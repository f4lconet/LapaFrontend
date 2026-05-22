import { apiClient } from './client'
import { webSocketService } from './websocket.service'
import type {
  Chat,
  ChatListResponse,
  ChatMessage,
  ChatMessagesResponse,
  CreateChatRequest,
  CreateMessageRequest,
} from '../../models/chat.model'

export const chatService = {
  // ==================== HTTP Methods ====================

  async getChats(limit: number = 50, offset: number = 0): Promise<ChatListResponse> {
    const response = await apiClient.get<ChatListResponse>('/api/v1/chats', {
      params: { limit, offset },
    })
    return response.data
  },

  async getChatById(chatId: string): Promise<Chat> {
    const response = await apiClient.get<Chat>(`/api/v1/chats/${chatId}`)
    return response.data
  },

  async createChat(data: CreateChatRequest): Promise<Chat> {
    try {
      const response = await apiClient.post<Chat>('/api/v1/chats', data)
      return response.data
    } catch (error: any) {
      console.error('Chat creation error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw error
    }
  },

  async getMessages(chatId: string, limit: number = 50, offset: number = 0): Promise<ChatMessagesResponse> {
    const response = await apiClient.get<ChatMessagesResponse>(`/api/v1/chats/${chatId}/messages`, {
      params: { limit, offset },
    })
    return response.data
  },

  async deleteChat(chatId: string): Promise<string> {
    const response = await apiClient.delete<string>(`/api/v1/chats/${chatId}`)
    return response.data
  },

  // ==================== WebSocket Methods ====================
  // ВАЖНО: Используем правильные имена событий для бэкенда

  joinChat(chatId: string, callback: (message: ChatMessage) => void): void {
    // Сначала подписываемся на событие получения сообщений
    webSocketService.on(`chat:message`, callback)
    // Затем отправляем команду присоединения (используем underscore)
    webSocketService.emit('chat_join', { chat_id: chatId })
  },

  leaveChat(chatId: string, callback?: (message: ChatMessage) => void): void {
    // Отправляем команду выхода (используем underscore)
    webSocketService.emit('chat_leave', { chat_id: chatId })
    // Отписываемся от сообщений
    if (callback) {
      webSocketService.off(`chat:message`, callback)
    }
  },

  sendMessage(chatId: string, data: CreateMessageRequest): void {
    // Отправляем сообщение (используем underscore)
    webSocketService.emit('message_send', {
      chat_id: chatId,
      content: data.content,
    })
  },

  // Дополнительные методы для индикатора набора текста
  startTyping(chatId: string): void {
    webSocketService.emit('typing_start', { chat_id: chatId })
  },

  stopTyping(chatId: string): void {
    webSocketService.emit('typing_stop', { chat_id: chatId })
  },

  onTypingStatus(callback: (data: { user_id: string; is_typing: boolean }) => void): void {
    webSocketService.on('typing:status', callback)
  },

  offTypingStatus(callback: (data: { user_id: string; is_typing: boolean }) => void): void {
    webSocketService.off('typing:status', callback)
  },

  onChatsUpdated(callback: (data: { chat_id: string }) => void): void {
    webSocketService.on('chats:updated', callback)
  },

  offChatsUpdated(callback: (data: { chat_id: string }) => void): void {
    webSocketService.off('chats:updated', callback)
  },

  async sendMessageViaHttp(chatId: string, data: CreateMessageRequest): Promise<ChatMessage> {
    const response = await apiClient.post<ChatMessage>(`/api/v1/chats/${chatId}/messages`, data)
    return response.data
  },
}