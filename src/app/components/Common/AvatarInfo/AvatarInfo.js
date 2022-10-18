import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';

// custom component
import {Util} from '../../../Util/util';

// css
import './AvatarInfo.scss';
class AvatarInfo extends Component{
    constructor(props){
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    render(){
        const props = this.props;
        const imgUrl = (props.avatar) ? Util.getFullImageUrl(props.avatar) : "";
        const theme = {...{backgroundColor: "#eee", color: "#000"}, ...this.props.statusTheme};

        return (
            <figure className="avatarinfo-wrapper">
                <div className="avatar-col">
                    <Avatar src={imgUrl} className="avatar-img" title={props.title}>{!imgUrl && props.title.charAt(0).toUpperCase()}</Avatar>
                    {
                        props.deletable && <Button
                                              className="btn-delete"
                                              title={`Remove: ${props.title}`}
                                              onClick={this.handleDelete}
                                              >
                                <Icon>close</Icon>
                            </Button>
                    }
                </div>
                <figcaption className="info-col">
                    {props.title && <p className="title">{props.title}</p>}
                    {props.subText && <p className="sub-text">{props.subText}</p>}
                    {props.status && <p className={`status`} style={theme}>{props.status}</p>}
                </figcaption>
            </figure>
        );
    }

    handleDelete(){
        this.props.onDelete(this.props.id);
    }
}

AvatarInfo.defaultProps = {
    statusTheme: {backgroundColor: "#eee", color: "#000"},
    deletable: false
};

AvatarInfo.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    avatar: PropTypes.string,
    title: PropTypes.string,
    subText: PropTypes.string,
    status: PropTypes.string,
    deletable: PropTypes.bool,
    statusTheme: PropTypes.object,
    onDelete: PropTypes.func,
}

export default AvatarInfo;