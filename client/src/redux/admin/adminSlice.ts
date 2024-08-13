import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  status: 'PENDING' | 'APPROVED';
  owner: {
    id: string;
    name: string;
  };
}

interface Owner {
  id: string;
  email: string;
  name: string;
  phoneNumber: string | null;
  location: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface AdminState {
  books: Book[];
  owners: Owner[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  books: [],
  owners: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
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
    toggleBookStatusStart(state, action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    toggleBookStatusSuccess(
      state,
      action: PayloadAction<{bookId: number; status: 'APPROVED' | 'PENDING'}>
    ) {
      state.loading = false;
      const book = state.books.find((b) => b.id === action.payload.bookId);
      if (book) {
        book.status = action.payload.status;
      }
    },
    toggleBookStatusFailure(state, action: PayloadAction<string>) {
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
    fetchOwnersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchOwnersSuccess(state, action: PayloadAction<Owner[]>) {
      state.owners = action.payload;
      state.loading = false;
    },
    fetchOwnersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    toggleOwnerStatusStart(state) {
      state.loading = true;
      state.error = null;
    },
    toggleOwnerStatusSuccess(state, action: PayloadAction<string>) {
      const owner = state.owners.find((o) => o.id === action.payload);
      if (owner) {
        owner.status = owner.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      }
      state.loading = false;
    },
    toggleOwnerStatusFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchFilteredOwnersStart(state, action: PayloadAction<{ search?: string, location?: string }>) {
  state.loading = true;
  state.error = null;
},
fetchFilteredOwnersSuccess(state, action: PayloadAction<Owner[]>) {
  state.owners = action.payload;
  state.loading = false;
},
fetchFilteredOwnersFailure(state, action: PayloadAction<string>) {
  state.loading = false;
  state.error = action.payload;
},
  },
});

export const {
  fetchBooksStart,
  fetchBooksSuccess,
  fetchBooksFailure,

  deleteBookStart,
  deleteBookSuccess,
  deleteBookFailure,
  fetchOwnersStart,
  fetchOwnersSuccess,
  fetchOwnersFailure,
  toggleOwnerStatusStart,
  toggleOwnerStatusSuccess,
  toggleOwnerStatusFailure,
  toggleBookStatusStart,
  toggleBookStatusSuccess,
  toggleBookStatusFailure,
fetchFilteredOwnersStart,
fetchFilteredOwnersSuccess,
fetchFilteredOwnersFailure  
} = adminSlice.actions;

export default adminSlice.reducer;
