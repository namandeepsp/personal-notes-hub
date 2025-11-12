export const SERVICES = {
  AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:8080',
  NOTES: process.env.NOTES_SERVICE_URL || 'http://localhost:8081',
};

export const PROTECTED_ROUTES = [
  '/api/notes',
  '/api/profile',
];