import { configureStore } from '@reduxjs/toolkit';

import activityReducer from './slice/activity';
import hotelReducer from './slice/hotel';
import restaurantReducer from './slice/restaurant';
import attractionReducer from './slice/attraction';
import filterReducer from './slice/filter';

export const store = configureStore({
  reducer: {
    activity: activityReducer,
    hotel: hotelReducer,
    restaurant: restaurantReducer,
    attraction: attractionReducer,
    filter: filterReducer,
  },
});
