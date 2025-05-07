import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getDSATutorResponse } from "./openai";
import { z } from "zod";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Get all conversations
  app.get("/api/conversations", async (_req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Create a new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const parsed = insertConversationSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid conversation data", errors: parsed.error });
      }
      
      const conversation = await storage.createConversation(parsed.data);
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // Get all messages for a conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      if (isNaN(conversationId)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }
      
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      const messages = await storage.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Add a message to a conversation and get AI response
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      if (isNaN(conversationId)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }
      
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      const languageSchema = z.object({
        content: z.string(),
        preferredLanguage: z.string().optional(),
      });
      
      const parsed = languageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid message data", errors: parsed.error });
      }
      
      // Create user message
      const userMessage = await storage.createMessage({
        conversationId,
        role: "user",
        content: parsed.data.content,
        codeBlocks: []
      });
      
      // Get existing conversation history
      const existingMessages = await storage.getMessages(conversationId);
      const chatHistory = existingMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Get response from OpenAI
      const aiResponse = await getDSATutorResponse(
        chatHistory,
        parsed.data.preferredLanguage || "javascript"
      );
      
      // Save AI response
      const assistantMessage = await storage.createMessage({
        conversationId,
        role: "assistant",
        content: aiResponse.explanation,
        codeBlocks: aiResponse.codeBlocks || []
      });
      
      res.json({
        userMessage,
        assistantMessage
      });
    } catch (error) {
      console.error("Error processing message:", error);
      res.status(500).json({ 
        message: "Failed to process message",
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
