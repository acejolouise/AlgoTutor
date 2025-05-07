import React from "react";
import { dsaTopics } from "../../lib/openai";
import { generateTopicPrompt } from "../../lib/openai";
import { SubTopic } from "../../types";
import { ChevronRight } from "lucide-react";

interface TopicListProps {
  onSelectTopic: (prompt: string) => void;
  selectedSubtopic: string | null;
  setSelectedSubtopic: (id: string | null) => void;
}

const TopicList: React.FC<TopicListProps> = ({
  onSelectTopic,
  selectedSubtopic,
  setSelectedSubtopic,
}) => {
  const handleSubtopicClick = (topicId: string, subtopic: SubTopic) => {
    setSelectedSubtopic(subtopic.id);
    const prompt = generateTopicPrompt(topicId, subtopic.id);
    onSelectTopic(prompt);
  };

  return (
    <div className="p-4">
      <h2 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-4">
        Topics
      </h2>

      {dsaTopics.map((topic) => (
        <div key={topic.id} className="mb-6">
          <div className="flex items-center space-x-2 mb-3 text-gray-700 font-medium">
            <i className={`fas ${topic.icon}`}></i>
            <span>{topic.name}</span>
          </div>

          <ul className="space-y-2 pl-6 text-sm">
            {topic.subtopics.map((subtopic) => (
              <li
                key={subtopic.id}
                className={`hover:text-primary cursor-pointer transition-colors ${
                  selectedSubtopic === subtopic.id
                    ? "text-primary font-medium"
                    : ""
                }`}
                onClick={() => handleSubtopicClick(topic.id, subtopic)}
              >
                <div className="flex items-center space-x-2">
                  <ChevronRight className="h-3 w-3" />
                  <span>{subtopic.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TopicList;
