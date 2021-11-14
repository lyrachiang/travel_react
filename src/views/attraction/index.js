import React from 'react';
import { Route } from 'react-router-dom';

import List from './list';
import Page from './page';

const Attraction = () => {
  return (
    <>
      <Route path="/attraction" exact component={List} />
      <Route path="/attraction/:id" component={Page} />
    </>
  );
};

export default Attraction;