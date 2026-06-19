import { create } from 'zustand'
import { chatService } from '../api/chat.service'
import { webSocketService } from '../api/websocket.service'
import type {
  Chat,
  ChatMessage,
  CreateChatRequest,
  CreateMessageRequest,
} from '../../models/chat.model'

interface ChatStore {
  // State
  chats: Chat[]
  currentChat: Chat | null
  messages: ChatMessage[]
  isLoadingChats: boolean 
  isLoadingMessages: boolean  
  isLoadingCreate: boolean    
  isLoadingJoin: boolean     
  isLoadingSend: boolean     
  isLoadingDelete: boolean  
  isConnected: boolean
  error: string | null
  total: number
  currentOffset: number
  messagesTotal: number
  messagesOffset: number
  _currentChatId?: string | null
  _messageCallback?: ((message: ChatMessage) => void) | null

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
  isLoadingChats: false,
  isLoadingMessages: false,
  isLoadingCreate: false,
  isLoadingJoin: false,
  isLoadingSend: false,
  isLoadingDelete: false,
  isConnected: false,
  error: null,
  total: 0,
  currentOffset: 0,
  messagesTotal: 0,
  messagesOffset: 0,
  _currentChatId: null,
  _messageCallback: null,

  // Fetch all chats (HTTP)
  fetchChats: async (limit: number = 50, offset: number = 0) => {
    set({ isLoadingChats: true, error: null })
    try {
      const response = await chatService.getChats(limit, offset)
      set({
        chats: response.items,
        total: response.total,
        currentOffset: offset,
        isLoadingChats: false,
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch chats', isLoadingChats: false })
    }
  },

  // Fetch specific chat (HTTP)
  fetchChatById: async (chatId: string) => {
    set({ isLoadingMessages: true, error: null })
    try {
      const chat = await chatService.getChatById(chatId)
      set({ currentChat: chat, isLoadingMessages: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch chat', isLoadingMessages: false })
    }
  },

  // Create new chat (HTTP)
  createChat: async (data: CreateChatRequest) => {
    set({ isLoadingCreate: true, error: null })
    try {
      const chat = await chatService.createChat(data)
      // Refresh chats list
      await get().fetchChats()
      set({ isLoadingCreate: false })
      return chat
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create chat', isLoadingCreate: false })
      return null
    }
  },

  // Fetch message history (HTTP)
  fetchMessages: async (chatId: string, limit: number = 50, offset: number = 0) => {
    set({ isLoadingMessages: true, error: null })
    try {
      const response = await chatService.getMessages(chatId, limit, offset)
      set({
        messages: response.items,
        messagesTotal: response.total,
        messagesOffset: offset,
        isLoadingMessages: false,
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch messages', isLoadingMessages: false })
    }
  },

  // Join chat room (WebSocket)
  joinChat: async (chatId: string) => {
    set({ isLoadingJoin: true, error: null })
    try {
      console.log('Joining chat:', chatId)
      
      const token = localStorage.getItem('accessToken')
      if (!webSocketService.isConnected() && token) {
        console.log('WebSocket not connected, connecting...')
        await webSocketService.connect(token)
        set({ isConnected: true })
        console.log('✅ WebSocket connected successfully')
      }

      console.log('Loading message history...')
      await get().fetchMessages(chatId)

      const messageCallback = (message: ChatMessage) => {
        console.log('📨 New message received via WebSocket:', message)
        set((state) => ({
          messages: [...state.messages, message],
        }))
      }

      set({ 
        _currentChatId: chatId,
        _messageCallback: messageCallback,
        isLoadingJoin: false,
      })

      console.log('Joining WebSocket chat room with event: chat_join')
      chatService.joinChat(chatId, messageCallback)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'websocket error'
      console.error('❌ Error joining chat:', error)
      set({ error: errorMessage, isConnected: false, isLoadingJoin: false })
    }
  },

  // Leave chat room (WebSocket)
  leaveChat: async () => {
    const { currentChat, _currentChatId, _messageCallback } = get()
    const chatId = currentChat?.id || _currentChatId
    
    if (chatId && _messageCallback) {
      chatService.leaveChat(chatId, _messageCallback)
      set({ 
        messages: [],
        _currentChatId: null,
        _messageCallback: null 
      })
    }
  },

  // Send message via WebSocket
  sendMessage: async (chatId: string, data: CreateMessageRequest) => {
    set({ isLoadingSend: true, error: null })
    try {
      if (webSocketService.isConnected()) {
        console.log('Sending message via WebSocket')
        chatService.sendMessage(chatId, data)
      } else {
        console.log('WebSocket not connected, sending via HTTP')
        const message = await chatService.sendMessageViaHttp(chatId, data)
        set((state) => ({
          messages: [...state.messages, message],
        }))
      }
      set({ isLoadingSend: false })
    } catch (error) {
      console.error('Failed to send message:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to send message', isLoadingSend: false })
    }
  },

  // Delete chat (HTTP)
  deleteChat: async (chatId: string) => {
    set({ isLoadingDelete: true, error: null })
    try {
      await chatService.deleteChat(chatId)
      await get().fetchChats()
      const { currentChat } = get()
      if (currentChat?.id === chatId) {
        set({ currentChat: null, messages: [] })
      }
      set({ isLoadingDelete: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete chat', isLoadingDelete: false })
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
      isLoadingChats: false,
      isLoadingMessages: false,
      isLoadingCreate: false,
      isLoadingJoin: false,
      isLoadingSend: false,
      isLoadingDelete: false,
      isConnected: false,
      error: null,
      total: 0,
      currentOffset: 0,
      messagesTotal: 0,
      messagesOffset: 0,
    }),
}))