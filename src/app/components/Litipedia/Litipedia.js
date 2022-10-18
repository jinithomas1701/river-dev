import React, { Component } from 'react';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Dock from 'react-dock';

// root
import { Root } from "../Layout/Root";

// custom component
import { Util } from "../../Util/util";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { riverToast } from '../Common/Toast/Toast';

// dialog
import AddTermDialog from './AddTermDialog/AddTermDialog';

// dock
import TermDetailDock from './TermDetailDock/TermDetailDock';

// services
import { LitipediaServices } from './Litipedia.services';

// actions
import { loadAllTerms,
         pushMoreTerms,
         loadRecentTerms,
         loadMostViewedTerms
        } from './Litipedia.actions';

// css
import './Litipedia.scss';

const mapStateToProps = (state) => {
    return {
        litipedia: state.LitipediaReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadAllTerms: (list) => {
            dispatch(loadAllTerms(list));
        },
        pushMoreTerms: (list) => {
            dispatch(pushMoreTerms(list))
        },
        loadRecentTerms: (list) => {
            dispatch(loadRecentTerms(list))
        },
        loadMostViewedTerms: (list) => {
            dispatch(loadMostViewedTerms(list))
        }
    }
}

const LPEDIA_ADMIN = "LPEDIA_ADMIN";

class Litipedia extends Component {
    state = {
        isDockVisible: false,
        currentTermId: '',
        currentTerm: '',
        termDialog: false,
        pageNo: 0,
        loadMoreBtn: true,
        searchText: '',
        searchMode: false,
        wordOfTheDay: ''
    }

    componentDidMount() {
        this.getAllTerms(0);
        this.getMostViewed();
        this.getRecent();
        this.getWordOfTheDay();
    }

    render() {
        const termList = this.props.litipedia.termsList ? Object.entries(this.props.litipedia.termsList).map(([key, value], index) => {
            return  <div key={index} className="term-alpha">
                        <div className="alphabet">
                            <div className="backline"></div>
                            <div className="alphabet-letter">{key}</div>
                        </div>
                        <div className="terms-list">
                            {
                                value.map((term, index) => {
                                    return  <div
                                                key={index}
                                                className={"term" + (this.state.currentTermId == term.id ? " active" : "")}
                                                onClick={this.onTermClick.bind(this, term.id, term)}
                                            >
                                                <div className="term-keyword">{term.keyword}</div>
                                            </div>
                                })
                            }
                        </div>
                    </div>
        }) : false;

        const recentTermsList = this.props.litipedia.recentTerms ? this.props.litipedia.recentTerms.map((term, index) => {
            return  <div
                        key={index}
                        className={"term" + (this.state.currentTermId == term.id ? " active" : "")}
                        onClick={this.onTermClick.bind(this, term.id, term)}
                    >
                        <div className="term-keyword">{term.keyword}</div>
                    </div>
        }) : false;

        const mostViewedTermsList = this.props.litipedia.mostViewedTerms ? this.props.litipedia.mostViewedTerms.map((term, index) => {
            return  <div
                        key={index}
                        className={"term" + (this.state.currentTermId == term.id ? " active" : "")}
                        onClick={this.onTermClick.bind(this, term.id, term)}
                    >
                        <div className="term-keyword">{term.keyword}</div>
                    </div>
        }) : false;

        return (
            <Root>
                <MainContainer>
                    <PageTitle title="Litipedia" />
                    <div className="litipedia-container">
                        <div className="litipedia-extras">
                            <div className="search-text-container">
                                <Icon className="search-icon search-box-icon">search</Icon>
                                <input
                                    placeholder="Search Terms"
                                    className="search-text"
                                    value={this.state.searchText}
                                    onChange= { (event) => {this.setState({ searchText: event.target.value })} }
                                    onKeyPress = {this.onKeyPress.bind(this)}
                                />
                                {
                                    (this.state.searchText || this.state.searchMode) &&
                                        <Icon className="clear-search-icon search-box-icon" onClick={this.onClearSearch.bind(this)}>clear</Icon>
                                }
                            </div>
                            {
                                Util.hasPrivilage(LPEDIA_ADMIN) &&
                                    <div className="add-new-btn-container">
                                        <Button
                                            color="primary"
                                            raised
                                            className="add-new-btn"
                                            onClick={this.onToggleTermDialog.bind(this)}
                                        >
                                            Add New
                                        </Button>
                                    </div>
                            }
                        </div>
                        {
                            !this.state.searchMode &&
                                <div className="recent-most-container">
                                    {
                                        recentTermsList.length > 0 &&
                                            <div className="recents-container container">
                                                <div className="title">Recent Terms</div>
                                                <div className="terms-list">
                                                    {recentTermsList}
                                                </div>
                                            </div>
                                    }
                                    {
                                        mostViewedTermsList.length > 0 &&
                                            <div className="most-container container">
                                                <div className="title">Most Viewed Terms</div>
                                                <div className="terms-list">
                                                    {mostViewedTermsList}
                                                </div>
                                            </div>
                                    }
                                </div>
                        }
                        <div className="litipedia-list">
                            {termList}
                        </div>
                        <div className="bottom-container">
                            {
                                this.state.loadMoreBtn &&
                                    <div className="load-more-btn" onClick={this.onLoadMore.bind(this)}>Load More</div>
                            }
                        </div>
                    </div>
                </MainContainer>

                {
                    this.state.isDockVisible &&
                        <Dock
                            zIndex={200}
                            position='right'
                            isVisible={this.state.isDockVisible}
                            dimMode="none"
                            defaultSize={.6}
                        >
                            {
                                (this.state.currentTermId && this.state.currentTerm) &&
                                    <TermDetailDock
                                        term={this.state.currentTerm}
                                        termId={this.state.currentTermId}
                                        closeDock={this.onCloseDock.bind(this)}
                                        onDeleteSuccess={this.onDeleteTermSuccess.bind(this)}
                                        onEditTerm={this.onEditTerm.bind(this)}
                                    />                                        
                            }
                        </Dock>
                }

                {/* create dialog */}
                <AddTermDialog
                    open={this.state.termDialog}
                    onRequestClose={this.onToggleTermDialog.bind(this)}
                    onAddTermSuccess={this.onAddTermSuccess.bind(this)}
                    term={this.state.currentTerm}
                />
            </Root>
        );
    }

