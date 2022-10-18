import React from 'react';
import PropTypes from 'prop-types';
import  { Line, Bar } from  'react-chartjs-2';
import Tabs, { Tab } from 'material-ui/Tabs';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import StoreIcon from 'material-ui-icons/Store';

// page dependecy
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { MyUserCardWidgetService } from "./MyUserCardWidget.service"
// css
import './MyUserCardWidget.scss';

export class MyUserCardWidget extends React.Component {

    state={
        myPoints: "*****",
        clubPoints: "*****",
        viewChart: "myPoints",
        clubsNames: [],
        clubsPoints: [],
        pointsMonthsList: [],
        userPointsList: []
    }

    data = {
        labels: this.state.pointsMonthsList,
        datasets: [
          {
            label: 'My Points',
            fill: true,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: this.state.userPointsList
          }
        ]
      };

    barData = {
        labels: this.state.clubsNames,
        datasets: [
          {
            label: 'Club Points',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: this.state.clubsPoints
          }
        ]
      };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadPoints();
    }


    render() {
        return (
            <div className="my-card-widget">
                <div className="my-card-widget-container">
                    <div className="tabs-container">
                        <Tabs
                            value={this.state.viewChart}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                        >
                            <Tab value="myPoints" label={this.state.myPoints} icon={<AccountCircleIcon />}>Cool</Tab>
                            <Tab value="clubPoints" label={this.state.clubPoints} icon={<StoreIcon />}/>
                        </Tabs>
                    </div>
                    <div className={ ((this.state.viewChart == "myPoints") ? "self " : "club ") + "chart-container"}>
                        {
                            (this.state.viewChart == "myPoints") ? 
                                (
                                    <Line
                                        data={this.data}
                                        options={{
                                            maintainAspectRatio: false
                                        }}
                                        redraw
                                    />
                                ) : (
                                    <Bar
                                        data={this.barData}
                                        options={{
                                            maintainAspectRatio: false
                                        }}
                                        redraw
                                    />
                                )
                        }
                    </div>
                </div>
            </div>
        );
    }

    loadPoints = () => {
        MyUserCardWidgetService.getPoints()
        .then((data) => {
            this.storePoints(data);
        })
        .catch((error) => {
            riverToast.show("Something went wrong while fetching points");
        })
    }

    storePoints(data){
        this.setState({ myPoints: data.userPoints });
        this.setState({ clubPoints: data.clubPoints });
        this.processClubPoints(data.allClubPointList);
        this.processUserPointsHistory(data.pointsHistoryList);
    }

    processClubPoints(clubsPoints) {
        clubsPoints.forEach((club) => {
            this.state.clubsNames.push(club.clubName);
            this.state.clubsPoints.push(club.clubPoints);
        }, this);
    }

    processUserPointsHistory(pointsHistory) {
        pointsHistory.map((item) => {
            this.state.pointsMonthsList.push(this.getMonth(item.monthName));
            this.state.userPointsList.push(item.points);
        })
    }

    getMonth(ts) {
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return month[new Date(ts).getMonth()];
    }
    
    handleChange = (event, value) => {
        this.setState({ viewChart: value });
    };
}