import { createReducer } from '@reduxjs/toolkit';
import { fetchBooks, addBook, removeBook } from '../actions/bookActions';

const initialState = {
  books: [],
};

const bookReducer = createReducer(initialState, {
  [fetchBooks]: (state, action) => {
    state.books = action.payload;
  },
  [addBook]: (state, action) => {
    state.books.push(action.payload);
  },
  [removeBook]: (state, action) => {
    state.books = state.books.filter((book) => book.id !== action.payload);
  },
});

export default bookReducer;
