import React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';

import Home from './Home';
import ShortLinkRedirect from './components/ShortLinkRedirect';

const AppRouter = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route
                path="/:hash"
                render={props => (
                    <ShortLinkRedirect hash={props.match.params.hash} />
                )}
            />
        </Switch>
    </BrowserRouter>
);

export default AppRouter;
