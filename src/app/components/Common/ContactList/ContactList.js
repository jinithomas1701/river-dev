import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';

import {ContactCard} from "../ContactCard/ContactCard";

// css
import './ContactList.scss';

export class ContactList extends React.Component {
    state = {
        searchKey: ""
    };

    selectedElements = [];
    contactList = this.props.contactList;
    
    render() {
        const cardStyle = {
            height: this.props.height
        };
        let searchString = this.state.searchKey.trim().toLowerCase();
        
        if (searchString.length > 0) {
            // Searching
            this.contactList =  this.props.contactList.filter((element) => {
                return element[this.props.searchFilterKey].toLowerCase().match(searchString);
            });
        } else {
            this.contactList = this.props.contactList;
        }
        if(this.props.selectArray){
                //console.log("ConTACT LIST",this.contactList,this.props.selectArray);
        }
        
        const contactCards = this.contactList.map((contact, index) => {
            return <ContactCard 
                    key={index}
                    id={contact.id}
                    modelObj={contact}
                    name={contact.name}
                    email={contact.email}
                    image={contact.image}
                    checkBoxStatus={contact.checked}
                    canRemove={this.props.canRemove}
                    hasCheckbox={this.props.hasCheckbox}
                    checkboxChange={this.checkboxChange.bind(this)}
                    hasSelectBox={this.props.hasSelectBox}
                    selectLabel={this.props.selectLabel}
                    selectedValue={contact.selectorId}
                    selectArray={this.props.selectArray}
                    selectBoxChange={this.selectBoxChange.bind(this)}
                    onRemoveItem={this.onRemove.bind(this, contact)}/>;
        });

        return(
            <div className="contact-list" style={cardStyle}>
                <div className="search-input-container">
                    <Icon className="input-icon">search</Icon>
                    <input type="text" placeholder="Search" className="search-input"
                        value={this.state.searchKey}
                        onChange={(e) => {
                            this.setState({searchKey: e.target.value}
                        )}}/>
                </div>
                <div className="contact-list-container custom-scroll">
                    {contactCards}
                </div>
            </div>
        )
    }

    onRemove(contact) {
        this.props.onRemoveCallback(contact);
    }

    selectBoxChange(selectedRole, userObj) {
        this.props.selectBoxChange(selectedRole, userObj);
    }

    checkboxChange(isChecked, contactObj) {
        let selectedMembers = this.props.selectedMembers;
        if (isChecked) {
            let isPresent = false;
            selectedMembers.forEach(function(element) {
                if (contactObj.id === element.id) {
                    isPresent = true;
                }
            }, this);
            if (!isPresent) {
                selectedMembers.push(contactObj);
            }
        } else {
            let checkedIndex = -1;
            const elementArray = selectedMembers;
            selectedMembers.forEach(function(element, index) {
                if (contactObj.id === element.id) {
                    elementArray.splice(index, 1);
                }
            }, this);
            selectedMembers = elementArray;
        }
        this.props.checkboxChange(selectedMembers, contactObj, isChecked);
    }
}