import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatSessionSchema, insertChatMessageSchema, insertDatasetSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/chat-sessions", async (_req, res) => {
    const sessions = await storage.getChatSessions();
    res.json(sessions);
  });

  app.post("/api/chat-sessions", async (req, res) => {
    try {
      const data = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(data);
      res.json(session);
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ error: "Invalid request", details: e.errors });
      }
      throw e;
    }
  });

  app.get("/api/chat-sessions/:sessionId/messages", async (req, res) => {
    const messages = await storage.getChatMessages(req.params.sessionId);
    res.json(messages);
  });

  app.post("/api/chat-messages", async (req, res) => {
    try {
      const data = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(data);
      res.json(message);
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ error: "Invalid request", details: e.errors });
      }
      throw e;
    }
  });

  app.get("/api/datasets", async (_req, res) => {
    const datasets = await storage.getDatasets();
    res.json(datasets);
  });

  app.post("/api/datasets", async (req, res) => {
    try {
      const data = insertDatasetSchema.parse(req.body);
      const dataset = await storage.createDataset(data);
      res.json(dataset);
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ error: "Invalid request", details: e.errors });
      }
      throw e;
    }
  });

  return httpServer;
}
