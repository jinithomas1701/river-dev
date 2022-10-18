import React from "react";
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Avatar from 'material-ui/Avatar';
import { Toast, riverToast } from '../../../Common/Toast/Toast';
import moment from 'moment';

// custom component
import { MainContainer } from "../../../Common/MainContainer/MainContainer";
import { SelectBox } from "../../../Common/SelectBox/SelectBox";
import { PageTitle } from '../../../Common/PageTitle/PageTitle';
import { Util } from "../../../../Util/util";
import { BulkUploadService } from '../BulkUpload.service';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import './UploadConfirmDialog.scss';

export class UploadConfirmDialog extends React.Component {

    state = {
        uploadResponse: {
            validationList: [],
            usersDetailsList: [],
            bulkUploadList: []
        }
    };

    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.setState({ uploadResponse: this.props.uploadResponse });
        }
    }

    render() {

        let errorList = this.state.uploadResponse.validationList.map((item, index) => {
            return <div className="list-item" key={index}>{item}</div>
        });

        let userList = null;

        let actList = null;

        if (this.state.uploadResponse.usersDetailsList) {

            userList = this.state.uploadResponse.usersDetailsList.map((item, index) => {
                return <div className="user-list-item" key={index}>
                    <Avatar>{item.firstName.charAt(0)}</Avatar>
                    <div className="user-name">{item.firstName + " " + item.lastName}</div>
                </div>
            });
        }

        if (this.state.uploadResponse.bulkUploadList) {

            actList = this.state.uploadResponse.bulkUploadList.map((item, index) => {
                return <div className="act-tile"> <b >{(index + 1) + ". " + item.title}</b>
                    <p>{item.description}</p>
                    <p>Club Points:{item.clubPoints} | Member Points:{item.memberPoints}</p>
                </div>
            });
        }



        return (
            <Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="upload-response-dialog-container">
                <DialogTitle>Upload Response</DialogTitle>
                <DialogContent>
                    <div className="content-container">
                        {this.state.uploadResponse.validationList.length > 0 &&
                            <div className="upload-response-container">
                                <div className="list-title">Error Lists</div>
                                <div className="error-list">
                                    {errorList}
                                </div>
                            </div>
                        }
                        {this.state.uploadResponse.usersDetailsList && this.state.uploadResponse.usersDetailsList.length > 0 &&
                            <div className="upload-response-container">
                                <div className="list-title">User Lists</div>
                                <div className="user-list">
                                    {userList}
                                </div>
                            </div>
                        }

                        {this.state.uploadResponse.bulkUploadList && this.state.uploadResponse.bulkUploadList.length > 0 &&
                            <div className="upload-response-container">
                                <div className="list-title">Activity Lists</div>
                                <div className="user-list">
                                    {actList}
                                </div>
                            </div>
                        }

                    </div>
                </DialogContent>
                <DialogActions>
                    {this.state.uploadResponse.validationList.length > 0 &&
                        <Button onClick={this.onOK.bind(this)} color="primary">
                            OK
                    </Button>
                    }
                    {this.state.uploadResponse.usersDetailsList && this.state.uploadResponse.usersDetailsList.length > 0 &&
                        <Button onClick={this.onConfirm.bind(this)} color="primary">
                            CONFIRM &amp; SAVE
                    </Button>
                    }

                    {this.state.uploadResponse.bulkUploadList && this.state.uploadResponse.bulkUploadList.length > 0 &&
                        <Button onClick={this.onConfirmAct.bind(this)} color="primary">
                            CONFIRM &amp; SAVE
                    </Button>
                    }


                </DialogActions>
            </Dialog>
        );
    }

    handleRequestClose() {
        this.props.onRequestClose(false);
        this.setState({
            uploadResponse: {
                validationList: [],
                usersDetailsList: [],
                bulkUploadList: []
            }
        })
    }

    onOK() {
        this.handleRequestClose();
    }

    onConfirm() {
        BulkUploadService.confirmUpload("true", this.state.uploadResponse.hash, "excelUpload")
            .then(data => {
                this.handleRequestClose();
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wring while confirming upload");
            });
    }

    onConfirmAct() {
        BulkUploadService.confirmUpload("true", this.state.uploadResponse.hash, "excelUploadAct")
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wring while confirming upload");
            });
    }
}