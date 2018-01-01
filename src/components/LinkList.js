import React, { Component } from 'react';
import Link from './Link';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const ALL_LINKS_QUERY = gql`
    query AllLinksQuery {
        allLinks {
            id
            url
            description
            hash
            stats {
                clicks
            }
        }
    }
`;

const LINKS_SUBSCRIPTION = gql`
    subscription NewLinkCreatedSubscription {
        Link(filter: { mutation_in: [CREATED, UPDATED] }) {
            node {
                id
                url
                description
                hash
                stats {
                    clicks
                }
            }
        }
    }
`;

class LinkList extends Component {
    componentDidMount() {
        this.props.allLinksQuery.subscribeToMore({
            document: LINKS_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (
                    prev.allLinks.find(
                        l => l.id === subscriptionData.data.Link.node.id,
                    )
                ) {
                    return prev;
                }
                const newLinks = [
                    ...prev.allLinks,
                    subscriptionData.data.Link.node,
                ];
                const result = {
                    ...prev,
                    allLinks: newLinks,
                };
                return result;
            },
        });
    }

    render() {
        if (this.props.allLinksQuery && this.props.allLinksQuery.loading) {
            return <div>Loading ...</div>;
        }

        if (this.props.allLinksQuery && this.props.allLinksQuery.error) {
            return <div>Error occurred</div>;
        }

        const allLinks = this.props.allLinksQuery.allLinks;
        if (allLinks.length === 0) {
            return <div>No links...</div>;
        }

        return (
            <div>
                {allLinks.map(link => <Link key={link.id} link={link} />)}
            </div>
        );
    }
}

export default graphql(ALL_LINKS_QUERY, {
    name: 'allLinksQuery',
})(LinkList);
