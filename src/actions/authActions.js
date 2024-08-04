import { createAction } from '@reduxjs/toolkit';

export const login = createAction('auth/login', (token, user) => {
  return { payload: { token, user } };
});

export const logout = createAction('auth/logout');
