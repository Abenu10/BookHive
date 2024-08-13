import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  category: string;
  availableQuantity: number;
  price: number;
  rating: number;
  reviewCount: number;
  ownerName: string;
  ownerLocation: string;
}

interface Category {
  id: number;
  name: string;
}

interface UserState {
  availableBooks: Book[];
  categories: Category[];
  selectedBook: Book | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  userRentals: any[];
  isBookRented: boolean;
}

const initialState: UserState = {
  availableBooks: [],
  categories: [],
  selectedBook: null,
  loading: false,
  error: null,
  successMessage: null,
  userRentals: [],
  isBookRented: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchAvailableBooksStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAvailableBooksSuccess(state, action: PayloadAction<Book[]>) {
      state.availableBooks = action.payload;
      state.loading = false;
    },
    fetchAvailableBooksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCategoriesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
      state.loading = false;
    },
    fetchCategoriesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchBooksByCategoryStart(state, action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    fetchBooksByCategorySuccess(state, action: PayloadAction<Book[]>) {
      state.availableBooks = action.payload;
      state.loading = false;
    },
    fetchBooksByCategoryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
   fetchBookDetailStart(state) {
  state.loading = true;
  state.error = null;
},
fetchBookDetailSuccess(state, action: PayloadAction<Book>) {
  state.selectedBook = action.payload;
  state.loading = false;
},
fetchBookDetailFailure(state, action: PayloadAction<string>) {
  state.loading = false;
  state.error = action.payload;
},
createRentalStart: (state, action: PayloadAction<{ bookId: number }>) => {
  state.loading = true;
  state.error = null;
},
createRentalSuccess: (state, action: PayloadAction<any>) => {
  state.loading = false;
  state.successMessage = 'Book rented successfully';
},
createRentalFailure: (state, action: PayloadAction<string>) => {
  state.loading = false;
  state.error = action.payload;
},
fetchUserRentalsStart: (state) => {
  state.loading = true;
  state.error = null;
},
fetchUserRentalsSuccess: (state, action: PayloadAction<any[]>) => {
  state.userRentals = action.payload;
  state.loading = false;
},
fetchUserRentalsFailure: (state, action: PayloadAction<string>) => {
  state.loading = false;
  state.error = action.payload;
},
setIsBookRented: (state, action: PayloadAction<boolean>) => {
  state.isBookRented = action.payload;
},
toggleRentalStatusStart: (state, action: PayloadAction<{ bookId: number }>) => {
  state.loading = true;
  state.error = null;
},
toggleRentalStatusSuccess: (state, action: PayloadAction<boolean>) => {
  state.loading = false;
  state.isBookRented = action.payload;
  state.successMessage = action.payload ? 'Book rented successfully' : 'Book returned successfully';
},
toggleRentalStatusFailure: (state, action: PayloadAction<string>) => {
  state.loading = false;
  state.error = action.payload;
},
  },

});

export const {
  fetchAvailableBooksStart,
  fetchAvailableBooksSuccess,
  fetchAvailableBooksFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchBooksByCategoryStart,
  fetchBooksByCategorySuccess,
  fetchBooksByCategoryFailure,
  fetchBookDetailStart,
  fetchBookDetailSuccess,
  fetchBookDetailFailure,
  createRentalStart,
  createRentalSuccess,
  createRentalFailure,
  fetchUserRentalsStart,
  fetchUserRentalsSuccess,
  fetchUserRentalsFailure,
  setIsBookRented,
  toggleRentalStatusStart,
  toggleRentalStatusSuccess,
  toggleRentalStatusFailure
} = userSlice.actions;

export default userSlice.reducer;
