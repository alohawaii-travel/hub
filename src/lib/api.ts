import { getSession } from "next-auth/react";

// Define proper types for API responses
type APIResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

type UserData = {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  language?: string;
};

type TourData = {
  id?: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
};

class APIClient {
  private baseUrl: string;

  constructor(
    baseUrl: string = process.env.API_URL || "http://localhost:4000"
  ) {
    this.baseUrl = baseUrl;
  }

  private  async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      // Get session for authentication
      const session = await getSession();

      // For internal endpoints, require authentication
      if (endpoint.startsWith("/api/internal") && !session?.user?.email) {
        return {
          success: false,
          error: "Authentication required for internal endpoints",
        };
      }

      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          ...(session?.user?.email && {
            Authorization: `Bearer ${session.user.email}`,
          }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);

      // Check if response is a redirect to signin (indicates not authenticated)
      if (response.url && response.url.includes("/api/auth/signin")) {
        return {
          success: false,
          error: "Authentication required - redirected to signin",
        };
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // User management
  async getCurrentUser() {
    return this.makeRequest<UserData>("/api/internal/users/me");
  }

  async updateCurrentUser(userData: Partial<UserData>) {
    // Double-check: Don't even attempt the request if no session exists
    const session = await getSession();
    if (!session?.user?.email) {
      console.log("🚫 No valid session found, skipping user update");
      return {
        success: false,
        error: "No valid session found",
      };
    }
    
    return this.makeRequest<UserData>("/api/internal/users/me", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Health check
  async healthCheck() {
    return this.makeRequest<{ status: string; timestamp: string }>(
      "/api/external/health"
    );
  }

  // Tours (placeholder for future implementation)
  async getTours() {
    return this.makeRequest<TourData[]>("/api/internal/tours");
  }

  async createTour(tourData: Omit<TourData, "id">) {
    return this.makeRequest<TourData>("/api/internal/tours", {
      method: "POST",
      body: JSON.stringify(tourData),
    });
  }

  // Reservations (placeholder for future implementation)
  async getReservations() {
    return this.makeRequest<unknown[]>("/api/internal/reservations");
  }
}

// Export singleton instance
export const apiClient = new APIClient();
export default APIClient;
