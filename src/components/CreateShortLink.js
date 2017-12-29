import React, { Component } from 'react';

import gql from 'graphql-tag';
import { graphql, withApollo } from 'react-apollo';

const CREATE_SHORT_LINK_MUTATION = gql`
    mutation CreateLinkMutation(
        $url: String!
        $description: String!
        $hash: String!
    ) {
        createLink(url: $url, description: $description, hash: $hash) {
            id
        }
    }
`;

const GET_LINK_COUNT_QUERY = gql`
    query GetLinkCountQuery {
        links: _allLinksMeta {
            count
        }
    }
`;

const createHash = itemCount => {
    let hashDigits = [];
    // dividend is a unique integer (in our case, number of links)
    let dividend = itemCount + 1;
    let remainder = 0;
    while (dividend > 0) {
        remainder = dividend % 62;
        dividend = Math.floor(dividend / 62);
        hashDigits.unshift(remainder);
    }
    const alphabetArray = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`.split(
        '',
    );
    // Convert hashDigits to base62 representation
    let hashString = '';
    let i = 0;
    while (hashDigits.length > i) {
        hashString += alphabetArray[hashDigits[i]];
        i++;
    }
    return hashString;
};

class CreateShortLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            url: '',
        };
    }

    createShortLink = async () => {
        const linkCountQuery = await this.props.client.query({
            query: GET_LINK_COUNT_QUERY,
        });

        const linkCount = linkCountQuery.data.links.count;
        const hash = createHash(linkCount);

        const { url, description } = this.state;
        await this.props.createShortLinkMutation({
            variables: {
                url,
                description,
                hash,
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
})(withApollo(CreateShortLink));
