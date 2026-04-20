export interface ChatMessage {
  id: string
  chat_id: string
  sender_id: string
  content: string
  created_at: string
  updated_at: string
}

export interface ChatUser {
  id: string
  name: string
  avatar_url?: string
  role: string
}

export interface Chat {
  id: string
  user_1_id: string
  user_2_id: string
  user_1: ChatUser
  user_2: ChatUser
  last_message?: ChatMessage
  last_message_at: string
  created_at: string
  updated_at: string
}

export interface ChatListResponse {
  items: Chat[]
  total: number
  next_offset: number
}

export interface ChatMessagesResponse {
  items: ChatMessage[]
  total: number
  next_offset: number
}

export interface CreateMessageRequest {
  content: string
}

export interface CreateChatRequest {
  user_id: string
}

// For API responses
export interface MessageResponse {
  success: boolean
  message?: string
  data?: ChatMessage | Chat | ChatMessagesResponse
}
