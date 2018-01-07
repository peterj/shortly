import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const SIGNUP_USER_MUTATION = gql`
    mutation SignupUser($email: String!, $password: String!) {
        signupUser(email: $email, password: $password) {
            id
            token
        }
    }
`;

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    signup = async () => {
        const { email, password } = this.state;
        try {
            const result = await this.props.signupUserMutation({
                variables: {
                    email,
                    password,
                },
            });

            // Store the ID and token in local storage.
            localStorage.setItem('SHORTLY_ID', result.data.signupUser.id);
            localStorage.setItem('SHORTLY_TOKEN', result.data.signupUser.token);
            this.props.history.push('/');
        } catch (err) {
            // TODO: Handle the error properly
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
            </div>
        );
    }
}

export default graphql(SIGNUP_USER_MUTATION, { name: 'signupUserMutation' })(
    Signup,
);
