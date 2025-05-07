import React from "react";
import { Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChatHeaderProps {
  onOpenSettings: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-3 px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-primary text-xl font-bold">AlgoTutor</span>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1 text-gray-500 text-sm">
            <Badge variant="outline" className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              <div className="flex items-center space-x-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <span>API Connected</span>
              </div>
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full"
            onClick={onOpenSettings}
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:block">
            <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
