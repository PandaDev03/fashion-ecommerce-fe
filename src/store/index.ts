import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';

import { errorMiddleware } from './errorMiddleware';

import { categoryReducer } from '~/features/category/stores/categorySlice';
import { productReducer } from '~/features/products/store/productSlice';
import { userReducer } from '~/features/user/stores/userSlice';
import { brandReducer } from '~/features/brand/store/brandReducer';
import { cartReducer } from '~/features/cart/stores/cartSlice';
import { orderReducer } from '~/features/order/store/orderSlice';

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  brand: brandReducer,
  order: orderReducer,
  product: productReducer,
  category: categoryReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorMiddleware),
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
