import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import { FormControl, FormHelperText, FormControlLabel  } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import {SelectBox} from '../SelectBox/SelectBox';

import { Util } from "../../../Util/util";

// css
import './ContactCard.scss';
import { ApiUrlConstant } from '../../../Util/apiUrl.constant';

export class ContactCard extends React.Component {
    state = {
        isChecked: this.props.checkBoxStatus,
        selectedValue: this.props.selectedValue
    };

componentDidMount() {
    this.setState({isChecked: this.props.checkBoxStatus,selectedValue: this.props.selectedValue});
    
}

render() {
    let contactImage;
    const baseURL = ApiUrlConstant.getBase();
    if (this.props.image.indexOf("resources") > -1) {
        contactImage = this.props.image;
    } else {
        if (this.props.image.indexOf(baseURL) > -1) {
            contactImage = this.props.image;
        } else {
            contactImage = Util.getFullImageUrl(this.props.image);
        }

    }

    let selectedObj={};
    if(this.props.selectedValue && this.props.selectArray){
        selectedObj=this.props.selectArray.find((data,indx)=>{
            if(this.props.selectedValue==data.value){
                    return data;
            }
        });
    }

    return(
       
        <div className="contact-card">
            <div className="contact-card-inner">
                {this.props.hasCheckbox &&
                    <div className="checkbox-container">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={"contact-card-checkbox"+this.props.id}
                                    className="contact-card-checkbox"
                                    onClick={this.onClickCheckbox.bind(this)}
                                    checked={this.props.checkBoxStatus}
                                    />
                            }
                            label = ""
                            />
                    </div>
                }
                <img className="avatar" src={contactImage} />
                <div className="content">
                    <div className="main-text" title={this.props.name}>{this.props.name}</div>
                    {selectedObj.title && <div title="Current Role" style={{fontSize:"8px"}} className="club-role">{selectedObj.title}</div>}
                    <div className="sub-text" title={this.props.email}>{this.props.email}</div>
                    {
                        (this.props.clubRole) &&
                            <div className="sub-text club-role">{this.props.clubRole}</div>                        
                    }
                </div>
                {this.props.hasSelectBox && this.state.selectedValue &&
                    <div title="Change Role To" className="select-action">
                        <SelectBox 
                            id="club-location-select" 
                            label={this.props.selectLabel}
                            selectedValue={this.state.selectedValue}
                            selectArray={this.props.selectArray}
                            onSelect={this.selectBoxChange.bind(this)}/>
                    </div>
                }
            </div>
            {this.props.canRemove && 
                <div className="action">
                    <Icon className="action-icon" onClick={this.onRemoveCard.bind(this)}>clear</Icon>
                </div>
            }
        </div>
    )
}

selectBoxChange(selectedRole) {
    this.setState({selectedValue: selectedRole});
    
    this.props.selectBoxChange(selectedRole, this.props.modelObj);
}

onRemoveCard() {
    this.props.onRemoveItem();
}

onClickCheckbox(event) {
    this.setState({
        isChecked: event.target.checked
    });
    this.props.checkboxChange(event.target.checked, this.props.modelObj);
}
}