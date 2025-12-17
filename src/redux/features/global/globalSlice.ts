// globalSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface GlobalState {
  isChartOpened: boolean;
  options: any;
  series:any;
}

const initialState: any = {
  isChartOpened: false,
  options: {},
  series: [],
};

const globalSlice = createSlice({
  name: 'globalstate',
  initialState,
  reducers: {
    setIsChartOpened(state, action: PayloadAction<boolean>) {
      state.isChartOpened = action.payload;
    },
  
  },
});

export const { setIsChartOpened} = globalSlice.actions;
export default globalSlice.reducer;
