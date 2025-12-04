// storeSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Locations {
  LOCATION_ID: number;
  LOCATION_NAME: string;
}
export interface UserDetails {
  username: string;
  id:string | null;
}
export interface StoreState {
  selectedStore: Locations | null;
  selectedDate: Date | null;
  userDetails: UserDetails | null;
}



const initialState: StoreState = {
  selectedStore: null,
  selectedDate: null,
  userDetails:null
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
    setUserDetails(state, action: PayloadAction<UserDetails | null>) {
      state.userDetails = action.payload;
    },
    resetStoreState(state) {
      state.selectedStore = null;
      state.selectedDate = null;
      state.userDetails= null;
    },
  },
});

export const { setSelectedStore, setSelectedDate, setUserDetails, resetStoreState } = storeSlice.actions;
export default storeSlice.reducer;
