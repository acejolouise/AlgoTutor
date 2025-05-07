import React from "react";
import { Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChatHeaderProps {
  onOpenSettings: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="glass-darker border-b border-white/10 py-3 px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-2xl font-bold">AlgoTutor</span>
          <Badge variant="secondary" className="text-xs bg-primary/20 text-primary-foreground border border-primary/30">Beta</Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1 text-white/70 text-sm">
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-200 px-2 py-1 rounded-full text-xs border border-indigo-500/20">
              <div className="flex items-center space-x-1">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                <span>DSA Learning Mode</span>
              </div>
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
            onClick={onOpenSettings}
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:block">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
