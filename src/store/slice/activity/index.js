import { createSlice } from '@reduxjs/toolkit';

import * as fetchActions from './actions';

export const {
  fetchActivityCnt,
  fetchActivity,
  fetchActivityById,
  fetchActivityByCityCnt,
  fetchActivityByCity,
} = fetchActions;

const initialState = {
  isActivityLoading: false,
  totalRows: 0,
  activityList: [],
  activityInfo: {},
};

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setActivityList: (state, action) => {
      state.activityList = action.payload;
    },
    setActivityInfo: (state, action) => {
      state.activityInfo = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityCnt.pending, (state) => {
        state.isActivityLoading = true;
      })
      .addCase(fetchActivityCnt.fulfilled, (state, action) => {
        state.isActivityLoading = false;
        state.totalRows = action.payload.length;
      })
      .addCase(fetchActivity.pending, (state) => {
        state.isActivityLoading = true;
      })
      .addCase(fetchActivity.fulfilled, (state, action) => {
        state.isActivityLoading = false;
        state.activityList = action.payload;
      })
      .addCase(fetchActivityById.pending, (state) => {
        state.isActivityLoading = true;
      })
      .addCase(fetchActivityById.fulfilled, (state, action) => {
        state.isActivityLoading = false;
        state.activityInfo = action.payload;
      })
      .addCase(fetchActivityByCityCnt.pending, (state) => {
        state.isActivityLoading = true;
      })
      .addCase(fetchActivityByCityCnt.fulfilled, (state, action) => {
        state.isActivityLoading = false;
        state.totalRows = action.payload.length;
      })
      .addCase(fetchActivityByCity.pending, (state) => {
        state.isActivityLoading = true;
      })
      .addCase(fetchActivityByCity.fulfilled, (state, action) => {
        state.isActivityLoading = false;
        state.activityList = action.payload;
      });
  },
});

const { actions, reducer } = activitySlice;

export const { setActivityList, setActivityInfo } = actions;
export const getActivityState = (state) => state.activity;
export default reducer;