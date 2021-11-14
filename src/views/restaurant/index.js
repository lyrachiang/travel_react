import React from 'react';
import { Route } from 'react-router-dom';

import List from './list';
import Page from './page';

const Restaurant = () => {
  return (
    <>
      <Route
        path={[
          "/restaurant",
          "/restaurant/attraction/:id",
          "/restaurant/activity/:id"
        ]}
        exact
        component={List}
      />
      <Route path="/restaurant/:id" exact component={Page} />
    </>
  );
};

export default Restaurant;