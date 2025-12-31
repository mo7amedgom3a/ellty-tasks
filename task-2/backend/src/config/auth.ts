import dotenv from 'dotenv';
dotenv.config();

interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptSaltRounds: number;
}

const authConfig: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || 'test-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  bcryptSaltRounds: 10,
};

export default authConfig;
