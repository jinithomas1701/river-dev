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

// css
import "./PollingDialog.scss"

class PollingDialog extends React.Component {

    state = {
        nominees: [],
        candidateId: ""
    }

    constructor(props) {
        super(props);
    }
    

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.open && this.props.open) {
            this.state.nominees = this.props.poll.nominees || [];
        }
    }
    

    render() {

        const nomineesList = (this.props.poll.nominees) ? this.props.poll.nominees.map((nominee, index) => {
            return <FormControlLabel key={index} value={nominee.user.userId.toString()} control={<Radio />} label={nominee.user.fullname} />
        }) : false;

        return (
            <div>
                <Dialog open={this.props.open} onRequestClose={this.handleRequestClose}>
                    <DialogTitle>{"Mark your vote for " + this.props.poll.title}</DialogTitle>
                    <DialogContent>
                        <FormControl component="fieldset" required>
                            <FormLabel component="candidates">Candidates</FormLabel>
                            {
                                (this.props.poll.nominees && this.props.poll.nominees.length > 0) &&
                                <RadioGroup
                                    aria-label="Candidates"
                                    name="candidates"
                                    value={this.state.candidateId}
                                    onChange={this.handleChange}
                                >
                                    {nomineesList}
                                </RadioGroup>
                            }
                            {/* <FormHelperText>You can display an error</FormHelperText> */}
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleRequestClose} color="primary">
                            Cancel
                        </Button>
                        {
                            (this.props.poll.nominees && this.props.poll.nominees.length > 0) &&
                                <Button onClick={this.markVote} color="primary" autoFocus>
                                    Vote
                                </Button>
                        }
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    markVote = () => {
        this.props.onVoteCallBack(parseInt(this.state.candidateId));
    };

    handleRequestClose = () => {
        this.props.closeDialogCallback("Poll");
    };

    handleChange = (event, value) => {
        this.setState({ candidateId: value });
    };
}

export default PollingDialog;