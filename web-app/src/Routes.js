import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Minimal as MinimalLayout } from './layouts';
import { RouteWithLayout } from './components';

import {
    Home as HomeView,
    NotFound as NotFoundView
  } from './views';

const Routes = () => {
    return (
        <Switch>
            <Redirect
                exact
                from="/"
                to="/home"
            />
            <RouteWithLayout
                component={HomeView}
                exact
                layout={MinimalLayout}
                path="/home"
            />
            <RouteWithLayout
                component={NotFoundView}
                exact
                layout={MinimalLayout}
                path="/upload/template"
            />
            <RouteWithLayout
                component={NotFoundView}
                exact
                layout={MinimalLayout}
                path="/upload/data"
            />
            <RouteWithLayout
                component={NotFoundView}
                exact
                layout={MinimalLayout}
                path="/view/template"
            />
            <RouteWithLayout
                component={NotFoundView}
                exact
                layout={MinimalLayout}
                path="/view/generated"
            />
        </Switch>

        
    );
};

export default Routes;