import {call, put, select, takeLatest} from 'redux-saga/effects';
import {
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
  fetchUserRentalsSuccess,
  fetchUserRentalsFailure,
  setIsBookRented,
  fetchUserRentalsStart,
  toggleRentalStatusSuccess,
  toggleRentalStatusFailure,
  toggleRentalStatusStart
} from './userSlice';
import api from '../../api/apiCall';
import {AxiosResponse} from 'axios';
import { RootState } from '../store';

function* fetchAvailableBooks() {
  try {
    const response: AxiosResponse = yield call(
      api.get,
      '/users/books/available'
    );
    yield put(fetchAvailableBooksSuccess(response.data));
  } catch (error) {
    yield put(fetchAvailableBooksFailure(error.message));
  }
}

function* fetchCategories() {
  try {
    const response: AxiosResponse = yield call(
      api.get,
      '/users/books/category/all'
    );
    yield put(fetchCategoriesSuccess(response.data));
  } catch (error) {
    yield put(fetchCategoriesFailure(error.message));
  }
}

function* fetchBooksByCategory(
  action: ReturnType<typeof fetchBooksByCategoryStart>
) {
  try {
    const response: AxiosResponse = yield call(
      api.get,
      `/users/books/${action.payload}`
    );
    yield put(fetchBooksByCategorySuccess(response.data));
  } catch (error) {
    yield put(fetchBooksByCategoryFailure(error.message));
  }
}
function* fetchBookDetail(action: ReturnType<typeof fetchBookDetailStart>) {
  try {
    const response: AxiosResponse = yield call(
      api.get,
      `/users/book/${action.payload}`
    );
    yield put(fetchBookDetailSuccess(response.data));
  } catch (error) {
    yield put(fetchBookDetailFailure(error.message));
  }
}

function* createRental(action: ReturnType<typeof createRentalStart>) {
  try {
    const userId: AxiosResponse = yield select((state: RootState) => state.auth.user?.id);
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const response: AxiosResponse = yield call(api.post, '/rentals/new-rental', {
      bookId: action.payload.bookId,
      userId: userId,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    });
    yield put(createRentalSuccess(response.data));
  } catch (error) {
    yield put(createRentalFailure(error.response?.data?.error || 'Error creating rental'));
  }
}
function* fetchUserRentals() {
  try {
    const userId: string = yield select((state: RootState) => state.auth.user?.id);
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const response: AxiosResponse = yield call(api.get, `/rentals/${userId}/rentals`);
    yield put(fetchUserRentalsSuccess(response.data));
  } catch (error) {
    yield put(fetchUserRentalsFailure(error.response?.data?.error || 'Error fetching user rentals'));
  }
}

function* checkIfBookRented(action: ReturnType<typeof fetchBookDetailStart>) {
  try {
    const userId: string = yield select((state: RootState) => state.auth.user?.id);
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const response: AxiosResponse = yield call(api.get, `/rentals/${userId}/book/${action.payload}/rented`);
    yield put(setIsBookRented(response.data.isRented));
  } catch (error) {
    console.error('Error checking if book is rented:', error);
  }
}
function* toggleRentalStatus(action: ReturnType<typeof toggleRentalStatusStart>) {
  try {
    const userId: string = yield select((state: RootState) => state.auth.user?.id);
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const response: AxiosResponse = yield call(api.post, `/rentals/${userId}/book/${action.payload.bookId}/toggle`);
    yield put(toggleRentalStatusSuccess(response.data.isRented));
    yield put(fetchBookDetailStart(action.payload.bookId));
  } catch (error) {
    yield put(toggleRentalStatusFailure(error.response?.data?.error || 'Error toggling rental status'));
  }
}



export function* watchUser() {
  yield takeLatest(fetchAvailableBooksStart.type, fetchAvailableBooks);
  yield takeLatest(fetchCategoriesStart.type, fetchCategories);
  yield takeLatest(fetchBooksByCategoryStart.type, fetchBooksByCategory);
  yield takeLatest(fetchBookDetailStart.type, fetchBookDetail);
  yield takeLatest(createRentalStart.type, createRental);
  yield takeLatest(fetchUserRentalsStart.type, fetchUserRentals);
yield takeLatest(fetchBookDetailStart.type, checkIfBookRented);
yield takeLatest(toggleRentalStatusStart.type, toggleRentalStatus);
}
