import {call, put, takeLatest} from 'redux-saga/effects';
import {
  loginStart,
  signupStart,
  authSuccess,
  authFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  restoreAuthState,
} from './authSlice';
import axios, {AxiosResponse} from 'axios';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

function* handleLogin(action) {
  
  try {
    const {userType, email, password} = action.payload;
    let endpoint;
    switch (userType) {
      case 'USER':
        endpoint = `${VITE_BASE_URL}/users/login`;
        break;
      case 'ADMIN':
        endpoint = `${VITE_BASE_URL}/admin/login`;
        break;
      case 'OWNER':
        endpoint = `${VITE_BASE_URL}/owners/login`;
        break;
      default:
        throw new Error('Invalid user type');
    }

    const response: AxiosResponse = yield call(axios.post, endpoint, {
      email,
      password,
    });
    const {access_token, refresh_token, user, roles} = response.data;
    yield put(
      authSuccess({access_token, refresh_token, user, roles, userType})
    );
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user_type', userType);
  } catch (error) {
    yield put(authFailure(error.response?.data?.message || 'Login failed'));
  }
}

function* handleSignup(action) {
  try {
    const {userType, email, password, name, phoneNumber, location} =
      action.payload;
    let endpoint;
    switch (userType) {
      case 'USER':
        endpoint = `${VITE_BASE_URL}/users/register`;
        break;
      case 'ADMIN':
        endpoint = `${VITE_BASE_URL}/admin/register`;
        break;
      case 'OWNER':
        endpoint = `${VITE_BASE_URL}/owners/register`;
        break;
      default:
        throw new Error('Invalid user type');
    }

    const response: AxiosResponse = yield call(axios.post, endpoint, {
      // ^?
      email,
      password,
      name,
      phoneNumber,
      location,
    });
    const {access_token, refresh_token, user, roles} = response.data;
    yield put(
      authSuccess({access_token, refresh_token, user, roles, userType})
    );
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user_type', userType);
  } catch (error) {
    yield put(authFailure(error.response?.data?.message || 'Signup failed'));
  }
}

function* handleLogout() {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
    yield put(logoutSuccess());
  } catch (error: any) {
    yield put(logoutFailure('Logout failed'));
  }
}

function* handleRestoreAuthState() {
  const accessToken = localStorage.getItem('access_token');
  const userType = localStorage.getItem('user_type');
  if (accessToken && userType) {
    try {
      const response: AxiosResponse = yield call(
        axios.get,
        `${VITE_BASE_URL}/auth/me`,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );
      const {user, roles} = response.data;
      yield put(
        authSuccess({
          access_token: accessToken,
          refresh_token: localStorage.getItem('refresh_token'),
          user,
          roles,
          userType,
        })
      );
    } catch (error: any) {
      console.error('Error restoring auth state:', error);
      yield put(
        authFailure(
          error.response?.data?.message || 'Failed to restore auth state'
        )
      );
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_type');
    }
  } else {
    yield put(authFailure('No stored authentication data'));
  }
}

export function* watchAuth() {
  yield takeLatest(loginStart.type, handleLogin);
  yield takeLatest(signupStart.type, handleSignup);
  yield takeLatest(logoutStart.type, handleLogout);
  yield takeLatest(restoreAuthState.type, handleRestoreAuthState);
}
