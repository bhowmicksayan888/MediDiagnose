import { type User, type InsertUser, type DiagnosisRequest, type InsertDiagnosisRequest, type DiagnosisResponse } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createDiagnosisRequest(request: InsertDiagnosisRequest): Promise<DiagnosisRequest>;
  updateDiagnosisRequest(id: string, results: DiagnosisResponse): Promise<DiagnosisRequest>;
  getDiagnosisRequest(id: string): Promise<DiagnosisRequest | undefined>;
  getRecentDiagnosisRequests(limit: number): Promise<DiagnosisRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private diagnosisRequests: Map<string, DiagnosisRequest>;

  constructor() {
    this.users = new Map();
    this.diagnosisRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDiagnosisRequest(insertRequest: InsertDiagnosisRequest): Promise<DiagnosisRequest> {
    const id = randomUUID();
    const request: DiagnosisRequest = {
      ...insertRequest,
      id,
      results: null,
      createdAt: new Date(),
    };
    this.diagnosisRequests.set(id, request);
    return request;
  }

  async updateDiagnosisRequest(id: string, results: DiagnosisResponse): Promise<DiagnosisRequest> {
    const request = this.diagnosisRequests.get(id);
    if (!request) {
      throw new Error("Diagnosis request not found");
    }
    const updatedRequest = { ...request, results };
    this.diagnosisRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async getDiagnosisRequest(id: string): Promise<DiagnosisRequest | undefined> {
    return this.diagnosisRequests.get(id);
  }

  async getRecentDiagnosisRequests(limit: number): Promise<DiagnosisRequest[]> {
    return Array.from(this.diagnosisRequests.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
