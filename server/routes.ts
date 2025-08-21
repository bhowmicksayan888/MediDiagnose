import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { diagnosisInputSchema } from "@shared/schema";
import { generateDifferentialDiagnosis } from "./services/gemini";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate differential diagnosis
  app.post("/api/diagnosis", async (req, res) => {
    try {
      const validatedInput = diagnosisInputSchema.parse(req.body);
      
      // Create diagnosis request record
      const diagnosisRequest = await storage.createDiagnosisRequest({
        primarySymptom: validatedInput.primarySymptom,
        associatedSymptoms: validatedInput.associatedSymptoms,
        age: validatedInput.age,
        gender: validatedInput.gender,
      });

      // Generate AI analysis
      const analysisResults = await generateDifferentialDiagnosis(validatedInput);

      // Update request with results
      const updatedRequest = await storage.updateDiagnosisRequest(
        diagnosisRequest.id, 
        analysisResults
      );

      res.json({
        id: updatedRequest.id,
        ...analysisResults
      });
    } catch (error) {
      console.error("Error in diagnosis endpoint:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate diagnosis"
      });
    }
  });

  // Get diagnosis by ID
  app.get("/api/diagnosis/:id", async (req, res) => {
    try {
      const diagnosis = await storage.getDiagnosisRequest(req.params.id);
      
      if (!diagnosis) {
        return res.status(404).json({ message: "Diagnosis not found" });
      }

      res.json(diagnosis);
    } catch (error) {
      console.error("Error fetching diagnosis:", error);
      res.status(500).json({ message: "Failed to fetch diagnosis" });
    }
  });

  // Get recent diagnoses
  app.get("/api/diagnosis", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recentDiagnoses = await storage.getRecentDiagnosisRequests(limit);
      res.json(recentDiagnoses);
    } catch (error) {
      console.error("Error fetching recent diagnoses:", error);
      res.status(500).json({ message: "Failed to fetch diagnoses" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
