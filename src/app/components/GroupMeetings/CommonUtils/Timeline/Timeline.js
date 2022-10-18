import React, { Component } from 'react';
import './Timeline.scss';
import PropTypes from 'prop-types';
import { Icon } from 'material-ui';

const TIMELINE_TYPE_LIST = ["minimal", "default"];
const TIMELINE_THEME_LIST = ["primary", "default", "complimentary"];

class Timeline extends Component {
    render() {
        const props = this.props;
        const type = TIMELINE_TYPE_LIST.includes(props.type) ? props.type : "default";
        const theme = TIMELINE_THEME_LIST.includes(props.theme) ? props.theme : "default";

        return (
            <React.Fragment>
                {
                    props.data.length > 0 &&
                    <div className={`timeline-wrapper ${props.className}`}>
                        <div className={`timeline-${type}`}>
                            {
                                props.data.map((eachItem, index) =>
                                    <div key={index} className={`item-wrapper-${theme}`}>
                                        <span className="bullet" />
                                        {
                                            typeof eachItem === "object" ?
                                                <div className="content-container">
                                                    {
                                                        props.isEditable &&
                                                        <div className="edit-action-wrapper" onClick={this.editMinutesItemHandler}>
                                                            <Icon>edit</Icon>
                                                        </div>
                                                    }
                                                    <span className="title">{eachItem.title}</span>&nbsp;&nbsp;
                                                    <span className="content">{eachItem.content}</span>
                                                </div> :
                                                <div className="content-container">
                                                    {
                                                        props.isEditable &&
                                                        <div className="edit-action-wrapper" onClick={this.editMinutesItemHandler}>
                                                            <Icon>edit</Icon>
                                                        </div>
                                                    }
                                                    <p className="content">{eachItem}</p>
                                                </div>
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }

    editMinutesItemHandler = () => {
        console.log("edit");
    }
}

Timeline.defaultProps = {
    theme: "default",
    type: "default",
    isEditable: false,
    className: "",
    data: [],

};

Timeline.propTypes = {
    theme: PropTypes.oneOf(["default", "primary", "complimentary"]),
    type: PropTypes.oneOf(["default", "minimal"]),
    isEditable: PropTypes.bool,
    className: PropTypes.string,
    data: PropTypes.array
};

export default Timeline;