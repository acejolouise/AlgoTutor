import React from "react";
import { MessageSquare, Code, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import TopicList from "./topic-list";
import HistoryList from "./history-list";
import { Conversation } from "../../types";

interface MobileNavProps {
  activeTab: 'chat' | 'topics' | 'history' | 'settings';
  onChangeTab: (tab: 'chat' | 'topics' | 'history' | 'settings') => void;
  onSelectTopic: (prompt: string) => void;
  conversations: Conversation[];
  onSelectConversation: (id: number) => void;
  currentConversationId: number | null;
  selectedSubtopic: string | null;
  setSelectedSubtopic: (id: string | null) => void;
  onOpenSettings: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onChangeTab,
  onSelectTopic,
  conversations,
  onSelectConversation,
  currentConversationId,
  selectedSubtopic,
  setSelectedSubtopic,
  onOpenSettings,
}) => {
  return (
    <nav className="md:hidden flex items-center justify-around bg-white border-t border-gray-200 py-2">
      <Button
        variant="ghost"
        className={`flex flex-col items-center p-2 ${
          activeTab === "chat" ? "text-primary" : "text-gray-500"
        }`}
        onClick={() => onChangeTab("chat")}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-xs mt-1">Chat</span>
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className={`flex flex-col items-center p-2 ${
              activeTab === "topics" ? "text-primary" : "text-gray-500"
            }`}
            onClick={() => onChangeTab("topics")}
          >
            <Code className="h-5 w-5" />
            <span className="text-xs mt-1">Topics</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] sm:w-[350px]">
          <TopicList
            onSelectTopic={onSelectTopic}
            selectedSubtopic={selectedSubtopic}
            setSelectedSubtopic={setSelectedSubtopic}
          />
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className={`flex flex-col items-center p-2 ${
              activeTab === "history" ? "text-primary" : "text-gray-500"
            }`}
            onClick={() => onChangeTab("history")}
          >
            <History className="h-5 w-5" />
            <span className="text-xs mt-1">History</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] sm:w-[350px]">
          <HistoryList
            conversations={conversations}
            onSelectConversation={onSelectConversation}
            currentConversationId={currentConversationId}
          />
        </SheetContent>
      </Sheet>

      <Button
        variant="ghost"
        className="flex flex-col items-center p-2 text-gray-500"
        onClick={onOpenSettings}
      >
        <Settings className="h-5 w-5" />
        <span className="text-xs mt-1">Settings</span>
      </Button>
    </nav>
  );
};

export default MobileNav;
