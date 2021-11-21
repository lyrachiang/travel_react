import { createSlice } from '@reduxjs/toolkit';

import * as fetchActions from './actions';

export const {
  fetchHotelCnt,
  fetchHotel,
  fetchHotelById,
} = fetchActions;

const initialState = {
  isHotelLoading: false,
  totalRows: 0,
  hotelList: [],
  hotelInfo: {},
};

export const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    setHotelTotalRows: (state, action) => {
      state.totalRows = action.payload;
    },
    setHotelList: (state, action) => {
      state.hotelList = action.payload;
    },
    setHotelInfo: (state, action) => {
      state.hotelInfo = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotelCnt.pending, (state) => {
        state.isHotelLoading = true;
      })
      .addCase(fetchHotelCnt.fulfilled, (state, action) => {
        state.isHotelLoading = false;
        state.totalRows = action.payload.length;
      })
      .addCase(fetchHotel.pending, (state) => {
        state.isHotelLoading = true;
      })
      .addCase(fetchHotel.fulfilled, (state, action) => {
        state.isHotelLoading = false;
        state.hotelList = action.payload;
      })
      .addCase(fetchHotelById.pending, (state) => {
        state.isHotelLoading = true;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.isHotelLoading = false;
        state.hotelInfo = action.payload;
      });
  },
});

const { actions, reducer } = hotelSlice;

export const { setHotelTotalRows, setHotelList, setHotelInfo } = actions;
export const getHotelState = (state) => state.hotel;
export default reducer;