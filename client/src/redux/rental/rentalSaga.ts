import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchRentalsStart, fetchRentalsSuccess, fetchRentalsFailure } from './rentalSlice';
import api from '../../api/apiCall';
import {AxiosResponse} from 'axios';


function* fetchRentals() {
  try {
    const response: AxiosResponse = yield call(api.get, `$/rentals`);
    yield put(fetchRentalsSuccess(response.data));
  } catch (error) {
    yield put(fetchRentalsFailure(error.message));
  }
}

export function* watchRentals() {
  yield takeLatest(fetchRentalsStart.type, fetchRentals);
}