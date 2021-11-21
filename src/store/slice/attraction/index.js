import { createSlice } from '@reduxjs/toolkit';

import * as fetchActions from './actions';

export const {
  fetchAttractionCnt,
  fetchAttraction,
  fetchAttractionById,
  fetchAttractionByCityCnt,
  fetchAttractionByCity,
} = fetchActions;

const initialState = {
  isAttractionLoading: false,
  totalRows: 0,
  attractionList: [],
  attractionInfo: {},
};

export const attractionSlice = createSlice({
  name: 'attraction',
  initialState,
  reducers: {
    setAttractionList: (state, action) => {
      state.attractionList = action.payload;
    },
    setAttractionInfo: (state, action) => {
      state.attractionInfo = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttractionCnt.pending, (state) => {
        state.isAttractionLoading = true;
      })
      .addCase(fetchAttractionCnt.fulfilled, (state, action) => {
        state.isAttractionLoading = false;
        state.totalRows = action.payload.length;
      })
      .addCase(fetchAttraction.pending, (state) => {
        state.isAttractionLoading = true;
      })
      .addCase(fetchAttraction.fulfilled, (state, action) => {
        state.isAttractionLoading = false;
        state.attractionList = action.payload;
      })
      .addCase(fetchAttractionById.pending, (state) => {
        state.isAttractionLoading = true;
      })
      .addCase(fetchAttractionById.fulfilled, (state, action) => {
        state.isAttractionLoading = false;
        state.attractionInfo = action.payload;
      })
      .addCase(fetchAttractionByCityCnt.pending, (state) => {
        state.isAttractionLoading = true;
      })
      .addCase(fetchAttractionByCityCnt.fulfilled, (state, action) => {
        state.isAttractionLoading = false;
        state.totalRows = action.payload.length;
      })
      .addCase(fetchAttractionByCity.pending, (state) => {
        state.isAttractionLoading = true;
      })
      .addCase(fetchAttractionByCity.fulfilled, (state, action) => {
        state.isAttractionLoading = false;
        state.attractionList = action.payload;
      });
  },
});

const { actions, reducer } = attractionSlice;

export const { setAttractionList, setAttractionInfo } = actions;
export const getAttractionState = (state) => state.attraction;
export default reducer;