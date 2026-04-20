import { useCallback } from 'react'
import { useChatStore } from '../services/stores/useChatStore'
import type { Chat, CreateChatRequest, CreateMessageRequest } from '../models/chat.model'

export const useChatPresenter = () => {
  const {
    chats,
    currentChat,
    messages,
    isLoading,
    isConnected,
    error,
    total,
    messagesTotal,
    fetchChats,
    fetchChatById,
    createChat: storeCreateChat,
    joinChat,
    leaveChat,
    sendMessage: storeSendMessage,
    deleteChat: storeDeleteChat,
    selectChat,
    setCurrentChat,
    clearError,
  } = useChatStore()

  // Load all chats
  const loadChats = useCallback(
    async (limit?: number, offset?: number) => {
      await fetchChats(limit, offset)
    },
    [fetchChats]
  )

  // Load specific chat
  const loadChat = useCallback(
    async (chatId: string) => {
      await fetchChatById(chatId)
    },
    [fetchChatById]
  )

  // Create new chat
  const createChat = useCallback(
    async (data: CreateChatRequest) => {
      try {
        const chat = await storeCreateChat(data)
        return { success: !!chat, data: chat }
      } catch (err) {
        return { success: false, error: err }
      }
    },
    [storeCreateChat]
  )

  // Join chat room and listen for messages (WebSocket)
  const connectToChat = useCallback(
    async (chatId: string) => {
      await joinChat(chatId)
    },
    [joinChat]
  )

  // Leave chat room (WebSocket)
  const disconnectFromChat = useCallback(async () => {
    await leaveChat()
  }, [leaveChat])

  // Send message via WebSocket
  const sendMessage = useCallback(
    async (chatId: string, data: CreateMessageRequest) => {
      try {
        await storeSendMessage(chatId, data)
        return { success: true }
      } catch (err) {
        return { success: false, error: err }
      }
    },
    [storeSendMessage]
  )

  // Delete chat
  const deleteChat = useCallback(
    async (chatId: string) => {
      try {
        await storeDeleteChat(chatId)
        return { success: true }
      } catch (err) {
        return { success: false, error: err }
      }
    },
    [storeDeleteChat]
  )

  // Choose chat from list
  const chooseChat = useCallback(
    (chat: Chat) => {
      selectChat(chat)
    },
    [selectChat]
  )

  // Clear current chat
  const clearCurrentChat = useCallback(() => {
    setCurrentChat(null)
  }, [setCurrentChat])

  return {
    // State
    chats,
    currentChat,
    messages,
    isLoading,
    isConnected,
    error,
    total,
    messagesTotal,

    // Actions
    loadChats,
    loadChat,
    createChat,
    connectToChat,
    disconnectFromChat,
    sendMessage,
    deleteChat,
    chooseChat,
    clearCurrentChat,
    clearError,
  }
}
