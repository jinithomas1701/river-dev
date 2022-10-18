import React from "react";
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom'

// css
import './ClubSelect.scss';


export default class ClubSelect extends React.Component {
    riverBtnStyle = {
        boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
        backgroundColor: this.props.color,
        color: this.props.textColor,
        fontWeight: 'bold',
        fontSize: '11px',
        padding: '13px'
    };

render() {
    const { placeholder, onSelect, options, source, selected, title } = this.props;
    const selectList = source.map((item, index) => {
        return <option key={item.value} value={item.value}>{item.label}</option>;
    });
    return (
        <div className={'club-select '+this.props.className}>
            <label className="select-label">{this.props.labelText || ""}</label>
            <select onChange={(e) => onSelect(e.target.value)} title={title || ''} defaultValue={selected}>
                {!selected &&
                    <option value="">{placeholder || 'Select your option'}</option>
                }
                {selectList}
            </select>
        </div>
    )
}
}