import OpenAI from "openai";
import { type CodeBlock } from "@shared/schema";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { ChatCompletionUserMessageParam, ChatCompletionSystemMessageParam, ChatCompletionAssistantMessageParam } from "openai/resources/chat/completions";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// System prompt for DSA tutor
const DSA_SYSTEM_PROMPT = `
You are AlgoTutor, an AI assistant specializing in data structures and algorithms education.
Your goal is to help users understand DSA concepts through clear explanations and code examples.

When responding:
1. Be concise but thorough in your explanations
2. Provide time and space complexity analysis when discussing algorithms
3. Give practical code examples that demonstrate the concept
4. Break down complex topics into simple steps
5. When presenting code, ensure it's correct, efficient, and follows best practices
6. If providing multiple code examples, show different approaches to the same problem
7. Explain trade-offs between different approaches

Always structure your responses in JSON format with these fields:
- explanation: Main textual explanation of the concept
- codeBlocks: Array of code examples, each with 'language' and 'code' fields
- complexity: Time and space complexity analysis (if applicable)
- furtherReadings: Optional suggestions for related topics

Be educational, encouraging, and focus on helping the user truly understand the concepts.
`;

export interface DSATutorResponse {
  explanation: string;
  codeBlocks?: CodeBlock[];
  complexity?: string;
  furtherReadings?: string[];
}

// Fallback responses for when OpenAI API is unavailable
const fallbackResponses = {
  linkedList: {
    explanation: "A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node in the sequence. Unlike arrays, linked lists don't require contiguous memory allocation.\n\nLinked lists come in several variants:\n- Singly linked list: Each node points to the next node\n- Doubly linked list: Each node points to both the next and previous nodes\n- Circular linked list: The last node points back to the first node\n\nThe main advantages of linked lists are dynamic size and efficient insertions/deletions. However, they don't allow random access to elements and require extra memory for pointers.",
    codeBlocks: [
      {
        language: "javascript",
        code: `class Node {\n  constructor(data) {\n    this.data = data;\n    this.next = null;\n  }\n}\n\nclass LinkedList {\n  constructor() {\n    this.head = null;\n    this.size = 0;\n  }\n\n  // Add a node to the end of the list\n  append(data) {\n    const newNode = new Node(data);\n    \n    if (!this.head) {\n      this.head = newNode;\n      this.size++;\n      return;\n    }\n    \n    let current = this.head;\n    while (current.next) {\n      current = current.next;\n    }\n    \n    current.next = newNode;\n    this.size++;\n  }\n\n  // Insert at a specific position\n  insertAt(data, index) {\n    if (index < 0 || index > this.size) {\n      return false; // Invalid index\n    }\n    \n    const newNode = new Node(data);\n    \n    if (index === 0) {\n      newNode.next = this.head;\n      this.head = newNode;\n      this.size++;\n      return true;\n    }\n    \n    let current = this.head;\n    let previous = null;\n    let count = 0;\n    \n    while (count < index) {\n      previous = current;\n      current = current.next;\n      count++;\n    }\n    \n    newNode.next = current;\n    previous.next = newNode;\n    this.size++;\n    return true;\n  }\n\n  // Remove a node by value\n  remove(data) {\n    if (!this.head) {\n      return false;\n    }\n    \n    if (this.head.data === data) {\n      this.head = this.head.next;\n      this.size--;\n      return true;\n    }\n    \n    let current = this.head;\n    let previous = null;\n    \n    while (current && current.data !== data) {\n      previous = current;\n      current = current.next;\n    }\n    \n    if (!current) {\n      return false; // Data not found\n    }\n    \n    previous.next = current.next;\n    this.size--;\n    return true;\n  }\n\n  // Print the list\n  print() {\n    let current = this.head;\n    let result = '';\n    \n    while (current) {\n      result += current.data + ' -> ';\n      current = current.next;\n    }\n    \n    return result + 'null';\n  }\n}`
      }
    ],
    complexity: "Operations:\n- Access: O(n) - must traverse from the head\n- Insert/Delete at beginning: O(1)\n- Insert/Delete at end: O(n) without a tail pointer, O(1) with a tail pointer\n- Insert/Delete in middle: O(n)\n- Search: O(n)\n\nSpace complexity: O(n)",
    furtherReadings: ["Doubly Linked Lists", "Circular Linked Lists", "Skip Lists", "XOR Linked Lists"]
  },
  binarySearch: {
    explanation: "Binary search is an efficient algorithm for finding a target value within a sorted array. It works by repeatedly dividing the search interval in half.\n\nThe algorithm compares the target value to the middle element of the array:\n- If they are equal, the search is complete\n- If the target is less than the middle element, continue searching in the lower half\n- If the target is greater than the middle element, continue searching in the upper half\n\nThis divide-and-conquer approach allows binary search to achieve logarithmic time complexity, making it much faster than linear search for large datasets.",
    codeBlocks: [
      {
        language: "javascript",
        code: `// Iterative Binary Search\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    // Find the middle index (avoid overflow in other languages)\n    const mid = left + Math.floor((right - left) / 2);\n    \n    // Check if target is at mid\n    if (arr[mid] === target) {\n      return mid;\n    }\n    \n    // If target is greater, ignore left half\n    if (arr[mid] < target) {\n      left = mid + 1;\n    } \n    // If target is smaller, ignore right half\n    else {\n      right = mid - 1;\n    }\n  }\n  \n  // Target not found\n  return -1;\n}`
      },
      {
        language: "javascript",
        code: `// Recursive Binary Search\nfunction binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {\n  // Base case: not found\n  if (left > right) {\n    return -1;\n  }\n  \n  // Find the middle index\n  const mid = left + Math.floor((right - left) / 2);\n  \n  // Found the target\n  if (arr[mid] === target) {\n    return mid;\n  }\n  \n  // Recursive cases\n  if (arr[mid] < target) {\n    // Search in the right half\n    return binarySearchRecursive(arr, target, mid + 1, right);\n  } else {\n    // Search in the left half\n    return binarySearchRecursive(arr, target, left, mid - 1);\n  }\n}`
      }
    ],
    complexity: "Time Complexity:\n- Best case: O(1) - target is found at the middle\n- Average case: O(log n) - dividing the search space in half each time\n- Worst case: O(log n) - need to divide until search space is exhausted\n\nSpace Complexity:\n- Iterative: O(1) - only uses a constant amount of additional space\n- Recursive: O(log n) - due to the call stack",
    furtherReadings: ["Binary Search Variations", "Lower and Upper Bound", "Binary Search in Rotated Arrays", "Exponential Search"]
  },
  defaultResponse: {
    explanation: "I apologize, but the OpenAI API is currently unavailable due to quota limitations. The AlgoTutor application is designed to provide explanations and code examples for data structures and algorithms concepts.\n\nWhile the API is unavailable, I can suggest exploring these common DSA topics:\n\n1. Basic data structures: arrays, linked lists, stacks, queues\n2. Advanced data structures: trees, graphs, heaps, hash tables\n3. Sorting algorithms: quicksort, mergesort, heapsort\n4. Searching algorithms: binary search, depth-first search, breadth-first search\n5. Dynamic programming and recursion\n6. Graph algorithms: shortest path, minimum spanning tree\n\nPlease try again later when the API quota has been reset or updated.",
    codeBlocks: [],
    complexity: "N/A",
    furtherReadings: ["Data Structures and Algorithms", "Competitive Programming", "Technical Interview Preparation"]
  }
};

