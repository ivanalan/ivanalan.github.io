import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Intro from '../intro/Intro';
import Schwab from '../schwab/Schwab';

const Main = () => {
  return (
    <BrowserRouter>
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Intro}></Route>
      <Route exact path='/schwab' component={Schwab}></Route>
    </Switch>
    </BrowserRouter>
  );
}

export default Main;