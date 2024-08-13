import {call, put, takeLatest} from 'redux-saga/effects';
import {
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
  fetchFilteredOwnersFailure,
} from './adminSlice';
import axios, {AxiosResponse} from 'axios';
import api from '../../api/apiCall';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

function* fetchBooks() {
  try {
    const response: AxiosResponse = yield call(api.get, '/admin/get-all-books');
    yield put(fetchBooksSuccess(response.data));
  } catch (error) {
    yield put(fetchBooksFailure(error));
  }
}

function* deleteBook(action: ReturnType<typeof deleteBookStart>) {
  try {
    yield call(api.delete, `/admin/book/${action.payload}`);
    yield put(deleteBookSuccess(action.payload));
  } catch (error) {
    yield put(deleteBookFailure(error));
  }
}
function* fetchOwners() {
  try {
    const response: AxiosResponse = yield call(api.get, '/admin/get-owners');
    yield put(fetchOwnersSuccess(response.data));
  } catch (error) {
    yield put(fetchOwnersFailure(error.message));
  }
}

function* toggleOwnerStatus(action: ReturnType<typeof toggleOwnerStatusStart>) {
  try {
    yield call(api.patch, `/admin/activate-deactivate-owner/${action.payload}`);
    yield put(toggleOwnerStatusSuccess(action.payload));
  } catch (error) {
    yield put(toggleOwnerStatusFailure(error.message));
  }
}
function* toggleBookStatusSaga(action: ReturnType<typeof toggleBookStatusStart>) {
  try {
    const response: AxiosResponse = yield call(api.patch, `/admin/toggle-book-status/${action.payload}`);
    yield put(toggleBookStatusSuccess(response.data));
  } catch (error) {
    yield put(toggleBookStatusFailure(error.message));
  }
}
function* fetchFilteredOwners(action: ReturnType<typeof fetchFilteredOwnersStart>) {
  try {
    const { search, location } = action.payload;
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (location) queryParams.append('location', location);
    const queryString = queryParams.toString();
    const url = `/admin/filtered-owners${queryString ? `?${queryString}` : ''}`;
    const response: AxiosResponse = yield call(api.get, url);
    yield put(fetchFilteredOwnersSuccess(response.data));
  } catch (error) {
    yield put(fetchFilteredOwnersFailure(error.message));
  }
}

export function* watchAdmin() {
  yield takeLatest(fetchBooksStart.type, fetchBooks);

  yield takeLatest(deleteBookStart.type, deleteBook);
  yield takeLatest(fetchOwnersStart.type, fetchOwners);
  yield takeLatest(toggleOwnerStatusStart.type, toggleOwnerStatus);
  yield takeLatest(toggleBookStatusStart.type, toggleBookStatusSaga);
  yield takeLatest(fetchFilteredOwnersStart.type, fetchFilteredOwners);
}
