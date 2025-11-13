import { validateFields } from '@naman_deep_singh/server-utils';

export const validateSignup = validateFields([
  { field: 'name', required: true, type: 'string', minLength: 2 },
  { field: 'email', required: true, type: 'email' },
  { field: 'password', required: true, type: 'string', minLength: 6 }
]);

export const validateLogin = validateFields([
  { field: 'email', required: true, type: 'email' },
  { field: 'password', required: true, type: 'string' }
]);