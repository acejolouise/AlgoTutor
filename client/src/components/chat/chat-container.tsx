import React, { useEffect, useRef } from "react";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { Loader2 } from "lucide-react";
import { ChatMessage as ChatMessageType } from "../../types";

interface ChatContainerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  preferredLanguage: string;
  onLanguageChange: (language: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  onSendMessage,
  preferredLanguage,
  onLanguageChange,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Chat messages area */}
      <div className="p-4 md:py-6 flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              preferredLanguage={preferredLanguage}
              onLanguageChange={onLanguageChange}
            />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 animate-pulse">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">AlgoTutor</div>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty div for scrolling to bottom */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat input area */}
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        preferredLanguage={preferredLanguage}
        onLanguageChange={onLanguageChange}
      />
    </div>
  );
};

export default ChatContainer;
