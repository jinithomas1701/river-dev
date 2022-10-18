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
import { Root } from "../Layout/Root";

// custom component
import { Util } from "../../Util/util";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from "../Common/PageTitle/PageTitle";
import { Toast, riverToast } from "../Common/Toast/Toast";
import { LanderService } from "./Lander.service";
import LanderNav from "./LanderNav/LanderNav";
import LanderHeader from "./LanderHeader/LanderHeader";
import LanderData from "./LanderData";

// css
import "./Lander.scss";
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

const bareButtonStyle = {
    root: {
        background: "transparent",
        color: "#000",
        fontSize: "1rem",
        fontWeight: "normal"
    }
}

class Lander extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            clubStandings: [],
        };
    }

    render(){

        return (
            <MuiThemeProvider theme={theme}>
                <div className="full-width lander-wrapper">
                    <Toast />
                    <div className="main-wrapper">
                        <div className="content-wrapper">
                            <LanderHeader history={this.props.history} />
                            <div className="banner-group">
                                { this.getCarouselTemplate() }
                                <div className="standing-wrapper">
                                    <h1 className="title">Club Standings</h1>
                                    { this.getStandingsTableTemplate(this.state.clubStandings) }
                                </div>
                            </div>
                            <div className="nav-group">
                                <div className="content">
                                    <LanderNav />
                                </div>
                            </div>
                            <div className="video-wrapper">
                                <div className="video-box">
                                    {/*<iframe width="853" height="480" src="https://www.youtube.com/embed/pTDcehbCTjY" frameBorder="0" allowFullScreen></iframe>*/}
                                    <iframe width="853" height="480" src="https://www.youtube.com/embed/t4XrR5Fs9Pg" frameBorder="0" allowFullScreen></iframe>
                                </div>
                            </div>
                            <div className="ourclubs-wrapper">
                                <h2 className="page-title-lvl2">Our Clubs</h2>
                                <div className="content">
                                    { this.getOurClubsTemplate() }
                                </div>
                            </div>
                            <div className="eventcarousel-wrapper">
                                <div className="content">
                                    { this.getEventCarousel() }
                                </div>
                            </div>
                            <div className="schedue-wrapper">
                                <div className="content">
                                    <h3 className="page-title-lvl3">Events</h3>
                                    <div className="schedule-group">
                                        <div className="month-box">
                                            <Icon size="small">today</Icon>
                                        </div>
                                        <div className="schedule-box">
                                            { this.getSceduleTemplate() }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="stories-wrapper">
                                <div className="content">
                                    { this.getStoriesTemplate(this.state.clubStandings) }
                                </div>
                            </div>
                            {/*<div className="upcoming-event-wrapper">
                                <div className="content">
                                    <h3 className="page-title-lvl4">Upcoming Events</h3>
                                    { this.getUpcomingEventsTemplate() }
                                    <div className="button-container">
                                        <Button style={bareButtonStyle.root}><Icon>arrow_left</Icon></Button>
                                        <Button style={bareButtonStyle.root}><Icon>arrow_right</Icon></Button>
                                    </div>
                                </div>
                            </div>*/}
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }

    componentDidMount(){
        window.scrollTo(0, 0);
        this.loadClubStandings();
    }

    getCarouselTemplate(){
        return (
            <Carousel className="club-carousel"
                showArrows={false}
                showThumbs={false}
                showStatus={false}
                autoPlay
                infiniteLoop
                >
                <div>
                    <img src="resources/images/club-lander-banner-01.jpg" />
                </div>
            </Carousel>
        );
    }

    getEventCarousel(){
        return (
            <Carousel className="event-carousel" showStatus={false} autoPlay infiniteLoop>
                <div>
                    <img src="resources/images/clubphotos/ADHO/5.jpg" />
                </div>
                <div>
                    <img src="resources/images/clubphotos/BHOO/2.jpg" />
                </div>
                <div>
                    <img src="resources/images/clubphotos/MAAY/1.JPG" />
                </div>
                <div>
                    <img src="resources/images/clubphotos/DEVA/1.jpg" />
                </div>
            </Carousel>
        );
    }

    getSceduleTemplate(){
        return (
            <ul className="schedule-list">
                {
                    LanderData.clubs.map((club, index) => {
                        return (
                            club.events.length?
                            (<li className="schedule-item" key={index}>
                                    <div className="item">
                                        <time dateTime="">{club.events[0].date}</time>
                                        <strong className="title">{club.events[0].title}</strong>
                                        <div className="schedule-desc">
                                            {club.events[0].description}
                                        </div>
                                    </div>
                                </li>)
                            : null
                        )
                    })
                }
            </ul>
        );
    }

    getStandingsTableTemplate(standings){
        return (
            <Table className="standing-table">
                <TableHead>
                    <TableRow className="table-row">
                        <TableCell>No</TableCell>
                        <TableCell className="item-with-icon">
                            <div>
                                <Icon>store</Icon>Club
                            </div>
                        </TableCell>
                        <TableCell numeric className="item-with-icon">
                            <div>
                                <Icon>stars</Icon> Points
                            </div>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {standings.map((item, index) => {
                        return (
                            <TableRow className="table-row" key={item.clubId}>
                                <TableCell component="th" scope="row">{((index + 1) < 10)? `0${(index + 1)}`: (index + 1)}.</TableCell>
                                <TableCell>{item.clubName}</TableCell>
                                <TableCell numeric className="item-with-icon">
                                    {item.clubPoints}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }

    getStoriesTemplate(standings){
        return (
            <ul className="stories-list">
                {
                    standings.map(club => {
                        const imgPath = this.getImage(club.clubAvatar);
                        const data = LanderData.clubs.find(item => item.clubCode === club.clubCode);
                        return (
                            <li className="stories-item" key={club.clubId}>
                                <div className="image-holder">
                                    <div className="image-inner">
                                        <img src={imgPath} alt={club.clubName}/>
                                    </div>
                                </div>
                                {/*<div className="story-holder">
                                    <p>{club.clubInfo}</p>
                                    <Button classes={{root: "btn-storyview"}} onClick={this.navigateToDetailsPage.bind(this, club.clubId)}>VIEW CLUB</Button>
                                </div>*/}
                                <div className="story-holder">
                                    <p><b>{club.clubName}</b></p>
                                    <p>{data && data.description}</p>
                                    <Button classes={{root: "btn-storyview"}} onClick={this.navigateToDetailsPage.bind(this, club.clubId)}>VIEW CLUB</Button>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }

    loadClubStandings(){
        LanderService.getLanderClubList()
            .then(clubStandings => {
            this.setState({...this.state, clubStandings });
        })
        /*.catch((error) => {
            riverToast.show("Something went wrong while loading club list.");
        });*/
    }

    getOurClubsTemplate(){
        return (
            <ul className="club-logos-list">
                {
                    this.state.clubStandings.map(club => {
                        const imgPath = this.getImage(club.clubAvatar);
                        return <li key={club.clubId} title={club.clubName}>
                            <a onClick={this.navigateToDetailsPage.bind(this, club.clubId)}>
                                <img src={imgPath} alt={club.clubName} />
                            </a>
                        </li>
                    })
                }
            </ul>
        );
    }

    getImage(avatar){
        let avatarImage = avatar ? (Util.getFullImageUrl(avatar) + `?${Date.now()}`) : "/resources/images/img/club.png";
        return avatarImage;
    }

    getUpcomingEventsTemplate(){
        return (
            <ul className="upcoming-event-list">
                <li className="event-item">
                    <div className="image-holder">
                        <span>
                            <img src="resources/images/club-lander-events-dummy.jpg" alt="dummy"/>
                        </span>
                    </div>
                    <time dateTime="">01-10-2018</time>
                    <div className="desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem soluta maxime sint rerum quos, labore, incidunt ipsum, officia error dicta quia, culpa cum. Similique commodi eum culpa! Expedita ratione, distinctio.</div>
                </li>
                <li className="event-item">
                    <div className="image-holder">
                        <span>
                            <img src="resources/images/club-lander-events-dummy.jpg" alt="dummy"/>
                        </span>
                    </div>
                    <time dateTime="">01-10-2018</time>
                    <div className="desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem soluta maxime sint rerum quos, labore, incidunt ipsum, officia error dicta quia, culpa cum. Similique commodi eum culpa! Expedita ratione, distinctio.</div>
                </li>
                <li className="event-item">
                    <div className="image-holder">
                        <span>
                            <img src="resources/images/club-lander-events-dummy.jpg" alt="dummy"/>
                        </span>
                    </div>
                    <time dateTime="">01-10-2018</time>
                    <div className="desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem soluta maxime sint rerum quos, labore, incidunt ipsum, officia error dicta quia, culpa cum. Similique commodi eum culpa! Expedita ratione, distinctio.</div>
                </li>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam nulla tempore ea unde sunt nesciunt voluptatibus esse? Voluptatibus consectetur inventore cumque fugit reprehenderit ea praesentium fugiat provident veniam sint unde itaque esse voluptates culpa, perspiciatis. Aliquid sunt sed cum voluptate voluptates perferendis reprehenderit quasi expedita iste quos impedit quam, magni id aut nisi qui nostrum reiciendis blanditiis aliquam doloribus quod labore cupiditate, illum! Ducimus eligendi quae perferendis laudantium rem expedita incidunt aliquid, dolorum tenetur, beatae libero magnam aperiam quas distinctio nam tempore. Quasi a numquam accusantium et beatae excepturi atque veritatis repudiandae provident. Eum voluptatem voluptatibus quidem, earum quam vero facilis! Non nesciunt, quae vel reiciendis dolore aperiam numquam rerum? Saepe veniam tempore perferendis voluptate nam dignissimos qui nulla provident repellendus, quia eius doloremque culpa minus, cumque accusamus, aut consequuntur eaque laudantium odio. Autem sunt vitae consequuntur quaerat commodi magnam, harum, alias laudantium optio, molestias deserunt, labore? Fuga aut, perferendis, officia atque aliquid quis vitae dicta quaerat eaque. Odio veniam consectetur harum cupiditate quasi deserunt eaque, dolores expedita magni iste quia suscipit eligendi rem quibusdam dolorum dicta distinctio accusantium possimus odit voluptas tenetur quisquam! Cupiditate quisquam expedita nostrum architecto laboriosam repudiandae, dolorum distinctio in debitis qui animi, aut natus sunt earum aspernatur. Nostrum labore eligendi libero neque unde aperiam cumque, recusandae, tenetur excepturi numquam deserunt et obcaecati. Modi culpa laboriosam vero officiis quibusdam, optio reprehenderit a facere, temporibus ducimus illum reiciendis cupiditate odio nam quaerat sunt aspernatur possimus expedita fugiat assumenda accusamus molestiae fuga. Iste, porro! Praesentium libero pariatur, modi iusto unde. Doloremque placeat voluptates velit, illum ad laudantium, aut ab quas qui accusantium quod cupiditate? Ipsam consectetur modi est nemo ducimus aperiam cumque, atque quasi iusto, consequuntur reiciendis hic numquam deserunt, ipsa natus ratione doloribus ullam? Sint tempore sit itaque fugit illum esse, minus modi neque? Velit laborum sequi architecto placeat? Incidunt natus, nihil, distinctio quasi autem est magnam quibusdam necessitatibus, iste quas cupiditate nesciunt earum dignissimos obcaecati. Quae, porro, illo? Beatae ratione fugit sapiente magnam reprehenderit, ex magni in sequi? Illum consequatur, quae temporibus harum placeat officiis cum voluptatum tempora nihil nulla, assumenda tenetur officia adipisci? Earum ea error ab praesentium maiores adipisci rem inventore possimus veritatis, sed consequatur, ad, voluptatum. Magnam iusto odit at eum qui soluta illum, similique veritatis explicabo, corporis asperiores earum rem nihil repellat voluptas molestias assumenda cum fuga esse incidunt amet deserunt iste! Adipisci labore accusamus a, harum ipsum alias eius id perspiciatis, ut quisquam dolorem eveniet reprehenderit saepe delectus iure consectetur, ipsa expedita soluta laborum. Perspiciatis nihil sequi consequatur! Ipsam sit illum dolorem repellat non repudiandae magni voluptates vel quibusdam reprehenderit, aperiam neque expedita itaque assumenda. A quisquam libero ducimus eum aliquid odit sint minus, amet odio pariatur magnam exercitationem voluptas sapiente doloremque quae distinctio, sit fugiat quod quibusdam quas. Laboriosam ad non atque quibusdam aut. Error nam ea dicta molestiae provident, quae culpa corporis quod eum accusamus ipsa illo consectetur quidem, veritatis voluptatem sapiente quaerat dolor? Ipsa nobis iusto sed rerum nostrum repellendus ex dolorum. Incidunt commodi facilis fugiat, ipsum natus.</p>
            </ul>
        );
    }

    navigateToDetailsPage(pageId){
        this.props.history.push(`/welcome/${pageId}`);
    }

}

export default Lander;