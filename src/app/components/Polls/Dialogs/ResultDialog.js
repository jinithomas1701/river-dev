/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';

import ResultOptionComponent from './ResultOptionComponent/ResultOptionComponent';

// css
import "./ResultDialog.scss"

class ResultDialog extends React.Component {

    constructor(props) {
        super(props);

    }
    

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            
        }
    }
    

    render() {
        const totalCount = this.props.poll.totalVotes;

        const nomineesList = this.props.poll.nominees ? this.props.poll.nominees.map((nominee, index) => {
            return <ResultOptionComponent 
                        nominee = {nominee}
                        progress = {Math.round(nominee.voteCount * 100 / totalCount)}                        
                    />
        }) : "No Nominees";

        return (
            <div>
                <Dialog open={this.props.open} onRequestClose={this.handleRequestClose}>
                    <DialogTitle>{"Result for the poll " + this.props.poll.title + " is"}</DialogTitle>
                    <DialogContent className="result-dialog">
                        <div className="description">{this.props.poll.description}</div>
                        <div className="poll-result-container">
                            {
                                nomineesList.length > 0 ?
                                    nomineesList
                                :
                                    <div className="empty-content-container">No Nominees</div>                                    
                            }
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleRequestClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }


    handleRequestClose = () => {
        this.props.closeDialogCallback("Result");
    };
}

export default ResultDialog;