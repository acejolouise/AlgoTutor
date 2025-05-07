import OpenAI from "openai";
import { type CodeBlock } from "@shared/schema";

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

export async function getDSATutorResponse(
  messages: { role: string; content: string }[],
  preferredLanguage: string = "javascript"
): Promise<DSATutorResponse> {
  try {
    // Add language preference to the user's question
    const enhancedMessages = [
      { role: "system", content: DSA_SYSTEM_PROMPT },
      ...messages.map(msg => {
        if (msg.role === "user") {
          return {
            role: "user",
            content: `${msg.content} (Preferred programming language: ${preferredLanguage})`
          };
        }
        return msg;
      })
    ];

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
  } catch (error) {
    console.error("Error getting DSA tutor response:", error);
    throw new Error(`Failed to get response from OpenAI: ${error.message}`);
  }
}
