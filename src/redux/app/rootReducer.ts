import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import storeSlice from '../features/pptState/storeSlice';
import globalSlice from '../features/global/globalSlice';


const rootReducer = combineReducers({
  auth: authReducer,
  global: globalSlice,
  store: storeSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
