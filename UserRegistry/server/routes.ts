import type { Express, Response } from "express";
import type { Request } from "express-serve-static-core";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as schema from "@shared/schema";
import type { Session, SessionData } from "express-session";

// Extend Express Request to include session
declare module "express-serve-static-core" {
  interface Request {
    session: Session & Partial<SessionData> & {
      userId?: string;
      userRole?: "admin" | "user" | "owner";
    };
  }
}

// Middleware to check authentication
function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Middleware to check admin role
function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session?.userId || req.session.userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

// Middleware to check user role
function requireUser(req: Request, res: Response, next: Function) {
  if (!req.session?.userId || req.session.userRole !== "user") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

// Middleware to check store owner role
function requireOwner(req: Request, res: Response, next: Function) {
  if (!req.session?.userId || req.session.userRole !== "owner") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ==================== AUTH ROUTES ====================
  
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = schema.loginSchema.parse(req.body);

      // Try to find user in each table
      const admin = await storage.verifyAdminPassword(email, password);
      if (admin) {
        req.session.userId = admin.id;
        req.session.userRole = "admin";
        return res.json({ 
          role: "admin", 
          user: { id: admin.id, name: admin.name, email: admin.email }
        });
      }

      const user = await storage.verifyUserPassword(email, password);
      if (user) {
        req.session.userId = user.id;
        req.session.userRole = "user";
        return res.json({ 
          role: "user", 
          user: { id: user.id, name: user.name, email: user.email }
        });
      }

      const store = await storage.verifyStorePassword(email, password);
      if (store) {
        req.session.userId = store.id;
        req.session.userRole = "owner";
        return res.json({ 
          role: "owner", 
          user: { id: store.id, name: store.name, email: store.email }
        });
      }

      return res.status(401).json({ error: "Invalid credentials" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { role, ...userData } = req.body;
      
      if (role === "admin") {
        const data = schema.insertAdminSchema.parse(userData);
        const existing = await storage.getAdminByEmail(data.email);
        if (existing) {
          return res.status(400).json({ error: "Email already registered" });
        }
        const admin = await storage.createAdmin(data);
        req.session.userId = admin.id;
        req.session.userRole = "admin";
        return res.json({ 
          role: "admin", 
          user: { id: admin.id, name: admin.name, email: admin.email }
        });
      } else if (role === "user") {
        const data = schema.insertUserSchema.parse(userData);
        const existing = await storage.getUserByEmail(data.email);
        if (existing) {
          return res.status(400).json({ error: "Email already registered" });
        }
        const user = await storage.createUser(data);
        req.session.userId = user.id;
        req.session.userRole = "user";
        return res.json({ 
          role: "user", 
          user: { id: user.id, name: user.name, email: user.email }
        });
      } else if (role === "owner") {
        const data = schema.insertStoreSchema.parse(userData);
        const existing = await storage.getStoreByEmail(data.email);
        if (existing) {
          return res.status(400).json({ error: "Email already registered" });
        }
        const store = await storage.createStore(data);
        req.session.userId = store.id;
        req.session.userRole = "owner";
        return res.json({ 
          role: "owner", 
          user: { id: store.id, name: store.name, email: store.email }
        });
      }

      return res.status(400).json({ error: "Invalid role" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const role = req.session.userRole;
      const userId = req.session.userId;

      if (role === "admin") {
        const admin = await storage.getAdminById(userId!);
        return res.json({ 
          role: "admin", 
          user: admin ? { id: admin.id, name: admin.name, email: admin.email } : null
        });
      } else if (role === "user") {
        const user = await storage.getUserById(userId!);
        return res.json({ 
          role: "user", 
          user: user ? { id: user.id, name: user.name, email: user.email } : null
        });
      } else if (role === "owner") {
        const store = await storage.getStoreById(userId!);
        return res.json({ 
          role: "owner", 
          user: store ? { id: store.id, name: store.name, email: store.email } : null
        });
      }

      return res.status(401).json({ error: "Unauthorized" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Internal error" });
    }
  });

  app.post("/api/auth/change-password", requireAuth, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = schema.changePasswordSchema.parse(req.body);
      const role = req.session.userRole;
      const userId = req.session.userId!;

      if (role === "admin") {
        const admin = await storage.getAdminById(userId);
        if (!admin) return res.status(404).json({ error: "User not found" });
        
        const verified = await storage.verifyAdminPassword(admin.email, currentPassword);
        if (!verified) {
          return res.status(401).json({ error: "Current password is incorrect" });
        }
        
        await storage.updateAdminPassword(userId, newPassword);
      } else if (role === "user") {
        const user = await storage.getUserById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        
        const verified = await storage.verifyUserPassword(user.email, currentPassword);
        if (!verified) {
          return res.status(401).json({ error: "Current password is incorrect" });
        }
        
        await storage.updateUserPassword(userId, newPassword);
      } else if (role === "owner") {
        const store = await storage.getStoreById(userId);
        if (!store) return res.status(404).json({ error: "User not found" });
        
        const verified = await storage.verifyStorePassword(store.email, currentPassword);
        if (!verified) {
          return res.status(401).json({ error: "Current password is incorrect" });
        }
        
        await storage.updateStorePassword(userId, newPassword);
      }

      return res.json({ success: true });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  // ==================== ADMIN ROUTES ====================

  app.get("/api/admin/stats", requireAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await storage.getStats();
      return res.json(stats);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Internal error" });
    }
  });

  app.get("/api/admin/users", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { name, email, address } = req.query;
      const filters = {
        name: name as string | undefined,
        email: email as string | undefined,
        address: address as string | undefined,
      };
      
      const [users, admins] = await Promise.all([
        storage.getAllUsers(filters),
        storage.getAllAdmins(filters),
      ]);

      const allUsers = [
        ...users.map(u => ({ ...u, role: "user", password: undefined })),
        ...admins.map(a => ({ ...a, role: "admin", password: undefined })),
      ];

      return res.json(allUsers);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Internal error" });
    }
  });

  app.post("/api/admin/users", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { role, ...userData } = req.body;

      if (role === "admin") {
        const data = schema.insertAdminSchema.parse(userData);
        const existing = await storage.getAdminByEmail(data.email);
        if (existing) {
          return res.status(400).json({ error: "Email already registered" });
        }
        const admin = await storage.createAdmin(data);
        return res.json({ ...admin, role: "admin", password: undefined });
      } else if (role === "user") {
        const data = schema.insertUserSchema.parse(userData);
        const existing = await storage.getUserByEmail(data.email);
        if (existing) {
          return res.status(400).json({ error: "Email already registered" });
        }
        const user = await storage.createUser(data);
        return res.json({ ...user, role: "user", password: undefined });
      }

      return res.status(400).json({ error: "Invalid role" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.get("/api/admin/stores", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { name, email, address } = req.query;
      const filters = {
        name: name as string | undefined,
        email: email as string | undefined,
        address: address as string | undefined,
      };
      
      const stores = await storage.getAllStores(filters);
      return res.json(stores.map(s => ({ ...s, password: undefined })));
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Internal error" });
    }
  });

  app.post("/api/admin/stores", requireAdmin, async (req: Request, res: Response) => {
    try {
      const data = schema.insertStoreSchema.parse(req.body);
      const existing = await storage.getStoreByEmail(data.email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }
      const store = await storage.createStore(data);
      return res.json({ ...store, password: undefined, rating: 0 });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  // ==================== USER ROUTES ====================

  app.get("/api/user/stores", requireUser, async (req: Request, res: Response) => {
    try {
      const { name, address } = req.query;
      const filters = {
        name: name as string | undefined,
        address: address as string | undefined,
      };
      
      const stores = await storage.getAllStores(filters);
      const userId = req.session.userId!;

      // Get user ratings for each store
      const storesWithUserRating = await Promise.all(
        stores.map(async (store) => {
          const userRating = await storage.getUserRatingForStore(userId, store.id);
          return {
            ...store,
            password: undefined,
            userRating: userRating?.rating,
          };
        })
      );

      return res.json(storesWithUserRating);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Internal error" });
    }
  });

  app.post("/api/user/ratings", requireUser, async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId!;
      const { storeId, rating } = schema.insertRatingSchema.parse({
        userId,
        ...req.body,
      });

      const ratingRecord = await storage.createOrUpdateRating(userId, storeId, rating);
      return res.json(ratingRecord);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  // ==================== STORE OWNER ROUTES ====================

  app.get("/api/owner/stats", requireOwner, async (req: Request, res: Response) => {
    try {
      const storeId = req.session.userId!;
      const [ratings, averageRating] = await Promise.all([
        storage.getRatingsForStore(storeId),
        storage.getAverageRatingForStore(storeId),
      ]);

      return res.json({
        averageRating,
        totalRatings: ratings.length,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Internal error" });
    }
  });

  app.get("/api/owner/ratings", requireOwner, async (req: Request, res: Response) => {
    try {
      const storeId = req.session.userId!;
      const ratings = await storage.getRatingsForStore(storeId);
      return res.json(ratings);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Internal error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
