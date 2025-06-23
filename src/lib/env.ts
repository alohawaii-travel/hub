type EnvironmentConfig = {
  nextAuthUrl: string;
  nextAuthSecret: string;
  googleClientId: string;
  googleClientSecret: string;
  allowedDomains: string[];
  apiUrl: string;
};

function getEnvironmentConfig(): EnvironmentConfig {
  const requiredEnvVars = {
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    apiUrl: process.env.API_URL,
  };

  // Check for missing required environment variables
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        "Please check your .env.local file."
    );
  }

  return {
    nextAuthUrl: requiredEnvVars.nextAuthUrl!,
    nextAuthSecret: requiredEnvVars.nextAuthSecret!,
    googleClientId: requiredEnvVars.googleClientId!,
    googleClientSecret: requiredEnvVars.googleClientSecret!,
    allowedDomains: process.env.ALLOWED_DOMAINS?.split(",") || [],
    apiUrl: requiredEnvVars.apiUrl!,
  };
}

export { getEnvironmentConfig };
export type { EnvironmentConfig };
