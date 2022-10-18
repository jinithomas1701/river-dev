import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CircularProgress } from 'material-ui/Progress';
import Avatar from 'material-ui/Avatar';

import { Util } from '../../../Util/util';

//**********************************************************
import './styles/LoaderOverlay.scss';

const LoaderOverlay = (props) => {
    //const dispayType = props.show ? "flex" : "none";
    const statusClass = props.show ? "active" : "hidden";
    return (
        <div className={`loadingoverlay-wrapper ${statusClass}`}>
            <CircularProgress size={50} />
        </div>
    );
}
LoaderOverlay.defaultProps = {
    show: false
}
LoaderOverlay.propTypes = {
    show: PropTypes.bool.isRequired
}
export { LoaderOverlay };

//**********************************************************

const DateDisplay = (props) => {
    const date = moment(props.date);
    const dateUser = date.format(props.format);
    const dateCom = date.format("YYYY-MM-DD");
    const dateTitle = `${props.prefix}${date.format("DD MMM YYYY hh:mm A")}`;

    return <time dateTime={dateCom} className="date-display" title={dateTitle}>{dateUser}</time>
};

DateDisplay.defaultProps = {
    format: "DD MMM YYYY hh:mm A",
    prefix: ""
}
DateDisplay.propTypes = {
    date: PropTypes.number.isRequired,
    format: PropTypes.string,
    prefix: PropTypes.string
}
export { DateDisplay };

//**********************************************************

import './styles/UserAvatar.scss';

const UserAvatar = (props) => {
    const { src, name, bgColor } = props;
    const classList = `avatar-wrapper ${props.className}`;
    const initials = name.charAt(0);
    const imgUrl = (src) ? Util.getFullImageUrl(src) : false;
    const imgClass = { style: { "background": bgColor || Util.generateHSLFromString(name) }, "data-initials": initials };
    const template = imgUrl ?
        <Avatar className={classList} src={imgUrl} imgProps={imgClass} title={name}></Avatar> :
        <Avatar className={classList} {...imgClass} title={name}>{initials}</Avatar>;

    return template;
};

UserAvatar.defaultProps = {
    name: "",
    className: ""
}
UserAvatar.propTypes = {
    className: PropTypes.string,
    src: PropTypes.string,
    name: PropTypes.string,
    bgColor: PropTypes.string
}
export { UserAvatar };

//**********************************************************