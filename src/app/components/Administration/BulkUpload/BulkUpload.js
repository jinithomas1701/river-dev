import React from "react";
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import moment from "moment";


//root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import { SelectBox } from "../../Common/SelectBox/SelectBox";
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { Util } from '../../../Util/util';

import { BulkUploadService } from "./BulkUpload.service";
import { UploadConfirmDialog } from "./UploadConfirmDialog/UploadConfirmDialog";

import "./BulkUpload.scss";

export default class BulkUpload extends React.Component {
    state = {
        selectedFile: null,
        selectedFileAct:null,
        responseModal: false,
        uploadResponse: {}
    };
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Bulk Upload" />
                    <div className="row bulk-upload">
                        <div className="col-md-6">
                            <div className="content-container extra-margin-b">
                                <div className="page-title-section">
                                    <h5>Upload Users</h5>
                                </div>
                                <div className="page-content-section">
                                    <div className="row">
                                        <div className="col-md-12 input-container">
                                            <div className="file-select-container">
                                                <input type="file" id="excel-file" onChange={(e) => {
                                                    this.onExcelFileChange(e);
                                                }} />
                                                <label htmlFor="excel-file">
                                                    <Button raised component="span" color="primary">Select Excel</Button>
                                                </label>
                                                {this.state.selectedFile &&
                                                    <div className="fileText">{this.state.selectedFile.name}</div>
                                                }
                                            </div>
                                            <div className="download-template-container">
                                                <div className="download-text"><div className="download-link" onClick={this.onDownloadTemplate.bind(this, "user")}>Click Here</div> to download template file.</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 input-container">
                                            {this.state.selectedFile &&
                                                <Button raised component="span" color="primary" onClick={this.onUpload.bind(this)}>Upload &amp; Validate</Button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="content-container extra-margin-b">
                                <div className="page-title-section">
                                    <h5>Upload Activities</h5>
                                </div>
                                <div className="page-content-section">
                                    <div className="row">
                                        <div className="col-md-12 input-container">
                                            <div className="file-select-container">
                                                <input type="file" id="excel-file-act" onChange={(e) => {
                                                    this.onExcelFileChangeAct(e);
                                                }} />
                                                <label htmlFor="excel-file-act">
                                                    <Button raised component="span" color="primary">Select Excel</Button>
                                                </label>
                                                {this.state.selectedFileAct &&
                                                    <div className="fileText">{this.state.selectedFileAct.name}</div>
                                                }
                                            </div>
                                            <div className="download-template-container">
                                                <div className="download-text"><div className="download-link" onClick={this.onDownloadTemplate.bind(this, "activity")}>Click Here</div> to download template file.</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 input-container">
                                            {this.state.selectedFileAct &&
                                                <Button raised component="span" color="primary" onClick={this.onUploadAct.bind(this)}>Upload &amp; Validate</Button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </MainContainer>
                <UploadConfirmDialog
                    open={this.state.responseModal}
                    uploadResponse={this.state.uploadResponse}
                    onRequestClose={this.statusDialogVisibility.bind(this)} />
            </Root>
        );
    }

    statusDialogVisibility(visibility) {
        this.setState({ responseModal: visibility });
        if (!visibility) {
            this.setState({ selectedFile: null });
        }
    }

    onExcelFileChange(event) {
        this.setState({ selectedFile: event.target.files[0] });
    }

    onExcelFileChangeAct(event) {
        this.setState({ selectedFileAct: event.target.files[0] });
    }

    onDownloadTemplate(scope) {
        BulkUploadService.downloadTemplate(scope)
        .then((data) => {
            Util.downloadFile(data, "template", "xls");
        })
        .catch(error => {
            riverToast.show(error.status_message || "Something went wrong while downloading template")
        })
    }

    onUpload() {
        // const reader = new FileReader();
        // reader.onload = this.uploadTask;
        // reader.readAsText(this.state.selectedFile);
        const formData = new FormData();
        formData.append('file', this.state.selectedFile);
        BulkUploadService.uploadExcel(formData,"excelValidate")
            .then(data => {
                if (data.usersDetailsList.length <= 0 && data.validationList.length <= 0) {
                    riverToast.show("Invalid file!");
                } else {
                    this.setState({ uploadResponse: data });
                    this.setState({ responseModal: true });
                }
            })
            .catch(error => {
                riverToast.show("Something went wrong while uploading file.");
            });
    }

    onUploadAct() {
        // const reader = new FileReader();
        // reader.onload = this.uploadTask;
        // reader.readAsText(this.state.selectedFile);
        const formData = new FormData();
        formData.append('file', this.state.selectedFileAct);
        BulkUploadService.uploadExcel(formData,"excelValidateAct")
            .then(data => {
                if (data.bulkUploadList.length <= 0 && data.validationList.length <= 0) {
                    riverToast.show("Invalid file!");
                } else {
                    this.setState({ uploadResponse: data });
                    this.setState({ responseModal: true });
                }
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong while uploading file.");
            });
        this.state.selectedFileAct=null;

    }
}