import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
//css
import "./ChipListInput.scss";
class ChipListInput extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const props = this.props;
        const emptyClass = props.chipList.length < 1 ? "empty" : "";
        return (
            <div className="chiplist-input-wrapper">
                <ul className="chip-list">
                    {this.getChipListTemplate(props.chipList)}
                    {
                        props.editable && <li className="btn-item">
                            <Button className={`btn-add-chip btn-primary ${emptyClass}`}
                                onClick={props.handleAddChip}
                            >
                                <Icon>add</Icon>
                                <span className="text">
                                    {props.chipTitle}
                                </span>
                            </Button>
                        </li>
                    }
                </ul>
            </div>
        )
    }

    getChipListTemplate = (itemList) => {
        const props = this.props;
        let template = itemList.length ? null : <div className="no-item">{props.emptyText}</div>;
        if (itemList.length) {
            template = itemList.map((data, index) => {
                return (
                    <li className="chip-item" key={index}>
                        <div className="chip-detail">
                            <div className="chipname">{data.name}</div>
                            <div className="chipSubText">{data.email}</div>
                        </div>
                        {
                            props.editable && <Button className="btn-delete" onClick={this.handleDeletion.bind(this, data)} fab><Icon>close</Icon></Button>
                        }
                    </li>
                );
            });
        }
        return template;
    }
    handleDeletion = (file) => {
        this.props.onChipDelete(file);
    }
    handleDeletion2 = (file) => {
    }
}
ChipListInput.defaultProps = {
    editable: false,
    chipList: []
};

ChipListInput.PropTypes = {
    chipList: PropTypes.array.isRequired,
    editable: PropTypes.bool,
    emptyText: PropTypes.string,
    onChipDelete: PropTypes.func,
    chipTitle: PropTypes.string,
    handleAddChip: PropTypes.func
}
export default ChipListInput