import React from "react";
import { format } from "date-fns";
import { ChatMessage as ChatMessageType } from "../../types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CodeBlock from "./code-block";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
  preferredLanguage: string;
  onLanguageChange?: (language: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  preferredLanguage,
  onLanguageChange,
}) => {
  const isUser = message.role === "user";
  const formattedTime = format(new Date(message.timestamp), "h:mm a");

  // Function to render message content with paragraphs
  const renderContent = (content: string) => {
    return content.split("\n").map((paragraph, index) => {
      // Skip empty paragraphs
      if (!paragraph.trim()) return null;
      
      // Check if the paragraph is a list item
      if (paragraph.trim().startsWith("-") || paragraph.trim().match(/^\d+\./)) {
        return (
          <li key={index} className="ml-5">
            {paragraph.trim().replace(/^-\s*|^\d+\.\s*/, "")}
          </li>
        );
      }
      
      return <p key={index} className={index > 0 ? "mt-2" : ""}>{paragraph}</p>;
    });
  };

  return (
    <div
      className={`message-appear p-4 md:p-6 rounded-xl shadow-sm mb-4 ${
        isUser
          ? "glass border border-primary/20 ml-auto md:ml-12 max-w-2xl bg-gradient-to-r from-primary/10 to-primary/5"
          : "glass-darker border border-white/10"
      }`}
    >
      <div className="flex">
        {!isUser && (
          <div className="flex-shrink-0 mr-4">
            <Avatar className="h-10 w-10 bg-primary/80 text-white border border-cyan-400/50 shadow-lg shadow-cyan-500/20">
              <Bot className="h-5 w-5" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          </div>
        )}

        <div className={`flex-1 ${isUser ? "text-right" : ""}`}>
          <div className={`font-medium mb-2 flex items-center ${isUser ? "justify-end" : ""}`}>
            <span className={`${isUser ? "text-foreground" : "text-white"}`}>
              {isUser ? "You" : "AlgoTutor"}
            </span>
            <span className="text-xs text-muted-foreground/70 mx-2">{formattedTime}</span>
          </div>

          <div className={`space-y-2 ${isUser ? "text-foreground" : "text-foreground/90"}`}>
            {/* Render text content */}
            <div className={`${isUser ? "text-right" : ""}`}>
              {renderContent(message.content)}
            </div>

            {/* Render code blocks if any */}
            {message.codeBlocks && message.codeBlocks.length > 0 && (
              <div className="mt-4">
                {message.codeBlocks.map((block, idx) => (
                  <CodeBlock
                    key={idx}
                    codeBlock={{
                      ...block,
                      language: block.language || preferredLanguage,
                    }}
                    onLanguageChange={onLanguageChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {isUser && (
          <div className="flex-shrink-0 ml-4">
            <Avatar className="h-10 w-10 bg-blue-500/50 text-white border border-blue-400/50 shadow-lg shadow-blue-500/20">
              <User className="h-5 w-5" />
              <AvatarFallback>YOU</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
