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
  isLoading: boolean
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
      console.log('Joining chat:', chatId)
      
      // Подключаемся к WebSocket если еще не подключены
      const token = localStorage.getItem('accessToken')
      if (!webSocketService.isConnected() && token) {
        console.log('WebSocket not connected, connecting...')
        await webSocketService.connect(token)
        set({ isConnected: true })
        console.log('✅ WebSocket connected successfully')
      } else {
        console.log('WebSocket already connected:', webSocketService.isConnected())
      }

      // Load message history first
      console.log('Loading message history...')
      await get().fetchMessages(chatId)

      // Store callback reference for cleanup
      const messageCallback = (message: ChatMessage) => {
        console.log('📨 New message received via WebSocket:', message)
        set((state) => ({
          messages: [...state.messages, message],
        }))
      }

      // Сохраняем callback в store для возможности отписки
      set({ 
        _currentChatId: chatId,
        _messageCallback: messageCallback 
      })

      console.log('Joining WebSocket chat room with event: chat_join')
      chatService.joinChat(chatId, messageCallback)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'websocket error'
      console.error('❌ Error joining chat:', error)
      set({ error: errorMessage, isConnected: false })
    } finally {
      set({ isLoading: false })
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
    
    // Не отключаем WebSocket полностью, чтобы другие часты могли использовать
    // Если нужно отключить - раскомментируйте:
    // if (webSocketService.isConnected()) {
    //   webSocketService.disconnect()
    //   set({ isConnected: false })
    // }
  },

  // Send message via WebSocket
  sendMessage: async (chatId: string, data: CreateMessageRequest) => {
    set({ isLoading: true, error: null })
    try {
      // Пробуем отправить через WebSocket
      if (webSocketService.isConnected()) {
        console.log('Sending message via WebSocket')
        chatService.sendMessage(chatId, data)
      } else {
        // Fallback на HTTP
        console.log('WebSocket not connected, sending via HTTP')
        const message = await chatService.sendMessageViaHttp(chatId, data)
        set((state) => ({
          messages: [...state.messages, message],
        }))
      }
    } catch (error) {
      console.error('Failed to send message:', error)
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
