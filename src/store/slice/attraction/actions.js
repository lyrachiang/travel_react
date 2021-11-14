import { createAsyncThunk } from '@reduxjs/toolkit';

import Api from '../../../helpers/api';

const getAttractionCnt = async (request, thunkAPI) => {
  const { position = {} } = request;
  const { lat, lon } = position;

  let spatialFilter = '';

  if (lat && lon) {
    spatialFilter = `nearby(${lat}, ${lon}, 3000)`
  }

  const query = {
    $spatialFilter: spatialFilter || '',
    $top: 1000,
  };

  const response = await Api.get('/Tourism/ScenicSpot', query)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw thunkAPI.rejectWithValue(err.response.data);
    });

  return response;
};

const getAttraction = async (request, thunkAPI) => {
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

  const response = await Api.get('/Tourism/ScenicSpot', query)
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

const getAttractionByCityCnt = async (request, thunkAPI) => {
  const { city, position = {} } = request;
  const { lat, lon } = position;

  let filter = [];
  let spatialFilter = '';

  if (lat && lon) {
    spatialFilter = `nearby(${lat}, ${lon}, 3000)`
  }

  const query = {
    $filter: filter.join(' and '),
    $spatialFilter: spatialFilter || '',
    $top: 1000,
  };

  const response = await Api.get(`/Tourism/ScenicSpot/${city}`, query)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw thunkAPI.rejectWithValue(err.response.data);
    });

  return response;
};

const getAttractionByCity = async (request, thunkAPI) => {
  const { city, id, fields, sort, offset, limit, position = {} } = request;
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
    $orderby: sort || 'UpdateTime',
    $top: limit || 10,
    $skip: offset || 0,
    $spatialFilter: spatialFilter || '',
  };

  const response = await Api.get(`/Tourism/ScenicSpot/${city}`, query)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw thunkAPI.rejectWithValue(err.response.data);
    });

  return response;
};

export const fetchAttractionCnt = createAsyncThunk(
  'activity/fetchAttractionCnt',
  getAttractionCnt
);

export const fetchAttraction = createAsyncThunk(
  'activity/fetchAttraction',
  getAttraction
);

export const fetchAttractionById = createAsyncThunk(
  'activity/fetchAttractionById',
  getAttraction
);

export const fetchAttractionByCityCnt = createAsyncThunk(
  'activity/fetchAttractionByCityCnt',
  getAttractionByCityCnt
);

export const fetchAttractionByCity = createAsyncThunk(
  'activity/fetchAttractionByCity',
  getAttractionByCity
);