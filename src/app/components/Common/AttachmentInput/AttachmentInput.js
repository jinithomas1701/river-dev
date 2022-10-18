import React, {Component} from 'react';
import Icon from 'material-ui/Icon';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';

// custom component
import {Util} from '../../../Util/util';
import {riverToast} from '../../Common/Toast/Toast';

// css
import './AttachmentInput.scss';

class AttachmentInput extends Component{
    constructor(props){
        super(props);
        this.state = {};
        this.handleFileSelect = this.handleFileSelect.bind(this);
    }

    render(){
        const props = this.props;
        const emptyClass = props.attachments.length < 1 ? "empty" : "";
        return (
            <div className="attachment-input-wrapper">
                <ul className="attachment-list">
                    { this.getFileListTemplate(props.attachments) }
                    {
                        props.editable && <li className="btn-item">
                                <Button className={`btn-add-attachment ${emptyClass}`}>
                                    <label>
                                        <Icon>add</Icon>
                                        <span className="text">Add Attachment</span>
                                        <input type="file"
                                            onChange={this.handleFileSelect}
                                            hidden
                                            />
                                    </label>
                                </Button>
                            </li>
                    }
                </ul>
            </div>
        );
    }

    getFileListTemplate(fileList){
        const props = this.props;
        let template = props.editable ? null : <div className="no-item">{props.emptyText}</div>;
        
        if(fileList.length){
            template = fileList.map((file, index) => {
                return (
                    <li className="attachment-item" key={index}>
                        <span className="filename">{file.name}</span>
                        {
                            props.editable && <Button className="btn-delete" onClick={this.handleDeletion.bind(this, file)} fab><Icon>close</Icon></Button>
                        }
                    </li>
                );
            });
        }
        return template;
    }

    handleFileSelect(event){
        const fileList = event.target.files;
        if(fileList.length === 0){
            return;
        }
        let reader = new FileReader();
        let file = fileList[0];
        reader.onloadend = () => {
            this.onFileUpload(file);
        }

        reader.readAsDataURL(file);
    }

    onFileUpload(attachment){
        Util.base64ImageFromFile(attachment)
            .then( result => {
            const fileData = {
                name: attachment.name,
                content: result
            };
            this.props.onAddAttachment(fileData);
        })
            .catch(error => {
            throw(error);                        
        });
    }

    handleDeletion(file){
        this.props.onDeleteAttachment(file);
    }
}

AttachmentInput.defaultProps = {
    editable: false,
    emptyText: "No Attachments added yet."
};

AttachmentInput.propTypes = {
    attachments: PropTypes.array.isRequired,
    editable: PropTypes.bool,
    emptyText: PropTypes.string,
    onAddAttachment: PropTypes.func,
    onDeleteAttachment: PropTypes.func
};

export default AttachmentInput;