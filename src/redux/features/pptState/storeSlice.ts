// storeSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Locations {
  LOCATION_ID: number;
  LOCATION_NAME: string;
}

export interface StoreState {
  selectedStore: Locations | null;
  selectedDate: Date | null;
}

const initialState: StoreState = {
  selectedStore: null,
  selectedDate: null,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setSelectedStore(state, action: PayloadAction<Locations | null>) {
      state.selectedStore = action.payload;
    },
    setSelectedDate(state, action: PayloadAction<Date | null>) {
      state.selectedDate = action.payload;
    },
    resetStoreState(state) {
      state.selectedStore = null;
      state.selectedDate = null;
    },
  },
});

export const { setSelectedStore, setSelectedDate, resetStoreState } = storeSlice.actions;
export default storeSlice.reducer;
