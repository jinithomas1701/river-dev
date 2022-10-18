import React from "react";
import { render } from 'react-dom';
import Snackbar from 'material-ui/Snackbar';
import Slide from 'material-ui/transitions/Slide';
import {Util} from '../../../Util/util';
import '../../../../../node_modules/react-toastify/dist/ReactToastify.min.css';
import './Toast.scss';

const toast =  {
    show: (msg) => {
        const context = Util.getToastContext();
        Toast.handleToast(true, msg, context);
    },
    hide: () => {
        const context = Util.getToastContext();
        Toast.handleToast(false, "", context);
    }
}

export const riverToast = toast;
export class Toast extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            msg: ""
        };
    }

    static handleToast(isShow, msg, context) {
        if (context) {
            context.setState({ open: isShow, msg: msg });
        }
    }
    

    componentDidMount() {
        Util.setToastContext(this);
        // supplyContext(this);
    }

    handleRequestClose = () => {
        context.setState({ open: false, msg: "" });
    };

    render() {
        return (
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={this.state.open}
                autoHideDuration={3000}
                onRequestClose={toast.hide}
                SnackbarContentProps={{
                'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.state.msg}</span>}
            />
        )
    }
}