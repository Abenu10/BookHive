import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FormData} from 'form-data';
interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  status: 'PENDING' | 'APPROVED' | 'DISABLED';
  price: number;
  quantity: number;
  coverImage?: File | string;
}

interface CreateBookPayload {
  title: string;
  author: string;
  category: number;
  quantity: number;
  price: number;
  availableQuantity: number;
  description: string;
  coverImage: File | null;
}

interface OwnerState {
  books: Book[];
  loading: boolean;
  error: string | null;
  newBookId: number | null;
  successMessage: string | null;
}
const initialState: OwnerState = {
  books: [],
  loading: false,
  error: null,
  newBookId: null,
  successMessage: null,
};

const ownerSlice = createSlice({
  name: 'owner',
  initialState,
  reducers: {
    fetchBooksStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBooksSuccess(state, action: PayloadAction<Book[]>) {
      state.books = action.payload;
      state.loading = false;
    },
    fetchBooksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createBookStart(state, action: PayloadAction<CreateBookPayload>) {
      state.loading = true;
      state.error = null;
    },
    createBookSuccess(state, action: PayloadAction<CreateBookPayload>) {
      state.books.push(action.payload);
      state.loading = false;
      state.successMessage = 'Book successfully uploaded!';
    },
    createBookFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    updateBookStart(
      state,
      action: PayloadAction<{id: number; bookData: Partial<Book>}>
    ) {
      state.loading = true;
      state.error = null;
    },
    updateBookSuccess(state, action: PayloadAction<Book>) {
      const index = state.books.findIndex(
        (book) => book.id === action.payload.id
      );
      if (index !== -1) {
        state.books[index] = action.payload;
      }
      state.loading = false;
    },
    updateBookFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteBookStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteBookSuccess(state, action: PayloadAction<number>) {
      state.books = state.books.filter((book) => book.id !== action.payload);
      state.loading = false;
    },
    deleteBookFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchFilteredBooksStart(state, action: PayloadAction<any>) {
      state.loading = true;
      state.error = null;
    },
    fetchFilteredBooksSuccess(state, action: PayloadAction<Book[]>) {
      state.books = action.payload;
      state.loading = false;
    },
    fetchFilteredBooksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchBooksStart,
  fetchBooksSuccess,
  fetchBooksFailure,
  createBookStart,
  createBookSuccess,
  createBookFailure,
  updateBookStart,
  updateBookSuccess,
  updateBookFailure,
  deleteBookStart,
  deleteBookSuccess,
  deleteBookFailure,
  clearSuccessMessage,
  fetchFilteredBooksStart,
  fetchFilteredBooksSuccess,
  fetchFilteredBooksFailure,
} = ownerSlice.actions;

export default ownerSlice.reducer;
