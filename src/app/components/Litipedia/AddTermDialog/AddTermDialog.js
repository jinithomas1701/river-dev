import React, { Component } from 'react';
import Dialog, {
    DialogContent,
    DialogContentText,
    DialogActions,
    DialogTitle
} from 'material-ui/Dialog';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

// css
import "./AddTermDialog.scss";

// services
import { LitipediaServices } from '../Litipedia.services';
import { riverToast } from '../../Common/Toast/Toast';

class AddTermDialog extends Component {
    state = {
        keyword: '',
        definition: '',
        application: '',
        example: ''
    }

    componentDidUpdate(prevProps, prevState) {
        if(!prevProps.open && this.props.open) {
            if(this.props.term) {
                this.setState({
                    ...this.state,
                    keyword: this.props.term.keyword,
                    definition: this.props.term.definition,
                    application: this.props.term.application,
                    example: this.props.term.example
                })
            }
        }
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.handleRequestClose.bind(this)}
                className="add-term-dialog"
            >
                <DialogTitle>Add new term</DialogTitle>
                <DialogContent
                    className="add-term-dialog-content"
                >
                    <div className="fields-container">
                        <div className="field-container">
                            <TextField 
                                value={this.state.keyword}
                                onChange={this.handleChange('keyword')}
                                className="field"
                                placeholder="Keyword"
                                label="Keyword"
                            />
                        </div>
                        <div className="field-container">
                            <TextField 
                                value={this.state.definition}
                                multiline
                                onChange={this.handleChange('definition')}
                                className="field"
                                placeholder="Definition"
                                label="Definition"
                                rows= {3}
                            />
                        </div>
                        <div className="field-container">
                            <TextField 
                                value={this.state.application}
                                onChange={this.handleChange('application')}
                                className="field"
                                placeholder="Application"
                                label="Application"
                                multiline
                                rows= {3}
                            />
                        </div>
                        <div className="field-container">
                            <TextField 
                                value={this.state.example}
                                onChange={this.handleChange('example')}
                                className="field"
                                placeholder="Example"
                                label="Example"
                                multiline
                                rows= {3}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    {
                        this.props.term ?
                            <Button raised color="primary" onClick={this.onUpdateTerm.bind(this)}>Update</Button>
                        :
                            <Button raised color="primary" onClick={this.onAddTerm.bind(this)}>Add</Button>
                    }
                </DialogActions>                
            </Dialog>
        );
    }

    handleChange = (name) => (event) => {
        this.setState({ [name] : event.target.value })
    }

    handleRequestClose() {
        this.setState({
            ...this.state,
            keyword: '',
            definition: '',
            application: '',
            example: ''
        })
        this.props.onRequestClose();
    }

    onUpdateTerm() {
        const lTerm = {
            id: this.props.term.id,
            keyword: this.state.keyword.trim(),
            definition: this.state.definition,
            application: this.state.application,
            example: this.state.example
        }

        LitipediaServices.updateTerm(lTerm)
        .then((data) => {
            riverToast.show("Term updated successfully.");
            this.props.onAddTermSuccess();
            this.handleRequestClose();
        })
        .catch((error) => {
            riverToast.show("Something went wrong while updating the term");
        })
    }

    onAddTerm() {

        const lTerm = {
            keyword: this.state.keyword.trim(),
            definition: this.state.definition,
            application: this.state.application,
            example: this.state.example
        }

        LitipediaServices.addTerm(lTerm)
        .then((data) => {
            riverToast.show("Term added to litipedia successfully.");
            this.props.onAddTermSuccess();
            this.handleRequestClose();
        })
        .catch((error) => {
            riverToast.show("Something went wrong while adding a term");
        })
    }
}

export default AddTermDialog;