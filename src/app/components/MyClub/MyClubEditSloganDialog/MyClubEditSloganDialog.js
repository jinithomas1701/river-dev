import React from "react";
import {connect} from "react-redux";
import Button from 'material-ui/Button';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

class MyClubEditSloganDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            slogan: this.props.slogan
        };
    }
    
    /*componentDidUpdate(prevProps){
        if(!prevProps.slogan && !this.state.slogan && prevProps.slogan !== this.state.slogan){
            this.setState({slogan: this.props.slogan});
        }
    }*/
    
    /*static getDerivedStateFromProps(nextProps, prevState){
        const state = (!nextProps.slogan && !prevState.slogan)? {slogan: nextProps.slogan} : null;
        return state;
    }*/

    componentWillReceiveProps(nextProps){
        //console.log(nextProps);
        if((nextProps.slogan && !this.state.slogan)){
            this.setState({slogan: nextProps.slogan});
        }
        else if(nextProps.slogan && nextProps.slogan !== this.state.slogan){
            this.setState({slogan: nextProps.slogan});
        }
    }
    
    
    render(){
        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.onClose}
                className="myclub-editslogan-dialog">
                <DialogTitle>Update Club Slogan</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="inputMyclubSlogan"
                        name="slogan"
                        label="Update Club Slogan"
                        type="text"
                        value={this.state.slogan}
                        onChange={this.handleInputChange}
                        fullWidth
                        />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">Cancel</Button>
                    <Button onClick={this.onSubmit} color="primary">
                        {
                            (this.props.slogan) ? (
                                "Update Slogan"
                            ) : (
                                "Add Slogan"
                            )
                        }
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    
    onClose = () => {
        this.setState({slogan: ''});
        this.props.onClose();
    }

    onSubmit = () => {
        this.props.onSubmit(this.state.slogan);
    }
}

export default MyClubEditSloganDialog;