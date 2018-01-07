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
                id
                clicks
            }
        }
    }
`;

const UPDATE_CLICK_COUNT_MUTATION = gql`
    mutation UpdateClickCount($id: ID!, $clicks: Int!) {
        updateLinkStats(id: $id, clicks: $clicks) {
            id
        }
    }
`;

const CREATE_LINK_STATS_MUTATION = gql`
    mutation CreateLinkStats($linkId: ID!, $clicks: Int!) {
        createLinkStats(linkId: $linkId, clicks: $clicks) {
            id
        }
    }
`;

const ShortLinkRedirect = ({
    updateClickCount,
    createLinkStats,
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

    if (!linkInfo.stats) {
        // Create new link stats
        createLinkStats({
            variables: {
                linkId: linkInfo.id,
                clicks: 1,
            },
        });
    } else {
        let currentClicks = (linkInfo.stats && linkInfo.stats.clicks) || 0;

        // Increment the click count
        currentClicks++;

        // Update the click count.
        updateClickCount({
            variables: {
                id: linkInfo.stats.id,
                clicks: currentClicks,
            },
        });
    }

    // Navigate to the full URL
    window.location = linkInfo.url;
    return null;
};

ShortLinkRedirect.propTypes = {
    hash: PropTypes.string,
};

export default compose(
    graphql(UPDATE_CLICK_COUNT_MUTATION, { name: 'updateClickCount' }),
    graphql(CREATE_LINK_STATS_MUTATION, { name: 'createLinkStats' }),
    graphql(GET_FULL_LINK_QUERY, {
        options: ({ hash }) => ({ variables: { hash } }),
    }),
)(ShortLinkRedirect);
