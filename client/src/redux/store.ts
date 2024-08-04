import {configureStore} from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import bookReducer from './reducers/bookReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    users: userReducer,
  },
});

export default store;
