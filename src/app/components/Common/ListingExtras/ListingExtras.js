import React from "react";
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

// css
import './ListingExtras.scss';

// custom components
import { SearchWidget } from '../SearchWidget/SearchWidget';
import { AddNewBtn } from '../AddNewBtn/AddNewBtn';

export class ListingExtras extends React.Component {
    riverBtnStyle = {
        color: '#ffffff',
        boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
        backgroundColor: '#26455D'
    };
    newBtnLink = this.props.buttonLink;
    onAddnewClick() {
        this.props.history.push(newBtnLink);
    };

    render() {
        return (
            <div className="col-md-12 listing-extras">
                <AddNewBtn callback={this.onAddnewClick.bind(this)}/>
                <SearchWidget withButton/>
            </div>
        )
    }
}

ListingExtras.propTypes = {
    buttonLink: PropTypes.string.isRequired,
}