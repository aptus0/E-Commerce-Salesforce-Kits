import dotenv from 'dotenv';

dotenv.config();

function getNumber(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a number.`);
  }

  return parsed;
}

function getBoolean(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (!value) return fallback;

  return ['true', '1', 'yes'].includes(value.toLowerCase());
}

export const config = {
  port: getNumber('PORT', 5000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  useMockData: getBoolean('USE_MOCK_DATA', true),
  lowStockThreshold: getNumber('LOW_STOCK_THRESHOLD', 5),

  salesforce: {
    loginUrl: process.env.SALESFORCE_LOGIN_URL ?? 'https://login.salesforce.com',
    authAlias: process.env.SALESFORCE_AUTH_ALIAS ?? '',
    username: process.env.SALESFORCE_USERNAME ?? '',
    password: process.env.SALESFORCE_PASSWORD ?? '',
    securityToken: process.env.SALESFORCE_SECURITY_TOKEN ?? '',
    accessToken: process.env.SALESFORCE_ACCESS_TOKEN ?? '',
    instanceUrl: process.env.SALESFORCE_INSTANCE_URL ?? '',
    apiVersion: process.env.SALESFORCE_API_VERSION ?? '60.0'
  }
} as const;
