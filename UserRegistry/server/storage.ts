import { eq, and, or, like, desc, sql } from "drizzle-orm";
import { db } from "./db";
import * as schema from "@shared/schema";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export class Storage {
  // Helper function to hash password
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Helper function to verify password
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // ==================== ADMIN OPERATIONS ====================

  async createAdmin(data: schema.InsertAdmin): Promise<schema.Admin> {
    const hashedPassword = await this.hashPassword(data.password);
    const [admin] = await db.insert(schema.admins)
      .values({ ...data, password: hashedPassword })
      .returning();
    return admin;
  }

  async getAdminByEmail(email: string): Promise<schema.Admin | undefined> {
    const [admin] = await db.select()
      .from(schema.admins)
      .where(eq(schema.admins.email, email));
    return admin;
  }

  async getAdminById(id: string): Promise<schema.Admin | undefined> {
    const [admin] = await db.select()
      .from(schema.admins)
      .where(eq(schema.admins.id, id));
    return admin;
  }

  async verifyAdminPassword(email: string, password: string): Promise<schema.Admin | null> {
    const admin = await this.getAdminByEmail(email);
    if (!admin) return null;
    const isValid = await this.verifyPassword(password, admin.password);
    return isValid ? admin : null;
  }

  async updateAdminPassword(id: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await this.hashPassword(newPassword);
    const result = await db.update(schema.admins)
      .set({ password: hashedPassword })
      .where(eq(schema.admins.id, id));
    return true;
  }

  async getAllAdmins(filters?: { name?: string; email?: string; address?: string }): Promise<schema.Admin[]> {
    if (filters) {
      const conditions = [];
      if (filters.name) conditions.push(like(schema.admins.name, `%${filters.name}%`));
      if (filters.email) conditions.push(like(schema.admins.email, `%${filters.email}%`));
      if (filters.address) conditions.push(like(schema.admins.address, `%${filters.address}%`));
      
      if (conditions.length > 0) {
        return db.select().from(schema.admins).where(or(...conditions));
      }
    }
    
    return db.select().from(schema.admins);
  }

  // ==================== USER OPERATIONS ====================

  async createUser(data: schema.InsertUser): Promise<schema.User> {
    const hashedPassword = await this.hashPassword(data.password);
    const [user] = await db.insert(schema.users)
      .values({ ...data, password: hashedPassword })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<schema.User | undefined> {
    const [user] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
    return user;
  }

  async getUserById(id: string): Promise<schema.User | undefined> {
    const [user] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return user;
  }

  async verifyUserPassword(email: string, password: string): Promise<schema.User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    const isValid = await this.verifyPassword(password, user.password);
    return isValid ? user : null;
  }

  async updateUserPassword(id: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await this.hashPassword(newPassword);
    await db.update(schema.users)
      .set({ password: hashedPassword })
      .where(eq(schema.users.id, id));
    return true;
  }

  async getAllUsers(filters?: { name?: string; email?: string; address?: string }): Promise<schema.User[]> {
    if (filters) {
      const conditions = [];
      if (filters.name) conditions.push(like(schema.users.name, `%${filters.name}%`));
      if (filters.email) conditions.push(like(schema.users.email, `%${filters.email}%`));
      if (filters.address) conditions.push(like(schema.users.address, `%${filters.address}%`));
      
      if (conditions.length > 0) {
        return db.select().from(schema.users).where(or(...conditions));
      }
    }
    
    return db.select().from(schema.users);
  }

  // ==================== STORE OPERATIONS ====================

  async createStore(data: schema.InsertStore): Promise<schema.Store> {
    const hashedPassword = await this.hashPassword(data.password);
    const [store] = await db.insert(schema.stores)
      .values({ ...data, password: hashedPassword })
      .returning();
    return store;
  }

  async getStoreByEmail(email: string): Promise<schema.Store | undefined> {
    const [store] = await db.select()
      .from(schema.stores)
      .where(eq(schema.stores.email, email));
    return store;
  }

  async getStoreById(id: string): Promise<schema.Store | undefined> {
    const [store] = await db.select()
      .from(schema.stores)
      .where(eq(schema.stores.id, id));
    return store;
  }

  async verifyStorePassword(email: string, password: string): Promise<schema.Store | null> {
    const store = await this.getStoreByEmail(email);
    if (!store) return null;
    const isValid = await this.verifyPassword(password, store.password);
    return isValid ? store : null;
  }

  async updateStorePassword(id: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await this.hashPassword(newPassword);
    await db.update(schema.stores)
      .set({ password: hashedPassword })
      .where(eq(schema.stores.id, id));
    return true;
  }

  async getAllStores(filters?: { name?: string; email?: string; address?: string }): Promise<Array<schema.Store & { rating: number }>> {
    const baseQuery = db.select({
      id: schema.stores.id,
      name: schema.stores.name,
      email: schema.stores.email,
      address: schema.stores.address,
      password: schema.stores.password,
      createdAt: schema.stores.createdAt,
      rating: sql<number>`COALESCE(AVG(${schema.ratings.rating}), 0)`,
    })
    .from(schema.stores)
    .leftJoin(schema.ratings, eq(schema.stores.id, schema.ratings.storeId))
    .groupBy(schema.stores.id);

    let results;
    if (filters) {
      const conditions = [];
      if (filters.name) conditions.push(like(schema.stores.name, `%${filters.name}%`));
      if (filters.email) conditions.push(like(schema.stores.email, `%${filters.email}%`));
      if (filters.address) conditions.push(like(schema.stores.address, `%${filters.address}%`));
      
      if (conditions.length > 0) {
        results = await baseQuery.where(or(...conditions));
      } else {
        results = await baseQuery;
      }
    } else {
      results = await baseQuery;
    }

    return results.map(r => ({
      ...r,
      rating: Number(r.rating) || 0
    }));
  }

  // ==================== RATING OPERATIONS ====================

  async createOrUpdateRating(userId: string, storeId: string, rating: number): Promise<schema.Rating> {
    // Check if rating already exists
    const [existing] = await db.select()
      .from(schema.ratings)
      .where(and(
        eq(schema.ratings.userId, userId),
        eq(schema.ratings.storeId, storeId)
      ));

    if (existing) {
      // Update existing rating
      const [updated] = await db.update(schema.ratings)
        .set({ rating })
        .where(eq(schema.ratings.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new rating
      const [newRating] = await db.insert(schema.ratings)
        .values({ userId, storeId, rating })
        .returning();
      return newRating;
    }
  }

  async getUserRatingForStore(userId: string, storeId: string): Promise<schema.Rating | undefined> {
    const [rating] = await db.select()
      .from(schema.ratings)
      .where(and(
        eq(schema.ratings.userId, userId),
        eq(schema.ratings.storeId, storeId)
      ));
    return rating;
  }

  async getRatingsForStore(storeId: string): Promise<Array<schema.Rating & { userName: string; userEmail: string }>> {
    const ratings = await db.select({
      id: schema.ratings.id,
      userId: schema.ratings.userId,
      storeId: schema.ratings.storeId,
      rating: schema.ratings.rating,
      createdAt: schema.ratings.createdAt,
      userName: schema.users.name,
      userEmail: schema.users.email,
    })
    .from(schema.ratings)
    .innerJoin(schema.users, eq(schema.ratings.userId, schema.users.id))
    .where(eq(schema.ratings.storeId, storeId))
    .orderBy(desc(schema.ratings.createdAt));

    return ratings;
  }

  async getAverageRatingForStore(storeId: string): Promise<number> {
    const [result] = await db.select({
      avg: sql<number>`COALESCE(AVG(${schema.ratings.rating}), 0)`,
    })
    .from(schema.ratings)
    .where(eq(schema.ratings.storeId, storeId));

    return Number(result.avg) || 0;
  }

  // ==================== STATISTICS ====================

  async getStats(): Promise<{ totalUsers: number; totalStores: number; totalRatings: number }> {
    const [userCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(schema.users);
    const [storeCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(schema.stores);
    const [ratingCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(schema.ratings);

    return {
      totalUsers: Number(userCount.count) || 0,
      totalStores: Number(storeCount.count) || 0,
      totalRatings: Number(ratingCount.count) || 0,
    };
  }
}

export const storage = new Storage();
