import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const GRAPHQL_ENDPOINT = '';

if (!GRAPHQL_ENDPOINT) {
    throw Error('Provide a GraphQL endpoint.');
}
const client = new ApolloClient({
    link: new HttpLink({
        uri: GRAPHQL_ENDPOINT,
    }),
    cache: new InMemoryCache(),
});

const withApolloProvider = Comp => (
    <ApolloProvider client={client}>{Comp}</ApolloProvider>
);

ReactDOM.render(withApolloProvider(<App />), document.getElementById('root'));
registerServiceWorker();
