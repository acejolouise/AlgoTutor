import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Paperclip, Code } from "lucide-react";
import { programmingLanguages } from "../../lib/openai";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  preferredLanguage: string;
  onLanguageChange: (language: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  preferredLanguage,
  onLanguageChange,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    onSendMessage(message);
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Handle key press (Shift+Enter for new line, Enter to submit)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 sticky bottom-0">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="flex">
          <div className="flex-grow relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any DSA concept..."
              className="w-full min-h-10 pl-4 pr-20 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              disabled={isLoading}
              rows={1}
            />
            <div className="absolute right-2 top-2 flex space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-gray-600"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-gray-600"
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white px-4 rounded-r-lg"
            disabled={isLoading || !message.trim()}
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <label>Language:</label>
              <select
                className="bg-gray-100 border border-gray-200 rounded p-1"
                value={preferredLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
              >
                {programmingLanguages.map((lang) => (
                  <option key={lang} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <label>Mode:</label>
              <select className="bg-gray-100 border border-gray-200 rounded p-1">
                <option>Learn</option>
                <option>Practice</option>
                <option>Interview Prep</option>
              </select>
            </div>
          </div>
          <div className="text-xs text-gray-400">Press Shift+Enter for new line</div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
