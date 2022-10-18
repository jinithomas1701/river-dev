import React, { Component } from 'react';
import { Dialog } from 'material-ui';
import { DialogTitle } from 'material-ui';
import { DialogContent } from 'material-ui';
import Filters from '../../CommonComponents/Filters';
import AdminAnnouncementCreateProblemTile from './AdminAnnouncementCreateProblemTile';
import { Util } from "../../../../Util/util";
//CSS
import './AdminAnnouncementCreateProblemSelectDialog.scss';
const classes = Util.overrideCommonDialogClasses();
class AdminAnnouncementCreateProblemSelectDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            statusBy: "ALL",
            clubBy: "ALL"
        }
    }

    render() {
        const props = this.props;
        const problemList = this.props.problemList;
        return (
            <Dialog classes={classes} className='problem-dialog-wrap' maxWidth="md" size="md" open={props.open} onRequestClose={this.handleClose}>
                <DialogTitle className='header'>
                    <p>
                        Select Existing Problem
                    </p>
                </DialogTitle>
                <DialogContent className='content'>
                    <div className='filter-wrap'>
                        <Filters
                            filterStatusList={[]}
                            filterClubByList={[]}
                            onFilterChange={this.handleProblemFilterChange}
                        />
                    </div>
                    {problemList &&
                        problemList.length > 0 ?
                        problemList.map((element, id) => {
                            if (!element.announced) {
                                return (
                                    <AdminAnnouncementCreateProblemTile
                                        onSelect={this.props.onSingleProblemSelect}
                                        values={element}
                                        key={id}
                                    />
                                )
                            }
                        }
                        ) :
                        <div className='no-input'>
                            No Problems Found
                        </div>
                    }
                </DialogContent>
            </Dialog>
        )
    }
    handleProblemFilterChange = (config) => {
        this.setState({
            statusBy: config.status,
            clubBy: config.clubBy,
            searchText: config.search
        });
        this.props.handleProblemFilterChange(config.search);
    }

    handleClose = () => {
        this.props.onClose();
    }
}

export default AdminAnnouncementCreateProblemSelectDialog