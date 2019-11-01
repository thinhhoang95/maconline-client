import React from 'react';
import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Moderator from './Moderator/Moderator';
import Referee from './Referee/Referee';

function App() {
  return (
    <BrowserRouter>
          <div>

            <Route path='/display' component={Moderator} exact />
            <Route path='/referee' component={Referee} exact />

          </div>
    </BrowserRouter>
  );
}

export default App;
