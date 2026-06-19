import { useCallback } from 'react'
import { useChatStore } from '../services/stores/useChatStore'
import type { Chat, CreateChatRequest, CreateMessageRequest } from '../models/chat.model'

export const useChatPresenter = () => {
  const {
    chats,
    currentChat,
    messages,
    isLoadingChats,
    isLoadingMessages,
    isLoadingCreate,
    isLoadingJoin,
    isLoadingSend,
    isLoadingDelete,
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

  // Общий флаг загрузки для списка чатов
  const isLoading = isLoadingChats || isLoadingCreate || isLoadingDelete
  
  // Флаг загрузки для сообщений
  const isLoadingMessagesState = isLoadingMessages || isLoadingJoin || isLoadingSend

  const loadChats = useCallback(
    async (limit?: number, offset?: number) => {
      await fetchChats(limit, offset)
    },
    [fetchChats]
  )

  const loadChat = useCallback(
    async (chatId: string) => {
      await fetchChatById(chatId)
    },
    [fetchChatById]
  )

  const createChat = useCallback(
    async (data: CreateChatRequest) => {
      try {
        console.log('createChat called with data:', data)
        const chat = await storeCreateChat(data)
        console.log('createChat result:', chat)
        return { success: !!chat, data: chat }
      } catch (err) {
        console.error('createChat error:', err)
        return { success: false, error: err }
      }
    },
    [storeCreateChat]
  )

  const connectToChat = useCallback(
    async (chatId: string) => {
      await joinChat(chatId)
    },
    [joinChat]
  )

  const disconnectFromChat = useCallback(async () => {
    await leaveChat()
  }, [leaveChat])

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

  const chooseChat = useCallback(
    (chat: Chat) => {
      selectChat(chat)
    },
    [selectChat]
  )

  const clearCurrentChat = useCallback(() => {
    setCurrentChat(null)
  }, [setCurrentChat])

  return {
    // State
    chats,
    currentChat,
    messages,
    isLoading,                    // только для списка чатов
    isLoadingMessagesState,       // для сообщений
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