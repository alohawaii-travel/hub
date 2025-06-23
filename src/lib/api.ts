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
      console.log(`🔍 API Request: ${endpoint}`);
      
      // Get session for authentication
      const session = await getSession();
      console.log(`📊 Session status:`, session ? "exists" : "null");

      // For internal endpoints, require authentication
      if (endpoint.startsWith("/api/internal") && !session?.user?.email) {
        console.log(`🚫 Authentication required for internal endpoint: ${endpoint}`);
        return {
          success: false,
          error: "Authentication required for internal endpoints",
        };
      }

      const url = `${this.baseUrl}${endpoint}`;
      console.log(`🌐 Making request to: ${url}`);
      
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

      console.log(`📤 Request config:`, {
        method: config.method || 'GET',
        headers: config.headers,
        hasBody: !!config.body
      });

      const response = await fetch(url, config);
      console.log(`📥 Response status:`, response.status, response.statusText);

      // Check if response is a redirect to signin (indicates not authenticated)
      if (response.url && response.url.includes("/api/auth/signin")) {
        console.log(`🔄 Redirected to signin: ${response.url}`);
        return {
          success: false,
          error: "Authentication required - redirected to signin",
        };
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP error! status: ${response.status}, body: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ Request successful:`, data);

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("❌ API request failed:", error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error("🌐 Network error - could be a connection issue or CORS problem");
      }
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
