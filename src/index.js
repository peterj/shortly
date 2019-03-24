import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppRouter from './AppRouter';
import * as serviceWorker from './serviceWorker';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

import { WebSocketLink } from 'apollo-link-ws';
import { split, ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';

const GRAPHQL_ENDPOINT = '';
const SUBSCRIPTIONS_ENDPOINT = '';

if (!SUBSCRIPTIONS_ENDPOINT) {
  throw Error('Provide a GraphQL Subscriptions endpoint.');
}

if (!GRAPHQL_ENDPOINT) {
  throw Error('Provide a GraphQL endpoint.');
}

const apolloLinkWithToken = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('SHORTLY_TOKEN');
  const authHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authHeader
    }
  });
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT
});

const httpLinkWithToken = apolloLinkWithToken.concat(httpLink);

const wsLink = new WebSocketLink({
  uri: SUBSCRIPTIONS_ENDPOINT,
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLinkWithToken
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const withApolloProvider = Comp => (
  <ApolloProvider client={client}>{Comp}</ApolloProvider>
);

ReactDOM.render(
  withApolloProvider(<AppRouter />),
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
