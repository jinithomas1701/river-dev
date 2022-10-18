import React, { Component } from "react";
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import { Util } from "../../../../Util/util";
import LoadedButton from "../../../Common/LoadedButton/LoadedButton";
import moment from "moment";
import "./PreviewDetailDialog.scss";
const classes = Util.overrideCommonDialogClasses();
class PreviewDetailDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {

        return (
            <Dialog classes={classes} className='locationPreviewDialog-wrapper' open={this.props.open} onRequestClose={this.props.onClose}>
                <DialogTitle className='header'>
                    Location Preview
                </DialogTitle>
                <DialogContent className="content">
                    <div className="preview-wrapper">
                        <table className="each-preview-wrapper">
                            <tbody>
                                <tr>

                                    <td className="sub-head">Start Time</td>
                                    <td className="sub-head">End Time</td>
                                    <td className="sub-head">Available</td>
                                </tr>
                                {this.props.meetingPreview.map((eachDetail, index) => {
                                    return <tr key={index} className="each-member-wrap">
                                        <td className="start-time">
                                            {moment(eachDetail.startTime).format('DD MMM YYYY hh:mm')}
                                        </td>
                                        <td className="end-time">
                                            {moment(eachDetail.endTime).format('DD MMM YYYY hh:mm')}
                                        </td>

                                        <td className="availability">
                                            <span> {eachDetail.availability === true ? "Yes" : "No"}</span>
                                        </td>
                                    </tr>
                                })

                                }
                            </tbody>
                        </table>
                    </div>

                </DialogContent>
                <DialogActions className="submit-wrapper">
                    <LoadedButton className=" btn-cancel cancel-button" onClick={this.props.onClose}>Cancel</LoadedButton>
                </DialogActions>
            </Dialog>
        )
    }
}
export default PreviewDetailDialog 