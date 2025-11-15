import { apiRequest } from "./queryClient";

export interface UserData {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  role: "admin" | "user" | "owner";
  user: UserData;
}

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiRequest("POST", "/api/auth/login", { email, password });
    return res.json();
  },

  register: async (data: {
    name: string;
    email: string;
    address: string;
    password: string;
    role: string;
  }): Promise<AuthResponse> => {
    const res = await apiRequest("POST", "/api/auth/register", data);
    return res.json();
  },

  logout: async (): Promise<void> => {
    await apiRequest("POST", "/api/auth/logout");
  },

  getMe: async (): Promise<AuthResponse> => {
    const res = await apiRequest("GET", "/api/auth/me");
    return res.json();
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiRequest("POST", "/api/auth/change-password", { currentPassword, newPassword });
  },
};

export const adminApi = {
  getStats: async (): Promise<{ totalUsers: number; totalStores: number; totalRatings: number }> => {
    const res = await apiRequest("GET", "/api/admin/stats");
    return res.json();
  },

  getUsers: async (filters?: {
    name?: string;
    email?: string;
    address?: string;
  }): Promise<any[]> => {
    const params = new URLSearchParams();
    if (filters?.name) params.append("name", filters.name);
    if (filters?.email) params.append("email", filters.email);
    if (filters?.address) params.append("address", filters.address);
    const query = params.toString();
    const res = await apiRequest("GET", `/api/admin/users${query ? `?${query}` : ""}`);
    return res.json();
  },

  addUser: async (data: any): Promise<any> => {
    const res = await apiRequest("POST", "/api/admin/users", data);
    return res.json();
  },

  getStores: async (filters?: {
    name?: string;
    email?: string;
    address?: string;
  }): Promise<any[]> => {
    const params = new URLSearchParams();
    if (filters?.name) params.append("name", filters.name);
    if (filters?.email) params.append("email", filters.email);
    if (filters?.address) params.append("address", filters.address);
    const query = params.toString();
    const res = await apiRequest("GET", `/api/admin/stores${query ? `?${query}` : ""}`);
    return res.json();
  },

  addStore: async (data: any): Promise<any> => {
    const res = await apiRequest("POST", "/api/admin/stores", data);
    return res.json();
  },
};

export const userApi = {
  getStores: async (filters?: { name?: string; address?: string }): Promise<any[]> => {
    const params = new URLSearchParams();
    if (filters?.name) params.append("name", filters.name);
    if (filters?.address) params.append("address", filters.address);
    const query = params.toString();
    const res = await apiRequest("GET", `/api/user/stores${query ? `?${query}` : ""}`);
    return res.json();
  },

  submitRating: async (storeId: string, rating: number): Promise<any> => {
    const res = await apiRequest("POST", "/api/user/ratings", { storeId, rating });
    return res.json();
  },
};

export const ownerApi = {
  getStats: async (): Promise<{ averageRating: number; totalRatings: number }> => {
    const res = await apiRequest("GET", "/api/owner/stats");
    return res.json();
  },

  getRatings: async (): Promise<any[]> => {
    const res = await apiRequest("GET", "/api/owner/ratings");
    return res.json();
  },
};
