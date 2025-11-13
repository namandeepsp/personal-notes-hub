import { getEnv } from '@naman_deep_singh/server-utils';

export const SERVICES = {
  AUTH: getEnv('AUTH_SERVICE_URL', 'http://localhost:8080'),
  NOTES: getEnv('NOTES_SERVICE_URL', 'http://localhost:8081'),
};

export const PROTECTED_ROUTES = [
  '/api/notes',
  '/api/profile',
];