import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';

const GET_FULL_LINK_QUERY = gql`
    query GetFullLink($hash: String!) {
        allLinks(filter: { hash: $hash }) {
            id
            url
            stats {
                clicks
            }
        }
    }
`;

const UPDATE_CLICK_COUNT_MUTATION = gql`
    mutation UpdateClickCount($id: ID!, $clicks: Int!) {
        updateLink(id: $id, dummy: "dummy", stats: { clicks: $clicks }) {
            id
        }
    }
`;

const ShortLinkRedirect = ({
    updateClickCount,
    hash,
    data: { loading, error, allLinks },
}) => {
    if (error) {
        return <div>Error occurred: {error}</div>;
    }

    if (loading) {
        return <div>Loading ...</div>;
    }

    if (!allLinks || allLinks.length !== 1) {
        return <div>No redirect found for '{hash}'</div>;
    }

    const linkInfo = allLinks[0];
    let currentClicks = (linkInfo.stats && linkInfo.stats.clicks) || 0;

    // Increment the click count
    currentClicks++;

    // Update the click count.
    updateClickCount({
        variables: {
            id: linkInfo.id,
            clicks: currentClicks,
        },
    });

    // Navigate to the full URL
    window.location = linkInfo.url;
    return null;
};

ShortLinkRedirect.propTypes = {
    hash: PropTypes.string,
};

export default compose(
    graphql(UPDATE_CLICK_COUNT_MUTATION, { name: 'updateClickCount' }),
    graphql(GET_FULL_LINK_QUERY, {
        options: ({ hash }) => ({ variables: { hash } }),
    }),
)(ShortLinkRedirect);
