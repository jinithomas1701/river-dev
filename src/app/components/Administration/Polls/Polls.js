import React from "react";
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import {connect} from "react-redux";
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { Util } from '../../../Util/util';

// root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import { AddNewBtn } from '../../Common/AddNewBtn/AddNewBtn';
import { SearchWidget } from '../../Common/SearchWidget/SearchWidget';
import { BasicCard } from '../../Common/BasicCard/BasicCard';

// page dependency
import { storePollsList } from "./polls.actions"
import { PollsService } from "./polls.service"
// CSS
import './Polls.scss'

const mapStateToProps = (state) => {
    return {
        polls: state.PollsReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        storePollsList: (pollsList) => {
            dispatch(storePollsList(pollsList));
        }
    }
}

const PRIVILEGE_CREATE_POLL = "CREATE_POLL";
const PRIVILEGE_DELETE_POLL = "DELETE_POLL";

class Polls extends React.Component {
    pollsList = [];

    constructor(props) {
        super(props);
        this.loadPollsList();
    }

    render() {

        const pollCards = this.props.polls.pollsList.map((poll, index) => {
            const pollMeta = this.getPollMeta(poll);
            return <BasicCard
                        key={index}
                        hasDelete={Util.hasPrivilage(PRIVILEGE_DELETE_POLL)}
                        detail={pollMeta}
                        deleteCallback={this.onDeletePoll.bind(this)}
                        onCardClick={this.onPollClick.bind(this, pollMeta)}
                    />;
        });

        return ( 
			<Root role="admin">
				<MainContainer>
                    <PageTitle title="Polls" />
                    <div className="row">
                        <div className="col-md-12 listing-extras">
                            {Util.hasPrivilage(PRIVILEGE_CREATE_POLL) &&
                                <AddNewBtn callback={this.onAddnewClick.bind(this)}/>
                            }
                            <SearchWidget withButton={true} onSearch={this.onSearch.bind(this)} onClear={this.onClearSearch.bind(this)}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 flex-container">
                            {pollCards}
                        </div>
                        {this.props.polls.pollsList.length <= 0 &&
                            <div className="col-md-12 flex-container user-polls-listing">
                                    <div className="empty-content-container">No polls found</div>
                            </div> 
                        }
                    </div>
                </MainContainer>
			</Root>
        );
    }

    onSearch(searchKey) {
        const filteredPolls = this.filterItems(searchKey, this.pollsList);
        this.props.storePollsList(filteredPolls);
    }

    filterItems(query, array) {
        return array.filter((el) => {
            return el.title.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        })
    }

    onClearSearch() {
        this.props.storePollsList(this.pollsList);
    }

    onAddnewClick() {
        this.props.history.push("/admin/polls/detail/");
    }

    processPollsListResponse(pollsList) {
        this.props.storePollsList(pollsList);
    }
    
    getPollMeta(poll){
        return {
            name: poll.title,
            id: poll.id,
            image: "../../../../../resources/images/img/user-avatar.png",
            clubName: poll.clubName,
            createdDate: poll.createdDate,
            electionStatus: poll.electionStatus
        }
    }

    onDeletePoll(poll) {
        if (confirm("Do you want to delete this?")) {
            PollsService.deletePoll(poll.id)
            .then((data) => {
                this.processDeletePoll(poll);
            }).
            catch((error) => {
                if (error.network_error) {
                    riverToast.show(error.message);
                } else {
                    riverToast.show("Something went wrong")
                }
            })
        }
    }

    onPollClick(poll) {
        this.props.history.push("polls/detail/" + poll.id);        
    }

    loadPollsList = () => {
        PollsService.getPolls().
        then((data) => {
            if(data) {
                this.pollsList = data;
                this.processPollsListResponse(data);
            }
        }).
        catch((error) => {
            riverToast.show("Something went wrong", error);
        })
    }

    processDeletePoll(poll) {
        const pollsList = this.props.polls.pollsList;

        let deletedIndex = -1;
        this.props.polls.pollsList.forEach(function(pollObj, index) {
            if(pollObj.id == poll.id) {
                deletedIndex = index;
            }
        }, this);
        pollsList.splice(deletedIndex, 1);
        this.props.storePollsList(pollsList);
        riverToast.show("Poll deleted successfully");
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Polls);