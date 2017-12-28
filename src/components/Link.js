import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Link extends Component {
    render() {
        return (
            <div>
                <div>
                    {this.props.link.description} ({this.props.link.url} -{' '}
                    {this.props.link.hash})
                </div>
            </div>
        );
    }
}

Link.propTypes = {
    link: PropTypes.shape({
        id: PropTypes.string,
        url: PropTypes.string,
        hash: PropTypes.string,
        description: PropTypes.string,
    }),
};

export default Link;