    reloadAll() {
        this.getAllTerms(0);
        this.getMostViewed();
        this.getRecent();
    }

    onKeyPress(event) {
        if(event.key == 'Enter') {
            this.setState({ searchMode : true });
            this.getAllTerms(0, this.state.searchText);
        }
    }

    onTermClick(termId, currentTerm) {
        if(this.state.currentTermId == termId) {
            this.setState({ 
                ...this.state,
                currentTermId: '',
                currentTerm: '',
                isDockVisible: false
            })
        } else {
            this.setState({
                ...this.state,
                currentTermId: termId,
                currentTerm: currentTerm,
                isDockVisible: true
            })
        }
    }

    onToggleTermDialog() {
        const flag = !this.state.termDialog;
        this.setState({ termDialog: flag });
    }

    onCloseDock() {
        this.setState({
            ...this.state,
            isDockVisible: false,
            currentTerm: '',
            currentTermId: ''
        })
    }

    onDeleteTermSuccess(term) {
        this.onCloseDock();
        this.reloadAll();
    }

    onClearSearch() {
        this.setState({
            ...this.state,
            searchText: '',
            searchMode: false
        });
        this.getAllTerms(0);
    }

    onLoadMore() {
        this.getAllTerms(this.state.pageNo + 1);
    }

    onAddTermSuccess() {
        this.reloadAll();
    }

    onEditTerm(term) {
        this.setState({ currentTerm: term }, () => { this.onToggleTermDialog() });
    }

    getRecent() {
        LitipediaServices.getRecent()
        .then((data) => {
            this.props.loadRecentTerms(data);
        })
        .catch((error) => {
            riverToast.show("Something went wrong while fetching recent terms");
        })
    }

    getMostViewed() {
        LitipediaServices.getMostViewed()
        .then((data) => {
            this.props.loadMostViewedTerms(data);
        })
        .catch((error) => {
            riverToast.show("Something went wrong while fetching most viewed");
        })
    }

    getWordOfTheDay() {
        LitipediaServices.getWordOfTheDay()
        .then((data) => {
            // this.props.loadMostViewedTerms(data);
        })
        .catch((error) => {
            riverToast.show("Something went wrong while fetching word of the day");
        })
    }

    getAllTerms(pageNo = 1, searchTerm = '') {
        const urlQuery = '?key=' + searchTerm + '&page=' + pageNo;

        LitipediaServices.getAllTermsList(urlQuery)
        .then((data) => {
            if(data && Object.getOwnPropertyNames(data).length !== 0) {
                if(pageNo == 0) {
                    this.props.loadAllTerms(data);
                } else {
                    this.props.pushMoreTerms(data);
                }                
                this.setState({
                    pageNo: pageNo
                });
            } else {
                this.setState({
                    ...this.state,
                    loadMoreBtn: false
                });
                pageNo !== 0 && riverToast.show('No more terms to show');
            }
        })
        .catch((error) => {
            riverToast.show('Something went wrong while fetching terms');
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Litipedia)