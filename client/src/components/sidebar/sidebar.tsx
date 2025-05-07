import React from "react";
import TopicList from "./topic-list";
import HistoryList from "./history-list";
import { Conversation } from "../../types";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  conversations: Conversation[];
  onSelectConversation: (id: number) => void;
  currentConversationId: number | null;
  onSelectTopic: (prompt: string) => void;
  selectedSubtopic: string | null;
  setSelectedSubtopic: (id: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  onSelectConversation,
  currentConversationId,
  onSelectTopic,
  selectedSubtopic,
  setSelectedSubtopic,
}) => {
  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 overflow-y-auto h-full">
      <TopicList
        onSelectTopic={onSelectTopic}
        selectedSubtopic={selectedSubtopic}
        setSelectedSubtopic={setSelectedSubtopic}
      />
      
      <Separator className="my-2" />
      
      <HistoryList
        conversations={conversations}
        onSelectConversation={onSelectConversation}
        currentConversationId={currentConversationId}
      />
    </aside>
  );
};

export default Sidebar;
