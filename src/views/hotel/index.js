import React from 'react';
import { Route } from 'react-router-dom';

import List from './list';
import Page from './page';

const Hotel = () => {
  return (
    <>
      <Route
        path={[
          "/hotel",
          "/hotel/attraction/:id",
          "/hotel/activity/:id",
        ]}
        exact
        component={List}
      />
      <Route path="/hotel/:id" exact component={Page} />
    </>
  );
};

export default Hotel;