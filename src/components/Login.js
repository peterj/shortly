import React, { Component } from 'react';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import constants from '../constants';

const AUTHENTICATE_USER_MUTATION = gql`
    mutation AuthUser($email: String!, $password: String!) {
        authenticateUser(email: $email, password: $password) {
            id
            token
        }
    }
`;

class Login extends Component {
    state = {
      email: '',
      password: '',
      error: ''
    }

    login = async () => {
        this.setState({error: ''});
        
        const { email, password } = this.state;
        try {
            const result = await this.props.authenticateUserMutation({
                variables: {
                    email,
                    password,
                },
            });
            // Store the ID and token in local storage.
            localStorage.setItem(constants.shortlyID, result.data.authenticateUser.id);
            localStorage.setItem(
                constants.shortlyToken,
                result.data.authenticateUser.token,
            );
            this.props.history.push('/');
        } catch (error) {
            this.setState({error: `Sorry, an error occured on login. (${error})`})
        }
    };

    render() {
        return (
            <div>
                <h2>Login to Shortly</h2>
                <input
                    id="email"
                    type="text"
                    value={this.state.email}
                    placeholder="Email address"
                    onChange={e => this.setState({ email: e.target.value })}
                />
                <br />
                <input
                    id="password"
                    type="password"
                    value={this.state.password}
                    placeholder="Password"
                    onChange={e => this.setState({ password: e.target.value })}
                />
                <br />
                <button onClick={() => this.login()}>Login</button>
                { this.state.error &&
                  <p className="error">{this.state.error}</p>
                }
            </div>
        );
    }
}

export default graphql(AUTHENTICATE_USER_MUTATION, {
    name: 'authenticateUserMutation',
})(Login);
