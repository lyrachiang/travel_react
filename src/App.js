// package
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';

import LayoutProvider from './providers/layout_provider';
import Layout from './components/layout';

import Home from './views/home';
import Activity from './views/activity';
import Attraction from './views/attraction';
import Restaurant from './views/restaurant';
import Hotel from './views/hotel';

const ScrollToTop = (props) => {
  const { children } = props;
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
};

function App() {
  return (
    <LayoutProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <ScrollToTop>
          <Layout>
            <Route path="/" exact component={Home} />
            <Route path={["/activity", "/activity/:id"]} component={Activity} />
            <Route path={["/attraction", "/attraction/:id"]} component={Attraction} />
            <Route path={["/restaurant", "/restaurant/:id"]} component={Restaurant} />
            <Route path={["/hotel", "/hotel/:id"]} component={Hotel} />
          </Layout>
        </ScrollToTop>
      </Router>
    </LayoutProvider>
  );
}

export default App;
