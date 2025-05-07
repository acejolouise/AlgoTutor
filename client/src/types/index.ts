import { 
  ChatMessage, 
  Conversation, 
  Topic,
  SubTopic,
  ChatHistory,
  CodeBlock
} from "@shared/schema";

export type {
  ChatMessage,
  Conversation,
  Topic,
  SubTopic,
  ChatHistory,
  CodeBlock
};

export interface AppState {
  conversations: Conversation[];
  currentConversationId: number | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  preferredLanguage: string;
}

export type AppAction =
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'SET_CURRENT_CONVERSATION'; payload: number | null }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_USER_MESSAGE'; payload: ChatMessage }
  | { type: 'ADD_ASSISTANT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PREFERRED_LANGUAGE'; payload: string };
