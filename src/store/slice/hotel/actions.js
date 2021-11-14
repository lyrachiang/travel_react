import { createAsyncThunk } from '@reduxjs/toolkit';

import Api from '../../../helpers/api';

const getHotelCnt = async (request, thunkAPI) => {
  const { position = {} } = request;
  const { lat, lon } = position;

  let spatialFilter = '';

  if (lat && lon) {
    spatialFilter = `nearby(${lat}, ${lon}, 3000)`
  }

  const query = {
    $spatialFilter: spatialFilter || '',
  };

  const response = await Api.get('/Tourism/Hotel', query)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw thunkAPI.rejectWithValue(err.response.data);
    });

  return response;
};

const getHotel = async (request, thunkAPI) => {
  const { id, fields, sort, offset, limit, position = {} } = request;
  const { lat, lon } = position;
  
  let filter = [];
  let spatialFilter = '';

  if (id) {
    filter.push(`ID eq '${id}'`);
  }

  if (lat && lon) {
    spatialFilter = `nearby(${lat}, ${lon}, 3000)`
  }

  const query = {
    $select: fields || '',
    $filter: filter.join(' and '),
    $orderby: sort || '',
    $top: limit || '',
    $skip: offset || '',
    $spatialFilter: spatialFilter || '',
  };

  const response = await Api.get('/Tourism/Hotel', query)
    .then((res) => {
      if (id) {
        return res.data[0];
      }

      return res.data;
    })
    .catch((err) => {
      throw thunkAPI.rejectWithValue(err.response.data);
    });

  return response;
};

export const fetchHotelCnt = createAsyncThunk(
  'hotel/fetchHotelCnt',
  getHotelCnt
);

export const fetchHotel = createAsyncThunk(
  'hotel/fetchHotel',
  getHotel
);

export const fetchHotelById = createAsyncThunk(
  'hotel/fetchHotelById',
  getHotel
);