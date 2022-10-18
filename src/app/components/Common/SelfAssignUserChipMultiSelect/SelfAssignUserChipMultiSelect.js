import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import {ContactCard} from '../ContactCard/ContactCard';
import {Util} from "../../../Util/util";
import { CircularProgress, LinearProgress } from 'material-ui/Progress';

// css
import './SelfAssignUserChipMultiSelect.scss';
import { ApiUrlConstant } from '../../../Util/apiUrl.constant';

export class SelfAssignUserChipMultiSelect extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchKey: "",
            suggessionBoxVisible: "collapsed"
        };
    }

    render() {
        const selectedChips = !this.props.disableShowSelected ? this.props.selectedChips.map((item, index) => {
            let chipImage = "";
            let chipElement;
            if (item.type === "USER") {
                if (item.avatar) {
                    if (item.avatar.indexOf("resources") > -1) {
                        chipImage = "../../../../../resources/images/img/user-avatar.png";
                    } else {
                        chipImage = Util.getFullImageUrl(item.avatar);
                    }
                } else {
                    chipImage = "../../../../../resources/images/img/user-avatar.png";
                }
                chipElement = <div key={index} className="chip-item-wrapper"><Chip
                                                                                 className="chip-item"
                                                                                 avatar={<Avatar src={chipImage}></Avatar>}
                                                                                 label={item.fullname}
                                                                                 onRequestDelete={this.handleRequestDelete.bind(this, item)}
                                                                                 /></div>
            } else {
                if (item.avatar) {
                    if (item.avatar.indexOf("resources") > -1) {
                        chipImage = "../../../../../resources/images/img/club.jpg";
                    } else {
                        chipImage = Util.getFullImageUrl(item.avatar);
                    }
                } else {
                    chipImage = "../../../../../resources/images/img/club.jpg";
                }
                chipElement =   <div key={index} className="chip-item-wrapper">
                        <Chip
                            className="chip-item"
                            avatar={<Avatar src={chipImage}></Avatar>}
                            label={item.fullname || item.name}
                            onRequestDelete={this.handleRequestDelete.bind(this, item)}
                            />
                    </div>
            }

            return chipElement;
        }) : false ;
        const searchItems = this.props.resultChips.map((item, index) => {
            let contactListItem;
            let tileImage = "";
            let baseUrl = ApiUrlConstant.getBase();
            if (item.type === "USER") {
                if (item.avatar) {
                    if (item.avatar.indexOf("resources") > -1) {
                        tileImage = "../../../../../resources/images/img/user-avatar.png";
                    } else {
                        if (item.avatar.indexOf(baseUrl) > -1) {
                            tileImage = item.avatar;
                        } else {
                            tileImage = Util.getFullImageUrl(item.avatar);
                        }
                    }
                } else {
                    tileImage = "../../../../../resources/images/img/user-avatar.png";
                }
                contactListItem = <div key={index} className="search-result-item" onClick={this.onSearchItemSelect.bind(this, item)}>
                        <ContactCard 
                            modelObj={null}
                            name={item.fullname}
                            email={item.username}
                            image={tileImage}/>
                    </div>
            } else {
                if (item.avatar) {
                    if (item.avatar.indexOf("resources") > -1) {
                        tileImage = "../../../../../resources/images/img/club.jpg";
                    } else {
                        tileImage = Util.getFullImageUrl(item.avatar);
                    }
                } else {
                    tileImage = "../../../../../resources/images/img/club.jpg";
                }
                contactListItem = <div key={index} className="search-result-item" onClick={this.onSearchItemSelect.bind(this, item)}>
                        <ContactCard 
                            modelObj={null}
                            name={item.fullname || item.name}
                            email={item.type}
                            image={tileImage}/>
                    </div>
            }

            return contactListItem;
        });
        let { isIconEnabled } = this.props;
        isIconEnabled = isIconEnabled || true;
        return(
            <div className="userMultiChipSelect">
                <div className={("search-box-container ") + (this.props.searchBoxClass)}>
                    {isIconEnabled &&
                        <Icon className="text-icon">search</Icon>
                    }
                    <input type="text" id="userChipMultiSelectSearchBox"
                        placeholder={this.props.placeholder || "Search"}
                        style={this.props.customStyle || {}}
                        disabled = {this.props.isDisabled || false}
                        onChange={(e) => {
                            this.props.onTextChange(e.target.value);
                        }}
                        />
                    {(this.props.showPreloader) &&
                        <div className="input-preloader-container">
                            <CircularProgress size={20}/>
                        </div>
                    }
                    {(this.props.resultChips.length > 0) &&
                        <div className="search-results-container" style={this.props.customStyle || {}}>
                            {searchItems}
                        </div>
                    }

                </div>
                {
                    !this.props.disableShowSelected &&
                        <div className="selected-chips-container">
                            {selectedChips}
                        </div>
                }
            </div>
        )
    }

    onSearchItemSelect(item) {
        document.getElementById("userChipMultiSelectSearchBox").value = "";
        this.props.onItemSelect(item);
    }

    handleRequestDelete(item) {
        this.props.onDeleteChip(item);
    }
}