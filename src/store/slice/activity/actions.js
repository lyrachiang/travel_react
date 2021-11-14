import { createAsyncThunk } from '@reduxjs/toolkit';

import Api from '../../../helpers/api';

const getActivityCnt = async (request, thunkAPI) => {
  const { s_date, e_date, position = {} } = request;
  const { lat, lon } = position;

  let filter = [];
  let spatialFilter = '';

  if (s_date) {
    filter.push(`date(StartTime) ge ${s_date}`);
  }

  if (e_date) {
    filter.push(`date(EndTime) le ${e_date}`);
  }

  if (lat && lon) {
    spatialFilter = `nearby(${lat}, ${lon}, 3000)`
  }

  const query = {
    $filter: filter.join(' and '),
    $spatialFilter: spatialFilter || '',
    $top: 1000,
  };

  const response = await Api.get('/Tourism/Activity', query)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw thunkAPI.rejectWithValue(err.response.data);
    });

  return response;
};

const getActivity = async (request, thunkAPI) => {
  const { id, s_date, e_date, fields, sort, offset, limit, position = {} } = request;
  const { lat, lon } = position;
  
  let filter = [];
  let spatialFilter = '';

  if (id) {
    filter.push(`ID eq '${id}'`);
  }

  if (s_date) {
    filter.push(`date(StartTime) ge ${s_date}`);
  }

  if (e_date) {
    filter.push(`date(EndTime) le ${e_date}`);
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

  const response = await Api.get('/Tourism/Activity', query)
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

const getActivityByCityCnt = async (request, thunkAPI) => {
  const { city, s_date, e_date, position = {} } = request;
  const { lat, lon } = position;

  let filter = [];
  let spatialFilter = '';

  if (s_date) {
    filter.push(`date(StartTime) ge ${s_date}`);
  }

  if (e_date) {
    filter.push(`date(EndTime) le ${e_date}`);
  }

  if (lat && lon) {
    spatialFilter = `nearby(${lat}, ${lon}, 3000)`
  }

  const query = {
    $filter: filter.join(' and '),
    $spatialFilter: spatialFilter || '',
    $top: 1000,
  };

  const response = await Api.get(`/Tourism/Activity/${city}`, query)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw thunkAPI.rejectWithValue(err.response.data);
    });

  return response;
};

const getActivityByCity = async (request, thunkAPI) => {
  const { city, id, s_date, e_date, fields, sort, offset, limit, position = {} } = request;
  const { lat, lon } = position;

  let filter = [];
  let spatialFilter = '';

  if (id) {
    filter.push(`ID eq '${id}'`);
  }

  if (s_date) {
    filter.push(`date(StartTime) ge ${s_date}`);
  }

  if (e_date) {
    filter.push(`date(EndTime) le ${e_date}`);
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

  const response = await Api.get(`/Tourism/Activity/${city}`, query)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw thunkAPI.rejectWithValue(err.response.data);
    });

  return response;
};

export const fetchActivityCnt = createAsyncThunk(
  'activity/fetchActivityCnt',
  getActivityCnt
);

export const fetchActivity = createAsyncThunk(
  'activity/fetchActivity',
  getActivity
);

export const fetchActivityById = createAsyncThunk(
  'activity/fetchActivityById',
  getActivity
);

export const fetchActivityByCityCnt = createAsyncThunk(
  'activity/fetchActivityByCityCnt',
  getActivityByCityCnt
);

export const fetchActivityByCity = createAsyncThunk(
  'activity/fetchActivityByCity',
  getActivityByCity
);