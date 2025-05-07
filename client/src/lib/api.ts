import { apiRequest } from "./queryClient";
import type { Conversation, ChatMessage } from "../types";

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch("/api/conversations", {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching conversations: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createConversation(title: string): Promise<Conversation> {
  const response = await apiRequest("POST", "/api/conversations", { title });
  return response.json();
}

export async function getMessages(conversationId: number): Promise<ChatMessage[]> {
  const response = await fetch(`/api/conversations/${conversationId}/messages`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching messages: ${response.statusText}`);
  }
  
  return response.json();
}

export async function sendMessage(
  conversationId: number, 
  content: string,
  preferredLanguage: string
): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
  const response = await apiRequest("POST", `/api/conversations/${conversationId}/messages`, {
    content,
    preferredLanguage
  });
  
  return response.json();
}
