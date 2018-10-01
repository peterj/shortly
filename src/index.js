import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppRouter from './AppRouter';
import registerServiceWorker from './registerServiceWorker';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink } from 'apollo-link';

import constants from './constants';

const GRAPHQL_ENDPOINT = '';
const SUBSCRIPTIONS_ENDPOINT = '';

if (!SUBSCRIPTIONS_ENDPOINT) {
    throw Error('Provide a GraphQL Subscriptions endpoint.');
}

if (!GRAPHQL_ENDPOINT) {
    throw Error('Provide a GraphQL endpoint.');
}

const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
});

const apolloLinkWithToken = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem(constants.shortlyToken);
    const authHeader = token ? `Bearer ${token}` : null;
    operation.setContext({
        headers: {
            authorization: authHeader,
        },
    });
    return forward(operation);
});

const httpLinkWithToken = apolloLinkWithToken.concat(httpLink);

const wsLink = new WebSocketLink({
    uri: SUBSCRIPTIONS_ENDPOINT,
    options: {
        reconnect: true,
    },
});

// We inspect the query and use the split function to return the web socket link
// in case the operation is a subscription and return an httpLink in any other case (query or mutation)
const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLinkWithToken,
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

const withApolloProvider = Comp => (
    <ApolloProvider client={client}>{Comp}</ApolloProvider>
);

ReactDOM.render(
    withApolloProvider(<AppRouter />),
    document.getElementById('root'),
);
registerServiceWorker();
