import React, { useEffect, useReducer, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ChatHeader from "../components/chat/chat-header";
import ChatContainer from "../components/chat/chat-container";
import Sidebar from "../components/sidebar/sidebar";
import SettingsDialog from "../components/settings/settings-dialog";
import MobileNav from "../components/sidebar/mobile-nav";
import { createConversation, getConversations, getMessages, sendMessage } from "../lib/api";
import { queryClient } from "../lib/queryClient";
import { welcomeMessage } from "../lib/openai";
import { AppState, AppAction } from "../types";

// Initial state
const initialState: AppState = {
  conversations: [],
  currentConversationId: null,
  messages: [welcomeMessage],
  isLoading: false,
  error: null,
  preferredLanguage: "javascript",
};

// Reducer function
function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.payload };
    case "SET_CURRENT_CONVERSATION":
      return { ...state, currentConversationId: action.payload };
    case "ADD_CONVERSATION":
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
        currentConversationId: action.payload.id,
      };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "ADD_USER_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "ADD_ASSISTANT_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_PREFERRED_LANGUAGE":
      return { ...state, preferredLanguage: action.payload };
    default:
      return state;
  }
}

const HomePage: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'chat' | 'topics' | 'history' | 'settings'>('chat');
  const { toast } = useToast();

  // Load conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      const conversations = await getConversations();
      dispatch({ type: "SET_CONVERSATIONS", payload: conversations });
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation history",
        variant: "destructive",
      });
    }
  };

  // Load messages when conversation changes
  useEffect(() => {
    if (state.currentConversationId) {
      fetchMessages(state.currentConversationId);
    } else {
      // Show welcome message when no conversation is selected
      dispatch({ type: "SET_MESSAGES", payload: [welcomeMessage] });
    }
  }, [state.currentConversationId]);

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const messages = await getMessages(conversationId);
      dispatch({ type: "SET_MESSAGES", payload: messages });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Create a new conversation with the given message
  const createNewConversation = async (content: string) => {
    try {
      // Create a title from the first few words of the message
      const title = content.length > 30
        ? content.substring(0, 30) + "..."
        : content;
      
      const conversation = await createConversation(title);
      dispatch({ type: "ADD_CONVERSATION", payload: conversation });
      
      // Now send the message within this conversation
      return conversation.id;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        variant: "destructive",
      });
      return null;
    }
  };

  // Send a message and get a response
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      
      // If no conversation is selected, create a new one
      let conversationId = state.currentConversationId;
      if (!conversationId) {
        conversationId = await createNewConversation(content);
        if (!conversationId) return;
      }
      
      // Add user message to UI immediately
      const userMessage = {
        id: Date.now(),
        role: 'user' as const,
        content,
        timestamp: new Date(),
      };
      dispatch({ type: "ADD_USER_MESSAGE", payload: userMessage });
      
      // Send message to API
      const response = await sendMessage(
        conversationId,
        content,
        state.preferredLanguage
      );
      
      // Add assistant response to UI
      dispatch({ type: "ADD_ASSISTANT_MESSAGE", payload: response.assistantMessage });
      
      // Invalidate conversations to update list
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to get response from AlgoTutor",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (id: number) => {
    dispatch({ type: "SET_CURRENT_CONVERSATION", payload: id });
  };

  // Handle topic selection
  const handleSelectTopic = (prompt: string) => {
    if (!prompt) return;
    handleSendMessage(prompt);
  };

  // Handle language change
  const handleLanguageChange = (language: string) => {
    dispatch({ type: "SET_PREFERRED_LANGUAGE", payload: language });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <ChatHeader onOpenSettings={() => setSettingsOpen(true)} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar (desktop) */}
        <Sidebar
          conversations={state.conversations}
          onSelectConversation={handleSelectConversation}
          currentConversationId={state.currentConversationId}
          onSelectTopic={handleSelectTopic}
          selectedSubtopic={selectedSubtopic}
          setSelectedSubtopic={setSelectedSubtopic}
        />
        
        {/* Main chat area */}
        <ChatContainer
          messages={state.messages}
          isLoading={state.isLoading}
          onSendMessage={handleSendMessage}
          preferredLanguage={state.preferredLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </div>
      
      {/* Mobile navigation */}
      <MobileNav
        activeTab={activeMobileTab}
        onChangeTab={setActiveMobileTab}
        onSelectTopic={(prompt) => {
          handleSelectTopic(prompt);
          setActiveMobileTab('chat');
        }}
        conversations={state.conversations}
        onSelectConversation={(id) => {
          handleSelectConversation(id);
          setActiveMobileTab('chat');
        }}
        currentConversationId={state.currentConversationId}
        selectedSubtopic={selectedSubtopic}
        setSelectedSubtopic={setSelectedSubtopic}
        onOpenSettings={() => {
          setSettingsOpen(true);
          setActiveMobileTab('chat');
        }}
      />
      
      {/* Settings dialog */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        preferredLanguage={state.preferredLanguage}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
};

export default HomePage;
