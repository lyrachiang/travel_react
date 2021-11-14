import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  back: '',
  filter: '',
};

export const attractionSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.back = action.payload.back;
      state.filter = action.payload.filter;
    }
  },
  extraReducers: (builder) => {
  },
});

const { actions, reducer } = attractionSlice;

export const { setFilter } = actions;
export const getFilter = (state) => state.filter;
export default reducer;