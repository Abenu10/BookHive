import { createReducer } from '@reduxjs/toolkit';
import { login, logout } from '../actions/authActions';

const initialState = {
  token: null,
  user: null,
};

const authReducer = createReducer(initialState, {
  [login]: (state, action) => {
    state.token = action.payload.token;
    state.user = action.payload.user;
  },
  [logout]: (state) => {
    state.token = null;
    state.user = null;
  },
});

export default authReducer;
