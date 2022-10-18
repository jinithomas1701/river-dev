import React, { Component } from "react";
import { Doughnut } from 'react-chartjs-2';
import Radio from 'material-ui/Radio';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
//------------------------------internal components-----------------------------
import LoadedButton from "../../Common/LoadedButton/LoadedButton";
import { Util } from "../../../Util/util";
import AvatarInfo from "../../Common/AvatarInfo/AvatarInfo";
//css
import "./AttendenceDialog.scss";
import { riverToast } from "../../Common/Toast/Toast";
const classes = Util.overrideCommonDialogClasses();
class AttendenceDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            presentCount: 0,
            absenteesWithReasonCount: 0,
            absenteesCount: 0,
            memberDetail: []
        }
    }
    componentDidMount() {
        this.init();

    }
    init = () => {
        let memberDetail = this.props.clubMemebersDetails;
        this.setState({ memberDetail: memberDetail });
        this.calculateAttendenceCount(memberDetail);
    }
    componentDidUpdate(prevProps) {
        const currProps = this.props;
        if (!prevProps.open && currProps.open) {
            this.init();
        }

    }
    render() {
        const radioabauttonDisable = this.props.meeting.status === "CON" || !this.props.hasPrivilageToTakeAttendance;
        let attendenceChartData = {
            labels: ["Present", "Absent With Reason", "Absent"],
            datasets: [
                {
                    data: [
                        this.state.presentCount,
                        this.state.absenteesWithReasonCount,
                        this.state.absenteesCount
                    ],
                    backgroundColor: ['#22bca8', '#1c9fb0', '#d35353'],
                    hoverBackgroundColor: ['#1C998C', '#157885', '#bc3e3e']
                }
            ]
        }
        return (
            <Dialog classes={classes} className='attendence-dialog-wrap' open={this.props.open} onRequestClose={this.props.onClose}>
                <DialogTitle className='header'>
                    {
                        radioabauttonDisable ? "Attendence Report" : "Mark Attendance"
                    }
                </DialogTitle>
                <DialogContent className="content">
                    <div className="club-member-attendence">
                        <table className="attendence-wrapper">
                            <tbody>
                                <tr>
                                    <th></th>
                                    <td className="sub-head">PRESENT</td>
                                    <td className="sub-head">ABSENT WITH REASON</td>
                                    <td className="sub-head">ABSENT</td>
                                </tr>
                                {this.state.memberDetail.map(memberDetail => {
                                    return <tr key={memberDetail.id} className="each-member-wrap">
                                        <th>
                                            <AvatarInfo
                                                title={memberDetail.name}
                                                subText={memberDetail.email}
                                                avatar={memberDetail.avatar}
                                            />
                                        </th>
                                        <td className="radio-button">
                                            <Radio
                                                value="PRE"
                                                checked={memberDetail.status === "PRE"}
                                                disabled={radioabauttonDisable}
                                                onChange={(event) => { this.handleRadioButtonChange(event, memberDetail.id) }}
                                            />
                                        </td>
                                        <td className="radio-button">
                                            <Radio
                                                value="AVR"
                                                checked={memberDetail.status === "AVR"}
                                                disabled={radioabauttonDisable}
                                                onChange={(event) => { this.handleRadioButtonChange(event, memberDetail.id) }}
                                            />
                                        </td>
                                        <td className="radio-button">
                                            <Radio
                                                value="ABS"
                                                checked={memberDetail.status === "ABS"}
                                                disabled={radioabauttonDisable}
                                                onChange={(event) => { this.handleRadioButtonChange(event, memberDetail.id) }}
                                            />
                                        </td>
                                    </tr>
                                })

                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="attendence-graph-wrap">
                        <h6 className="attendence-heading">ATTENDANCE</h6>
                        <div className="attendence-graph">
                            <Doughnut
                                data={attendenceChartData}
                                width={200}
                                height={200}
                                options={{
                                    cutoutPercentage: 75,
                                    maintainAspectRatio: false,
                                    legend: { display: false }
                                }}
                            />
                        </div>
                        <table className="table-meta">
                            <tbody>
                                <tr>
                                    <td>{this.state.presentCount}</td>
                                    <th>Attended</th>
                                </tr>
                                <tr>
                                    <td>{this.state.absenteesCount}</td>
                                    <th>Leave</th>
                                </tr>
                                <tr>
                                    <td>{this.state.absenteesWithReasonCount}</td>
                                    <th>Absent With Reason</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </DialogContent>
                <DialogActions className="submit-wrapper">
                    <LoadedButton className="btn-default btn-cancel" onClick={this.props.onClose}>Cancel</LoadedButton>
                    {radioabauttonDisable === false &&
                        <LoadedButton className="btn-primary btn-cancel" onClick={this.handleAttendenceSubmit}>Submit</LoadedButton>
                    }
                </DialogActions>
            </Dialog>
        )
    }

    handleAttendenceSubmit = () => {

        let targetDetail = [];

        this.state.memberDetail.map(detail => {
            let reason = "";
            if (detail.status === "PRE") {
                reason = "Present"
            }
            else if (detail.status === "AVR") {
                reason = "Absent with reason"
            }
            else if (detail.status === "ABS") {
                reason = "Absent"
            }
            else {
                riverToast.show("please enter a attendance status");
                return;
            }
            targetDetail.push({
                id: detail.id,
                name: detail.name,
                avatar: detail.avatar,
                status: detail.status,
                reason: reason
            });
        })

        targetDetail = {
            attendees: targetDetail
        }
        this.props.attendenceSubmit(targetDetail);
    }
    handleRadioButtonChange = (event, id) => {
        const memberDetail = [...this.state.memberDetail];
        let value = event.target.value;
        let index;
        let userDetail = memberDetail.filter((memberDetail, i) => {
            if (memberDetail.id === id) {
                index = i;
                return memberDetail
            }
        })[0];
        let updatedUserDetail = { ...userDetail, status: value }
        memberDetail.splice(index, 1)
        memberDetail.splice(index, 0, updatedUserDetail);

        this.setState({ memberDetail });
        this.calculateAttendenceCount(memberDetail);
    }
    calculateAttendenceCount = (memberDetail) => {
        let presentCount = 0, absenteesWithReasonCount = 0, absenteesCount = 0;
        memberDetail.map(eachmember => {
            if (eachmember.status === "PRE") {
                presentCount += 1;
            }
            else if (eachmember.status === "AVR") {
                absenteesWithReasonCount += 1;
            }
            else if (eachmember.status === "ABS") {
                absenteesCount += 1;
            }
        })
        this.setState({ presentCount, absenteesWithReasonCount, absenteesCount });
    }
}
export default AttendenceDialog




