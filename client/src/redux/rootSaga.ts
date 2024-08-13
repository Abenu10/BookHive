import {all} from 'redux-saga/effects';
import {watchAuth} from './auth/authSaga';
import {watchAdmin} from './admin/adminSaga';
import { watchOwner } from './owner/ownerSaga';
import { watchCategory } from './category/categorySaga';
import { watchUser } from './user/userSaga';
import { watchRentals } from './rental/rentalSaga';
// import {watchFetchUserDetails} from './user/userSaga';
// import {
//   watchFetchBooks,
//   watchCreateBook,
//   watchUpdateBook,
// } from './book/bookSaga';
// import {watchActivateOwner} from './owner/ownerSaga';
// import {watchApproveBook, watchCreateCategory} from './admin/adminSaga';
// import {watchFetchCategories} from './category/categorySaga';
// import {watchCreateRental, watchUpdateRentalStatus} from './rental/rentalSaga';
// import {watchUpdateWalletBalance} from './wallet/walletSaga';

export default function* rootSaga() {
  yield all([
    watchAuth(),
    watchAdmin(),
    watchOwner(),
    watchCategory(),
    watchUser(),
    watchRentals(),
    // watchFetchUserDetails(),
    // watchFetchBooks(),
    // watchCreateBook(),
    // watchUpdateBook(),
    // watchActivateOwner(),
    // watchApproveBook(),
    // watchCreateCategory(),
    // watchFetchCategories(),
    // watchCreateRental(),
    // watchUpdateRentalStatus(),
    // watchUpdateWalletBalance(),
  ]);
}
