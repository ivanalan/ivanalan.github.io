import React from 'react';
import { Route, IndexRoute } from 'react-router';

/**
 * Import all page components here
 */
import App from './App';
import Intro from './components/intro/Intro'
import Schwab from './components/schwab/Schwab';

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
export default (
  <Route path="/" component={App}>
    <IndexRoute component={Intro} />
    <Route path="/schwab" component={Schwab} />
  </Route>
);