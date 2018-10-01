import React, { Component } from 'react';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import constants from '../constants';

const CREATE_SHORT_LINK_MUTATION = gql`
    mutation CreateLinkMutation(
        $url: String!
        $description: String!
        $createdById: ID!
    ) {
        createLink(
            url: $url
            description: $description
            createdById: $createdById
        ) {
            id
        }
    }
`;

class CreateShortLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            url: '',
        };
    }

    createShortLink = async () => {
        const { url, description } = this.state;
        await this.props.createShortLinkMutation({
            variables: {
                url,
                description,
                createdById: localStorage.getItem(constants.shortlyID),
            },
        });
    };

    render() {
        return (
            <div>
                <input
                    id="url"
                    type="text"
                    value={this.state.url}
                    placeholder="Link URL"
                    onChange={e => this.setState({ url: e.target.value })}
                />
                <input
                    id="description"
                    type="text"
                    value={this.state.description}
                    placeholder="Link description"
                    onChange={e =>
                        this.setState({ description: e.target.value })
                    }
                />
                <button onClick={() => this.createShortLink()}>Create</button>
            </div>
        );
    }
}

export default graphql(CREATE_SHORT_LINK_MUTATION, {
    name: 'createShortLinkMutation',
})(CreateShortLink);
