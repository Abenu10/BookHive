import { createStore, combineReducers } from 'redux';
import bookReducer from './reducers/bookReducer';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({
  books: bookReducer,
  user: userReducer,
});

const store = createStore(rootReducer);

export default store;
