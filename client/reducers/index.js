import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import bookReducer from './bookReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  books: bookReducer,
});

export default rootReducer;
