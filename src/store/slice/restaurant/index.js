import { createSlice } from '@reduxjs/toolkit';

import * as fetchActions from './actions';

export const {
  fetchRestaurantCnt,
  fetchRestaurant,
  fetchRestaurantById,
} = fetchActions;

const initialState = {
  isRestaurantLoading: false,
  totalRows: 0,
  restaurantList: [],
  restaurantInfo: {},
};

export const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setRestaurantTotalRows: (state, action) => {
      state.totalRows = action.payload;
    },
    setRestaurantList: (state, action) => {
      state.restaurantList = action.payload;
    },
    setRestaurantInfo: (state, action) => {
      state.restaurantInfo = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantCnt.fulfilled, (state, action) => {
        state.isRestaurantLoading = true;
        state.totalRows = action.payload.length;
      })
      .addCase(fetchRestaurant.fulfilled, (state, action) => {
        state.isRestaurantLoading = true;
        state.restaurantList = action.payload;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.isRestaurantLoading = true;
        state.restaurantInfo = action.payload;
      });
  },
});

const { actions, reducer } = restaurantSlice;

export const { setRestaurantTotalRows, setRestaurantList, setRestaurantInfo } = actions;
export const getRestaurantState = (state) => state.restaurant;
export default reducer;