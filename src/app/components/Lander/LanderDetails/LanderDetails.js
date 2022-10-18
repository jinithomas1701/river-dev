import React, { Component } from 'react';
import {connect} from "react-redux";
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import grey from 'material-ui/colors/grey';
import teal from 'material-ui/colors/teal';
import { Carousel } from 'react-responsive-carousel';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import moment from 'moment';

// root component
import { Root } from "../../Layout/Root";

// custom component
import { Util } from "../../../Util/util";
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from "../../Common/PageTitle/PageTitle";
import { Toast, riverToast } from "../../Common/Toast/Toast";
import { LanderDetailsService } from "./LanderDetails.service";
import LanderNav from "../LanderNav/LanderNav";
import LanderHeader from "../LanderHeader/LanderHeader";
import LanderData from "../LanderData";

// css
import "./LanderDetails.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css";

let theme = createMuiTheme({
    palette: {
        primary: teal,
        secondary: grey,
    },
    typography: {
        //Use the system font instead of the default Roboto font.
        fontFamily: [
            'Oswald',
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        fontSize: 10,
        htmlFontSize: 8
    },
    appBar:{
        height:10
    },
    overrides: {
        MuiButton: {
            root: {
                background: "#000",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 300,
                letterSpacing: "0.3rem"
            }
        }
    }
});

class LanderDetails extends React.Component {
    constructor(props){
        super(props);
        this.pageId = "";
        this.state = {
            clubDetails: "",
            memberDetails: [],
        };
        this.tempData = "";
    }

    render(){

        const scheduleList=this.getScheduleTemplate();

        return (
            <MuiThemeProvider theme={theme}>
                <div className="full-width landerdetails-wrapper">
                    <Toast />
                    <div className="main-wrapper">
                        <div className="content-wrapper">
                            <LanderHeader history={this.props.history} hideHeader={true} />
                            <div className="banner-group">
                                { this.getCarouselTemplate() }
                                <div className="banner-info">
                                    <span className="banner-clubname">{this.state.clubDetails.clubName}</span>
                                    <div className="banner-clubpoints">
                                        <Icon>stars</Icon>{this.state.clubDetails.clubPoints}
                                    </div>
                                </div>
                            </div>
                            <div className="nav-group">
                                <div className="content">
                                    <LanderNav />
                                </div>
                            </div>
                            <div className="intro-wrapper">
                                <div className="content">
                                    { this.getClubDescriptionTemplate(this.state.clubDetails) }
                                </div>
                            </div>
                            {this.tempData && <div className="initiatives-wrapper">
                                <div className="content">
                                    <h3 className="page-title-lvl4">Our Initiatives</h3>
                                    { this.getInitiativesTemplate() }
                                </div>
                            </div>}
                            {this.tempData && <div className="schedue-wrapper">
                                <div className="content">
                                    <h3 className="page-title-lvl3">Events</h3>
                                    <div className="schedule-group">
                                        <div className="month-box">
                                            <Icon size="small">today</Icon>
                                        </div>
                                        <div className="schedule-box">
                                            { scheduleList }
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            {/*<div className="recent-event-wrapper">
                                <div className="content">
                                    <h3 className="page-title-lvl4">Our Recent Events</h3>
                                    { this.getRecentEventsTemplate() }
                                </div>
                            </div>*/}
                            <div className="clubmember-wrapper">
                                <div className="content">
                                    <h4 className="page-title-lvl4">The Team</h4>
                                    { this.getClubMemberTemplate(this.state.memberDetails) }
                                </div>
                            </div>
                            <div className="bottom-fab-container">
                                <Button color="primary" fab onClick={this.navigateToLanderPage.bind(this)}>
                                    <Icon>arrow_back</Icon>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }

    componentDidMount(){
        window.scrollTo(0, 0);
        
        this.pageId = this.props.match.params.clubId;
        this.loadClubDetails(this.pageId);
        this.loadMemberDetails(this.pageId);
    }

    getImage(avatar, context = "club"){
        let avatarImage = avatar ? (Util.getFullImageUrl(avatar) + `?${Date.now()}`) : `/resources/images/img/${context}.png`;
        return avatarImage;
    }

    getCarouselTemplate(){
        return (
            <Carousel className="club-carousel"
                showArrows={false}
                showThumbs={false}
                showStatus={false}
                >
                <div>
                    <img src="resources/images/club-lander-banner-01.jpg" />
                </div>
            </Carousel>
        );
    }

    getClubDescriptionTemplate(club){
        const imgPath = this.getImage(club.clubAvatar).replace("/thumb/", "/");;
        return (
            <div className="intro-group">
                <div className="image-holder">
                    <img src={imgPath} alt={club.clubName} />
                </div>
                {/*<div className="desc">
                    <p className="name">{club.clubName}</p>
                    <p className="slogan">{club.slogan}</p>
                    <p className="description">{club.description}</p>
                </div>*/}
                <div className="desc">
                    <p className="name">{club.clubName}</p>
                    <p className="description">{this.tempData && this.tempData.description}</p>
                </div>
            </div>
        );
    }

    getScheduleTemplate(){
        return (<div>
                {
                    this.tempData? (<ul className="schedule-list">
                            {
                                this.tempData.length ? this.tempData.events.map((event, index) => {
                                    return <li className="schedule-item" key={index}>
                                        <div className="item">
                                            <time dateTime="">{event.date}</time>
                                            <strong className="title">{event.title}</strong>
                                            <div className="schedule-desc">{event.description}</div>
                                        </div>
                                    </li>
                                })
                                :
                                    <li className="schedule-item">No events yet</li>
                            }
                        </ul>)
                    : null
                }
            </div>
        );
    }

    getRecentEventsTemplate(){
        return (
            <ul className="recent-event-list">
                <li className="event-item">
                    <div className="image-holder">
                        <span>
                            <img src="resources/images/club-lander-recent-dummy.jpg" width="306" height="185" alt="event image"/>
                        </span>
                    </div>
                    <time dateTime="">01-10-2018</time>
                    <div className="desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem soluta maxime sint rerum quos, labore, incidunt ipsum, officia error dicta quia, culpa cum. Similique commodi eum culpa! Expedita ratione, distinctio.</div>
                </li>
                <li className="event-item">
                    <div className="image-holder">
                        <span>
                            <img src="resources/images/club-lander-recent-dummy.jpg" width="306" height="185" alt="image"/>
                        </span>
                    </div>
                    <time dateTime="">01-10-2018</time>
                    <div className="desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem soluta maxime sint rerum quos, labore, incidunt ipsum, officia error dicta quia, culpa cum. Similique commodi eum culpa! Expedita ratione, distinctio.</div>
                </li>
                <li className="event-item">
                    <div className="image-holder">
                        <span>
                            <img src="resources/images/club-lander-recent-dummy.jpg" width="306" height="185" alt="image"/>
                        </span>
                    </div>
                    <time dateTime="">01-10-2018</time>
                    <div className="desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem soluta maxime sint rerum quos, labore, incidunt ipsum, officia error dicta quia, culpa cum. Similique commodi eum culpa! Expedita ratione, distinctio.</div>
                </li>
                <li className="event-item">
                    <div className="image-holder">
                        <span>
                            <img src="resources/images/club-lander-recent-dummy.jpg" width="306" height="185" alt="image"/>
                        </span>
                    </div>
                    <time dateTime="">01-10-2018</time>
                    <div className="desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem soluta maxime sint rerum quos, labore, incidunt ipsum, officia error dicta quia, culpa cum. Similique commodi eum culpa! Expedita ratione, distinctio.</div>
                </li>
                <li className="event-item">
                    <div className="image-holder">
                        <span>
                            <img src="resources/images/club-lander-recent-dummy.jpg" width="306" height="185" alt="image"/>
                        </span>
                    </div>
                    <time dateTime="">01-10-2018</time>
                    <div className="desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem soluta maxime sint rerum quos, labore, incidunt ipsum, officia error dicta quia, culpa cum. Similique commodi eum culpa! Expedita ratione, distinctio.</div>
                </li>
            </ul>
        );
    }

    getClubMemberTemplate(memberList){
        return (
            <ul className="clubmember-list">
                {
                    memberList.map(member => {
                        const imgPath = this.getImage(member.avatar, "user-avatar");
                        const fullName = `${member.firstName} ${member.middleName} ${member.lastName}`;
                        return (
                            <li className="clubmember-item" key={member.userId}>
                                <figure className="clubmember">
                                    <div className="image-holder">
                                        <span>
                                            <img src={imgPath} alt={fullName} />
                                        </span>
                                    </div>
                                    <figcaption className="name">
                                        {fullName}
                                        <span className="role">{member.clubRole}</span>
                                    </figcaption>
                                </figure>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }

    getInitiativesTemplate(){
        return (
            <div>
                {
                    this.tempData?
                        <ul className="initiatives-list">
                            {
                                this.tempData.initiatives.map((initiative, index) => {
                                    const tmp = `/resources/images/clubphotos/${this.tempData.clubCode}/${index+1}.jpg`;
                                    console.log(tmp);
                                    return (
                                        <li className="event-item" key={index}>
                                            <div className="image-holder">
                                                <span>
                                                    {/*<img src="resources/images/club-lander-initiative-dummy.jpg" width="306" height="185" alt="image"/>*/}
                                                    <img src={tmp} width="306" height="185" alt="initiative image"/>
                                                </span>
                                            </div>
                                            <h3 className="title">{initiative.title}</h3>
                                            <div className="desc">{initiative.description}</div>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                        : null}
            </div>
        );
    }

    navigateToLanderPage(){
        this.props.history.push("/welcome");
    }

    loadClubDetails(pageId){
        LanderDetailsService.getClubDetails(pageId)
            .then(clubDetails => {
            this.tempData = LanderData.clubs.find(item => item.clubCode === clubDetails.clubCode);
            this.setState({...this.state, clubDetails });
        })
            .catch((error) => {
            riverToast.show("Something went wrong while loading club details.");
        });
    }

    loadMemberDetails(pageId){
        LanderDetailsService.getMemberDetails(pageId)
            .then(memberDetails => {
            //console.log(memberDetails);
            this.setState({...this.state, memberDetails });
        })
            .catch((error) => {
            riverToast.show("Something went wrong while loading club details.");
        });
    }

}

export default LanderDetails;