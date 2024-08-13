import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RentalState {
  rentals: any[];
  loading: boolean;
  error: string | null;
}

const initialState: RentalState = {
  rentals: [],
  loading: false,
  error: null,
};

const rentalSlice = createSlice({
  name: 'rental',
  initialState,
  reducers: {
    fetchRentalsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRentalsSuccess: (state, action: PayloadAction<any[]>) => {
      state.rentals = action.payload;
      state.loading = false;
    },
    fetchRentalsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchRentalsStart, fetchRentalsSuccess, fetchRentalsFailure } = rentalSlice.actions;

export default rentalSlice.reducer;