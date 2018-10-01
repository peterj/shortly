import React, { Component } from 'react';

import LinkList from './components/LinkList';
import CreateShortLink from './components/CreateShortLink';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import constants from './constants';

const LOGGED_IN_USER_QUERY = gql`
    query CurrentUser {
        loggedInUser {
            id
        }
    }
`;

class Home extends Component {
    logout = () => {
        localStorage.removeItem(constants.shortlyID);
        localStorage.removeItem(constants.shortlyToken);
        this.props.history.push('/');
    };

    render() {
        if (this.props.currentUser && this.props.currentUser.loading) {
            return <div>Loading ... </div>;
        }

        const userId =
            this.props.currentUser.loggedInUser &&
            this.props.currentUser.loggedInUser.id;

        if (userId) {
            return (
                <div>
                    Hi user <b>{userId}</b> (<button
                        onClick={() => this.logout()}
                    >
                        logout
                    </button>)
                    <br />
                    <div>
                        <h2>Create a short link</h2>
                        <CreateShortLink />
                    </div>
                    <div>
                        <h2>All links</h2>
                        <LinkList />
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    Please <a href="/login">login</a> or{' '}
                    <a href="/signup">sign up</a>!
                </div>
            );
        }
    }
}

export default graphql(LOGGED_IN_USER_QUERY, { name: 'currentUser' })(Home);
