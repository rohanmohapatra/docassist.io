import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Minimal as MinimalLayout, Template as TemplateLayout } from './layouts';
import { RouteWithLayout } from './components';

import {
    Home as HomeView,
    NotFound as NotFoundView,
    UploadTemplate as UploadTemplateView,
    ViewTemplates as ViewTemplatesView,
    GenerateDoc as GenerateDocView,
    EditTemplate as EditTemplateView,
    ViewCompletedDocs as ViewCompletedDocsView,
    BulkGenerate as BulkGenerateView,
    WriteYourOwnTemplate as WriteYourOwnTemplateView
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
                component={UploadTemplateView}
                exact
                layout={TemplateLayout}
                path="/upload/template"
            />
            <RouteWithLayout
                component={EditTemplateView}
                exact
                layout={TemplateLayout}
                path="/edit/template/:template_id"
            />
            <RouteWithLayout
                component={ViewTemplatesView}
                exact
                layout={TemplateLayout}
                path="/view/template"
            />

            <RouteWithLayout
                component={BulkGenerateView}
                exact
                layout={TemplateLayout}
                path="/bulk/generate"
            />
            <RouteWithLayout
                component={ViewCompletedDocsView}
                exact
                layout={MinimalLayout}
                path="/view/generated"
            />

            <RouteWithLayout 
                component={GenerateDocView}
                exact
                layout={TemplateLayout}
                path='/upload/data'
            />
            <RouteWithLayout
            component={WriteYourOwnTemplateView}
            exact
            layout = {MinimalLayout}
            path='/template/create'
            />
        </Switch>

        
    );
};

export default Routes;