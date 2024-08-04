import { createAction } from '@reduxjs/toolkit';

export const fetchBooks = createAction('books/fetch', (books) => {
  return { payload: books };
});

export const addBook = createAction('books/add', (book) => {
  return { payload: book };
});

export const removeBook = createAction('books/remove', (id) => {
  return { payload: id };
});
