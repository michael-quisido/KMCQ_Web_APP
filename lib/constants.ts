export const DB_CONFIG = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "yourusernamedb",
  password: process.env.DB_PASSWORD || "yoursampledbpassword",
  database: process.env.DB_NAME || "yournewdb",
  waitForConnections: true,
  connectionLimit: 10,
};

export const JWT_SECRET = process.env.JWT_SECRET || "kmcq-admin-jwt-secret-2026";
export const AUTH_COOKIE_NAME = "kmcq_admin_token";
