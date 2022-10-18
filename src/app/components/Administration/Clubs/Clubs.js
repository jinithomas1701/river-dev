import React from "react";
import {connect} from "react-redux";

//root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import { AddNewBtn } from '../../Common/AddNewBtn/AddNewBtn';
import { SearchWidget } from '../../Common/SearchWidget/SearchWidget';
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { Util } from '../../../Util/util';
import { ClubCard } from './ClubCard/ClubCard';
import {searchKeyChange, clubListChange} from "./Clubs.actions";

import {ClubsService} from "./Clubs.service";

const mapStateToProps = (state) => {
    return {
        clubs: state.ClubsReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        searchKeyChange: (key) => {
            dispatch(searchKeyChange(key));
        },
        clubListChange: (list) => {
            dispatch(clubListChange(list));
        }
    }
};

const PRIVILEGE_CREATE_CLUB = "CREATE_CLUB";

class Clubs extends React.Component {

    clubList = [];
    constructor(props) {
        super(props);
        // props.clubListChange(this.clubList);
        this.loadClubs();
    }

    render() {
        const clubCards = this.props.clubs.clubList.map((club, index) => {
            return <ClubCard
                        key={index}
                        club={club}
                        deleteCallback={this.onDeleteClub.bind(this)}
                        activateCallback={this.activateCallback.bind(this)}
                        onClubClick={this.onClubClick.bind(this, club)}
                    />;
        });

        return ( 
			<Root role="admin">
				<MainContainer>
                    <PageTitle title="Club" />
                    <div className="row">
                        <div className="col-md-12 listing-extras">
                            {Util.hasPrivilage(PRIVILEGE_CREATE_CLUB) &&
                                <AddNewBtn callback={this.onAddnewClick.bind(this)}/>
                            }
                            <SearchWidget withButton={true} onSearch={this.onSearch.bind(this)} onClear={this.onClearSearch.bind(this)}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 flex-container">
                            {clubCards.length <= 0 && 
                                <div className="empty-content-container">No clubs found</div>
                            }
                            {clubCards}
                        </div>
                    </div>
                </MainContainer>
			</Root>
        );
    }

    onSearch(searchKey) {
        const filteredClubs = this.filterItems(searchKey, this.clubList);
        this.props.clubListChange(filteredClubs);
    }

    filterItems(query, array) {
        return array.filter((el) => {
            return el.clubName.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        })
      }
          

    onClearSearch() {
        this.props.clubListChange(this.clubList);
    }

    onAddnewClick() {
        this.props.history.push("/admin/clubs/detail");
    }

    processDeleteClub(club) {
        const clubList = this.props.clubs.clubList;
        let deletedIndex = -1;
        this.props.clubs.clubList.forEach((clubObj, index) => {
            if (clubObj.id === club.id) {
                deletedIndex = index;
            }
        }, this);
        clubList.splice(deletedIndex, 1);
        this.props.clubListChange(clubList);
        riverToast.show("Club deleted successfully");
    }

    onDeleteClub(club) {
        if (confirm("This will remove all members from the club?\nDo you want to delete this Club?")) {
            ClubsService.deleteClubTask(club.id)
                .then((data) => {
                    //this.processDeleteClub(club);
                    this.loadClubs();
                })
                .catch((error) => {
                    if (error.network_error) {
                        riverToast.show(error.message);
                    }
                });
        }
    }

    activateCallback(club){
        if (confirm("Are you sure to activate this club?")) {
            ClubsService.activateClubTask(club.id)
                .then((data) => {
                    this.loadClubs();
                })
                .catch((error) => {
                    riverToast.show(error.message || "Something went wrong while activating the club.");
                });
        }
    }

    onClubClick(club) {
        this.props.history.push("/admin/clubs/detail/"+club.id);
    }

    loadClubs() {
        ClubsService.getClubsTask()
            .then((data) => {
                if (data && data.length > 0) {
                    this.clubList = data;
                    this.props.clubListChange(data);
                } else {
                    this.props.clubListChange([]);
                }
                
            })
            .catch((error) => {
                riverToast.show("Something went wrong while loading clubs.");
            });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Clubs);