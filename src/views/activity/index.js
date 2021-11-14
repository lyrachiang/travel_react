import React from 'react';
import { Route } from 'react-router-dom';

import List from './list';
import Page from './page';

const Activity = () => {
  return (
    <>
      <Route path="/activity" exact component={List} />
      <Route path="/activity/:id" component={Page} />
    </>
  );
};

export default Activity;