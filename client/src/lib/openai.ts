import { Topic, SubTopic } from "../types";

// DSA topics data structure
export const dsaTopics: Topic[] = [
  {
    id: "data-structures",
    name: "Data Structures",
    icon: "fa-layer-group",
    subtopics: [
      { id: "arrays", name: "Arrays & Strings", parentId: "data-structures" },
      { id: "linked-lists", name: "Linked Lists", parentId: "data-structures" },
      { id: "stacks-queues", name: "Stacks & Queues", parentId: "data-structures" },
      { id: "trees-graphs", name: "Trees & Graphs", parentId: "data-structures" },
      { id: "hash-tables", name: "Hash Tables", parentId: "data-structures" },
    ],
  },
  {
    id: "algorithms",
    name: "Algorithms",
    icon: "fa-code",
    subtopics: [
      { id: "sorting", name: "Sorting", parentId: "algorithms" },
      { id: "searching", name: "Searching", parentId: "algorithms" },
      { id: "dynamic-programming", name: "Dynamic Programming", parentId: "algorithms" },
      { id: "greedy", name: "Greedy Algorithms", parentId: "algorithms" },
    ],
  },
];

// Programming languages supported
export const programmingLanguages = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "Go",
  "Ruby",
  "C#",
  "TypeScript",
  "Swift",
  "Kotlin",
];

// Generate a prompt for a specific DSA topic
export function generateTopicPrompt(topicId: string, subtopicId: string): string {
  const topic = dsaTopics.find(t => t.id === topicId);
  if (!topic) return "";
  
  const subtopic = topic.subtopics.find(s => s.id === subtopicId);
  if (!subtopic) return "";
  
  const prompts: Record<string, Record<string, string>> = {
    "data-structures": {
      "arrays": "Explain arrays and their implementation. What are the common operations and their time complexities?",
      "linked-lists": "Explain linked lists and their variations (singly, doubly, circular). What are the advantages over arrays?",
      "stacks-queues": "Explain how stacks and queues work. What are the main operations and applications?",
      "trees-graphs": "Explain tree and graph data structures. How are they implemented and traversed?",
      "hash-tables": "Explain hash tables. How do they work internally and what are their time complexities?",
    },
    "algorithms": {
      "sorting": "Explain the most common sorting algorithms. Compare their time and space complexities.",
      "searching": "Explain binary search and other searching algorithms. What are their time complexities?",
      "dynamic-programming": "Explain dynamic programming approach. What problems can it solve efficiently?",
      "greedy": "Explain greedy algorithms. When are they useful and what are their limitations?",
    }
  };
  
  return prompts[topicId]?.[subtopicId] || 
    `Can you explain the concept of ${subtopic.name} in ${topic.name}?`;
}

// Initial welcome message
export const welcomeMessage = {
  id: 0,
  role: "assistant" as const,
  content: "👋 Welcome to AlgoTutor! I'm here to help you practice data structures and algorithms.\n\nYou can ask me questions about:\n- Explanations of DS&A concepts\n- Code examples in your preferred language\n- Time and space complexity analysis\n- Problem-solving strategies\n\nWhat would you like to learn about today?",
  timestamp: new Date(),
  codeBlocks: []
};
