import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from '@material-ui/styles';

import theme from './theme';
import Routes from './Routes';

import logo from './logo.svg';
import './App.css';

const browserHistory = createBrowserHistory();

function App() {
  return (
      <ThemeProvider theme={theme}>
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </ThemeProvider>
  );
}

export default App;
