import {call, put, takeLatest} from 'redux-saga/effects';
import {
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
  fetchFilteredBooksSuccess,
  fetchFilteredBooksFailure,
  fetchFilteredBooksStart,
} from './ownerSlice';
import api from '../../api/apiCall';
import axios, {AxiosResponse} from 'axios';

function* fetchBooks() {
  try {
    const response: AxiosResponse = yield call(api.get, '/owners/book');
    yield put(fetchBooksSuccess(response.data));
  } catch (error) {
    yield put(fetchBooksFailure(error));
  }
}
function* fetchFilteredBooks(action: ReturnType<typeof fetchFilteredBooksStart>) {
  try {
    const response: AxiosResponse = yield call(api.get, '/owners/filtered-books', {
      params: action.payload,
    });
    yield put(fetchFilteredBooksSuccess(response.data));
  } catch (error) {
    yield put(fetchFilteredBooksFailure(error.message));
  }
}

function* createBook(action: ReturnType<typeof createBookStart>) {
  try {
    const {coverImage, ...bookData} = action.payload;
    const formData = new FormData();

    // Append book data to FormData
    Object.entries(bookData).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    // Append the cover image file
    formData.append('coverImage', coverImage);

    const response: AxiosResponse = yield call(
      api.post,
      '/owners/create-book',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    yield put(createBookSuccess(response.data.book));
  } catch (error) {
    if (error instanceof Error) {
      yield put(createBookFailure(error.message));
    } else {
      yield put(createBookFailure('An unknown error occurred'));
    }
  }
}

function* updateBook(action: ReturnType<typeof updateBookStart>) {
  try {
    const {id, bookData} = action.payload;
    const formData = new FormData();

    // Append book data to FormData
    Object.entries(bookData).forEach(([key, value]) => {
      if (key === 'coverImage' && value instanceof File) {
        formData.append('coverImage', value);
      } else {
        formData.append(key, value.toString());
      }
    });

    const response: AxiosResponse = yield call(
      api.patch,
      `/owners/update-book/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    yield put(updateBookSuccess(response.data.book));
  } catch (error) {
    if (error instanceof Error) {
      yield put(updateBookFailure(error.message));
    } else {
      yield put(updateBookFailure('An unknown error occurred'));
    }
  }
}

function* deleteBook(action: ReturnType<typeof deleteBookStart>) {
  try {
    yield call(api.delete, `/owners/book/${action.payload}`);
    yield put(deleteBookSuccess(action.payload));
  } catch (error) {
    yield put(deleteBookFailure(error));
  }
}

export function* watchOwner() {
  yield takeLatest(fetchBooksStart.type, fetchBooks);
  yield takeLatest(createBookStart.type, createBook);
  yield takeLatest(updateBookStart.type, updateBook);
  yield takeLatest(deleteBookStart.type, deleteBook);
  yield takeLatest(fetchFilteredBooksStart.type, fetchFilteredBooks);
}
