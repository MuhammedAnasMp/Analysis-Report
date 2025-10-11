// globalSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface GlobalState {
  isOpened: boolean;
}

const initialState: GlobalState = {
  isOpened: false,
};

const globalSlice = createSlice({
  name: 'globalstate',
  initialState,
  reducers: {
    setIsOpened(state, action: PayloadAction<boolean>) {
      state.isOpened = action.payload;
    },
  },
});

export const { setIsOpened } = globalSlice.actions;
export default globalSlice.reducer;
