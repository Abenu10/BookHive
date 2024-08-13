import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';

import authReducer from './auth/authSlice';
import adminReducer from './admin/adminSlice';
import ownerReducer from './owner/ownerSlice';
import categoryReducer from './category/categorySlice';
import userReducer from './user/userSlice';
import rentalReducer from './rental/rentalSlice';
// import bookReducer from './book/bookSlice';
// import ownerReducer from './owner/ownerSlice';
// import categoryReducer from './category/categorySlice';
// import rentalReducer from './rental/rentalSlice';
// import walletReducer from './wallet/walletSlice';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    owner: ownerReducer,
    category: categoryReducer,
    user: userReducer,
    rental: rentalReducer,
    // book: bookReducer,
    // rental: rentalReducer,
    // wallet: walletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['owner/createBookStart'],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
