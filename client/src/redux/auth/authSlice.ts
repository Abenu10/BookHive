import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  user: any;
  roles: string[];
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userType: 'USER' | 'ADMIN' | 'OWNER' | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  roles: [],
  isAuthenticated: false,
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  userType: localStorage.getItem('user_type') as AuthState['userType'],
  loading: false,
  error: null,
  
};
interface LoginPayload {
  userType: 'USER' | 'ADMIN' | 'OWNER';
  email: string;
  password: string;
}

interface SignupPayload {
  userType: 'USER' | 'ADMIN' | 'OWNER';
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  location?: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state, action: PayloadAction<LoginPayload>) => {
      state.loading = true;
      state.error = null;
    },
    signupStart: (state, action: PayloadAction<SignupPayload>) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.roles = action.payload.roles;
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.userType = action.payload.userType;
      state.loading = false;
      state.error = null;

      localStorage.setItem('access_token', action.payload.access_token);
      localStorage.setItem('refresh_token', action.payload.refresh_token);
      localStorage.setItem('user_type', action.payload.userType);
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutStart: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      return {...initialState, accessToken: null, refreshToken: null};
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    restoreAuthState: (state) => {
      state.loading = true;
      state.error = null;
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      if (accessToken && refreshToken) {
        state.isAuthenticated = true;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
      }
    },
    clearError: (state) => {
  state.error = null;
},
  },
});

export const {
  signupStart,
  loginStart,
  authSuccess,
  authFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  restoreAuthState,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
