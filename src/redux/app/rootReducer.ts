import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import globalSlice from '../features/global/globalSlice';


const rootReducer = combineReducers({
  auth: authReducer,
  global: globalSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
