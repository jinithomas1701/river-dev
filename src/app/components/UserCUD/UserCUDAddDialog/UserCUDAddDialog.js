import React from "react";
import { render } from 'react-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon';
import {connect} from "react-redux";
import Checkbox from 'material-ui/Checkbox';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import Datetime from 'react-datetime';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import { Toast, riverToast } from '../../Common/Toast/Toast';
import {Util} from '../../../Util/util';
import {UserCUDService} from '../UserCUD.service';
import {SelectBox} from '../../Common/SelectBox/SelectBox';

import {fieldChange,
        clearCudFields,
        loadCouncils,
        loadCud} from '../UserCUD.actions';

import "./UserCUDAddDialog.scss";

const mapStateToProps = (state) => {
    return {
        userCud: state.UserCUDReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fieldChange: (field, value) => {
            dispatch(fieldChange(field, value));
        },
        clearCudFields: () => {
            dispatch(clearCudFields());
        },
        loadCouncils: (councilList) => {
            dispatch(loadCouncils(councilList));
        },
        loadCud: (cud) => {
            dispatch(loadCud(cud));
        }
    }
};

class UserCUDAddDialog extends React.Component {
    state = {
        showProgress: false,
        cudId: ""
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.props.fieldChange("achievementDate", Math.round((new Date()).getTime() / 1000));            
            if(this.props.cud) {
                this.loadCudToStore(this.props.cud);
            }
            this.loadAllCouncils();
        }
    }
    render() {
        return (
            <Dialog maxWidth={'md'} open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="create-cud-dialog-container">
                {this.state.showProgress &&
                    <LinearProgress />
                }
                <DialogTitle>Create new CUD</DialogTitle>
                <DialogContent>
                    <div className="content-container create-cud-container">
                         <div className="input-container">
                            <TextField
                                id="title"
                                label="Title"
                                required
                                value = {this.props.userCud.userCudFields.title}
                                className="input-field w-full"
                                margin="normal"
                                onChange = {this.handleChange('title')}
                            />
                        </div>
                        <div className="input-container">
                            <TextField
                                id="description"
                                label="Description"
                                multiline
                                row={3}
                                required
                                value = {this.props.userCud.userCudFields.description}
                                className="input-field w-full"
                                margin="normal"
                                onChange = {this.handleChange('description')}
                            />
                        </div>
                        <div className="input-fields-container">
                            <div className="input-container">
                                <div className="datetime-picker-wrapper">
                                    <label
                                        htmlFor="achievement-date"
                                    >
                                        Date
                                    </label>
                                    <Datetime
                                        inputProps={
                                                { 
                                                    placeholder: 'Date',
                                                    id:"achievement-date",
                                                    className:"datetime-input"
                                                }
                                            }
                                        className="datetime-picker"
                                        timeFormat={false}
                                        onChange={(value)=>{
                                            this.props.fieldChange("achievementDate", Math.round((new Date(value)).getTime() / 1000));
                                        }}
                                        value={new Date(this.props.userCud.userCudFields.achievementDate * 1000)}
                                    />
                                </div>
                            </div>
                            <div className="input-container">
                                <div className="input-field selectBox">
                                    <SelectBox 
                                        id="council" 
                                        required
                                        label="Panel"
                                        selectedValue = {this.props.userCud.userCudFields.council}
                                        selectArray={this.props.userCud.councilList || []}
                                        onSelect={this.handleSelect('council')}/>
                                </div>  
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this, false, true)} color="default">
                        Cancel
                    </Button>
                    <Button onClick={this.onSubmit.bind(this)} color="primary">
                        {
                            (!this.props.cud) ? 
                                "Submit"
                            :
                                "Update"
                        }
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleChange = name => event => {
        this.props.fieldChange(name, event.target.value);
    };

    handleSelect = name => value => {
        this.props.fieldChange(name, value);
    };

    handleRequestClose(success = false, clearCud = true) {
        this.props.clearCudFields();
        this.props.onRequestClose(success, clearCud);
    }

    getVoiceCouncilsMeta(list) {
        return list.map(item => {
            return {
                title: item.name,
                value: item.tagId
            }
        })
    }

    loadCudToStore(cud) {
        const cudObject = {
            title: cud.title,
            description: cud.description,
            achievementDate: cud.achievementDate,
            council: cud.council.id
        }
        this.setState({ cudId: cud.id });
        this.props.loadCud(cudObject);        
    }

    onValidForm() {
        if(!this.props.userCud.userCudFields.title ||
            !this.props.userCud.userCudFields.description ||
            !this.props.userCud.userCudFields.council ||
            !this.props.userCud.userCudFields.achievementDate) {
            riverToast.show("Please fill all fields");    
            return false;
        }
        return true;
    }

    loadAllCouncils() {
        UserCUDService.getAllCouncils()
            .then((data) => {
                const councilsList = this.getVoiceCouncilsMeta(data);
                this.props.loadCouncils(councilsList);
            })
            .catch((error) => {
                riverToast.show("Something went wrong on fetching panels")
            })
    }

    onSubmit() {
        if(this.onValidForm()) {
            const userCud = {
                title: this.props.userCud.userCudFields.title,
                description: this.props.userCud.userCudFields.description,
                council: this.props.userCud.userCudFields.council,
                achievementDate: this.props.userCud.userCudFields.achievementDate * 1000
            }
            this.setState({showProgress: true});
            if(!this.props.cud) {
                UserCUDService.createCud(userCud)
                .then(data => {
                    this.setState({showProgress: false});
                    this.handleRequestClose(true);
                })
                .catch(error => {
                    this.setState({showProgress: false});
                    riverToast.show(error.status_message);
                });
            } else {
                UserCUDService.updateCud(userCud, this.state.cudId)
                .then(data => {
                    this.setState({
                        ...this.state,
                        showProgress: false,
                        cudId: ""
                    });
                    this.handleRequestClose(true);
                })
                .catch(error => {
                    this.setState({showProgress: false});
                    riverToast.show(error.status_message);
                });
            }
        }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(UserCUDAddDialog);