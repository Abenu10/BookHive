import {call, put, takeLatest} from 'redux-saga/effects';
import {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
} from './categorySlice';
import api from '../../api/apiCall';
import {AxiosResponse} from 'axios';

function* fetchCategories() {
  try {
    const response: AxiosResponse = yield call(api.get, '/owners/category/all');
    yield put(fetchCategoriesSuccess(response.data));
  } catch (error) {
    yield put(fetchCategoriesFailure(error));
  }
}

export function* watchCategory() {
  yield takeLatest(fetchCategoriesStart.type, fetchCategories);
}
