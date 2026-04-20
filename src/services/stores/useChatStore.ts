import { create } from 'zustand'
import { chatService } from '../api/chat.service'
import { webSocketService } from '../websocket.service'
import type {
  Chat,
  ChatListResponse,
  ChatMessage,
  ChatMessagesResponse,
  CreateChatRequest,
  CreateMessageRequest,
} from '../../models/chat.model'

interface ChatStore {
  // State
  chats: Chat[]
  currentChat: Chat | null
  messages: ChatMessage[]
  isLoading: boolean
  isConnected: boolean
  error: string | null
  total: number
  currentOffset: number
  messagesTotal: number
  messagesOffset: number

  // Actions
  fetchChats: (limit?: number, offset?: number) => Promise<void>
  fetchChatById: (chatId: string) => Promise<void>
  createChat: (data: CreateChatRequest) => Promise<Chat | null>
  fetchMessages: (chatId: string, limit?: number, offset?: number) => Promise<void>
  joinChat: (chatId: string) => Promise<void>
  leaveChat: () => Promise<void>
  sendMessage: (chatId: string, data: CreateMessageRequest) => Promise<void>
  deleteChat: (chatId: string) => Promise<void>
  selectChat: (chat: Chat) => void
  setCurrentChat: (chat: Chat | null) => void
  setConnected: (connected: boolean) => void
  clearError: () => void
  reset: () => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  isConnected: false,
  error: null,
  total: 0,
  currentOffset: 0,
  messagesTotal: 0,
  messagesOffset: 0,

  // Fetch all chats (HTTP)
  fetchChats: async (limit: number = 50, offset: number = 0) => {
    set({ isLoading: true, error: null })
    try {
      const response = await chatService.getChats(limit, offset)
      set({
        chats: response.items,
        total: response.total,
        currentOffset: offset,
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch chats' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Fetch specific chat (HTTP)
  fetchChatById: async (chatId: string) => {
    set({ isLoading: true, error: null })
    try {
      const chat = await chatService.getChatById(chatId)
      set({ currentChat: chat })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch chat' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Create new chat (HTTP)
  createChat: async (data: CreateChatRequest) => {
    set({ isLoading: true, error: null })
    try {
      const chat = await chatService.createChat(data)
      // Refresh chats list
      await get().fetchChats()
      return chat
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create chat' })
      return null
    } finally {
      set({ isLoading: false })
    }
  },

  // Fetch message history (HTTP)
  fetchMessages: async (chatId: string, limit: number = 50, offset: number = 0) => {
    set({ isLoading: true, error: null })
    try {
      const response = await chatService.getMessages(chatId, limit, offset)
      set({
        messages: response.items,
        messagesTotal: response.total,
        messagesOffset: offset,
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch messages' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Join chat room (WebSocket)
  joinChat: async (chatId: string) => {
    set({ isLoading: true, error: null })
    try {
      // Load message history first
      await get().fetchMessages(chatId)

      // Subscribe to new messages via WebSocket
      const messageCallback = (message: ChatMessage) => {
        set((state) => ({
          messages: [...state.messages, message],
        }))
      }

      chatService.joinChat(chatId, messageCallback)
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to join chat' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Leave chat room (WebSocket)
  leaveChat: async () => {
    const { currentChat } = get()
    if (currentChat?.id) {
      chatService.leaveChat(currentChat.id)
      set({ messages: [] })
    }
  },

  // Send message via WebSocket
  sendMessage: async (chatId: string, data: CreateMessageRequest) => {
    set({ isLoading: true, error: null })
    try {
      chatService.sendMessage(chatId, data)
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to send message' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Delete chat (HTTP)
  deleteChat: async (chatId: string) => {
    set({ isLoading: true, error: null })
    try {
      await chatService.deleteChat(chatId)
      // Refresh chats list
      await get().fetchChats()
      // Clear current chat if it was the deleted one
      const { currentChat } = get()
      if (currentChat?.id === chatId) {
        set({ currentChat: null, messages: [] })
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete chat' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Select chat (set as current)
  selectChat: (chat: Chat) => {
    set({ currentChat: chat })
  },

  // Set current chat
  setCurrentChat: (chat: Chat | null) => {
    set({ currentChat: chat })
  },

  // Set connection status
  setConnected: (connected: boolean) => {
    set({ isConnected: connected })
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () =>
    set({
      chats: [],
      currentChat: null,
      messages: [],
      isLoading: false,
      isConnected: false,
      error: null,
      total: 0,
      currentOffset: 0,
      messagesTotal: 0,
      messagesOffset: 0,
    }),
}))
