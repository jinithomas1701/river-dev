import React from 'react';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';


import {ContactCard} from "../../Common/ContactCard/ContactCard";

class ActionsDialog extends React.Component {

    render() {
        const actionsList = this.props.actionsList.map((action, index) => {
            var fullname = this.getProcessedName(action.fullname);            
            return <div key={index} className="contact-card-wrapper">
                        <ContactCard 
                                name={fullname}
                                email={action.email}
                                image={action.avatar || "../../../../../resources/images/img/user-avatar.png"}
                            />
                    </div>
        });

        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.handleRequestClose.bind(this)}
                className="actions-dialog-container"
            >
                <DialogTitle>Responded By</DialogTitle>
                <DialogContent className="custom-scroll">
                    {/* <div className="action-title">Liked By</div> */}
                    {actionsList}
                </DialogContent>
                {/* <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)} color="default">
                        Cancel
                    </Button>
                    <Button onClick={this.onPostStatus.bind(this)} color="primary">
                        Post
                    </Button>
                </DialogActions> */}
            </Dialog>
        );
    }

    handleRequestClose() {
        this.props.onRequestCloseActionsList();
    }

    getProcessedName(name) {
        return name.replace(/\snull(\s|$)/, " ");
    }
}

export default ActionsDialog;