// Function to guess the topic based on user message
function guessTopicFromMessage(message: string): string {
  message = message.toLowerCase();
  
  if (message.includes("linked list") || message.includes("linkedlist") || message.includes("linked-list")) {
    return "linkedList";
  }
  
  if (message.includes("binary search") || message.includes("binarysearch")) {
    return "binarySearch";
  }
  
  return "defaultResponse";
}

export async function getDSATutorResponse(
  messages: { role: string; content: string }[],
  preferredLanguage: string = "javascript"
): Promise<DSATutorResponse> {
  try {
    // Add language preference to the user's question
    const systemMessage: ChatCompletionSystemMessageParam = { 
      role: "system", 
      content: DSA_SYSTEM_PROMPT 
    };
    
    const mappedMessages = messages.map(msg => {
      if (msg.role === "user") {
        return {
          role: "user" as const,
          content: `${msg.content} (Preferred programming language: ${preferredLanguage})`
        } as ChatCompletionUserMessageParam;
      } else if (msg.role === "assistant") {
        return { 
          role: "assistant" as const, 
          content: msg.content 
        } as ChatCompletionAssistantMessageParam;
      } else if (msg.role === "system") {
        return { 
          role: "system" as const, 
          content: msg.content 
        } as ChatCompletionSystemMessageParam;
      } else {
        // Default to user role for any other roles
        return { 
          role: "user" as const, 
          content: msg.content 
        } as ChatCompletionUserMessageParam;
      }
    });
    
    const enhancedMessages = [systemMessage, ...mappedMessages];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: enhancedMessages,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content || "{}";
    const parsedResponse = JSON.parse(content) as DSATutorResponse;

    // Ensure the structure is valid
    return {
      explanation: parsedResponse.explanation || "I couldn't generate an explanation. Please try again.",
      codeBlocks: parsedResponse.codeBlocks || [],
      complexity: parsedResponse.complexity,
      furtherReadings: parsedResponse.furtherReadings
    };
  } catch (error: unknown) {
    console.error("Error getting DSA tutor response:", error);
    
    // Handle rate limit errors with fallback responses
    const errorObj = error as { status?: number; message?: string };
    if (
      errorObj.status === 429 || 
      (typeof errorObj.message === 'string' && 
        (errorObj.message.includes("quota") || errorObj.message.includes("rate limit")))
    ) {
      console.log("OpenAI API rate limit reached. Using fallback response.");
      
      // Get the latest user message to determine the topic
      const latestUserMessage = [...messages].reverse().find(msg => msg.role === "user");
      const topic = latestUserMessage 
        ? guessTopicFromMessage(latestUserMessage.content) 
        : "defaultResponse";
      
      // Return the appropriate fallback response with the preferred language
      const response = fallbackResponses[topic as keyof typeof fallbackResponses] || fallbackResponses.defaultResponse;
      
      // Update code blocks to match preferred language if possible
      if (response.codeBlocks && response.codeBlocks.length > 0) {
        response.codeBlocks = response.codeBlocks.map((block: { language: string; code: string }) => {
          if (preferredLanguage && preferredLanguage !== block.language) {
            // We don't actually translate the code here, just note that we would if API was working
            return {
              ...block,
              code: block.code,
              language: block.language,
            };
          }
          return block;
        });
      }
      
      return response;
    }
    
    // For other errors, throw the original error
    const errorMessage = errorObj.message || "Unknown error";
    throw new Error(`Failed to get response from OpenAI: ${errorMessage}`);
  }
}
