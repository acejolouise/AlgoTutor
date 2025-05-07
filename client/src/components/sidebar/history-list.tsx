import React from "react";
import { History } from "lucide-react";
import { Conversation } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface HistoryListProps {
  conversations: Conversation[];
  onSelectConversation: (id: number) => void;
  currentConversationId: number | null;
}

const HistoryList: React.FC<HistoryListProps> = ({
  conversations,
  onSelectConversation,
  currentConversationId,
}) => {
  if (conversations.length === 0) {
    return (
      <div className="p-4">
        <h2 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-3">
          Conversation History
        </h2>
        <p className="text-sm text-gray-400 italic">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-3">
        Conversation History
      </h2>
      <ScrollArea className="h-[200px]">
        <ul className="space-y-2 text-sm pr-2">
          {conversations.map((conversation) => (
            <li
              key={conversation.id}
              className={`flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors ${
                currentConversationId === conversation.id ? "bg-gray-100" : ""
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <History className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="truncate">{conversation.title}</span>
                <span className="text-xs text-gray-400">
                  {format(new Date(conversation.createdAt), "MMM d, h:mm a")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default HistoryList;
