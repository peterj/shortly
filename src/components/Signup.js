import React, { Component } from 'react';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import constants from '../constants';

const SIGNUP_USER_MUTATION = gql`
    mutation SignupUser($email: String!, $password: String!) {
        signupUser(email: $email, password: $password) {
            id
            token
        }
    }
`;

class Signup extends Component {
    state = {
      email: '',
      password: '',
      error: ''
    }

    signup = async () => {
        this.setState({error: ''});
        
        const { email, password } = this.state;
        try {
            const result = await this.props.signupUserMutation({
                variables: {
                    email,
                    password,
                },
            });

            // Store the ID and token in local storage.
            localStorage.setItem(constants.shortlyID, result.data.signupUser.id);
            localStorage.setItem(constants.shortlyToken, result.data.signupUser.token);
            this.props.history.push('/');
        } catch (error) {
            this.setState({error: `Sorry, an error occured on signing up. (${error})`})
        }
    };

    render() {
        return (
            <div>
                <h2>Join Shortly</h2>
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
                <button onClick={() => this.signup()}>Signup</button>
                { this.state.error &&
                  <p className="error">{this.state.error}</p>
                }
            </div>
        );
    }
}

export default graphql(SIGNUP_USER_MUTATION, { name: 'signupUserMutation' })(
    Signup,
);
