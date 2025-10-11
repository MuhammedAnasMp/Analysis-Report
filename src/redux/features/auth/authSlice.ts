import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from './types';


const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  otherData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.otherData = null;
    },
    setOtherData(state, action: PayloadAction<string>) {
      state.otherData = action.payload;
    },
  },
});

export const { login, logout, setOtherData } = authSlice.actions;
export default authSlice.reducer;
