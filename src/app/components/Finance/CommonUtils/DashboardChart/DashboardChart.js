import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import './DashboardChart.scss';

class DashboardChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingAllowanceChartData: "empty",
      eventAllowanceChartData: "empty"
    }
  }

  render() {
    let meetingAllowanceChartData, eventAllowanceChartData;

    if (this.props.data && typeof this.props.data === 'object') {
      meetingAllowanceChartData = {
        labels: ["Spent", "Balance"],
        datasets: [
          {
            data: [
              this.props.data.meetingAllowance.spent,
              this.props.data.meetingAllowance.balance
            ],
            backgroundColor: ['#22bca8', '#1c9fb0'],
            hoverBackgroundColor: ['#1C998C', '#157885']
          }
        ]
      }

      eventAllowanceChartData = {
        labels: ["Spent", "Balance"],
        datasets: [
          {
            data: [
              this.props.data.eventAllowance.spent,
              this.props.data.eventAllowance.balance
            ],
            backgroundColor: ['#22bca8', '#1c9fb0'],
            hoverBackgroundColor: ['#1C998C',, '#157885']
          }
        ]
      }
    }

    return (
      <div className="dashboard-chart-wrapper">
        {this.props.data && typeof this.props.data === 'object' &&
          <div className="row chart-wrapper">
            <div className="col-lg-2">
              <div className="pieChart-wrapper">
                <Doughnut data={meetingAllowanceChartData} options={{ maintainAspectRatio: false, legend: { display: false } }} />
              </div>
            </div>
            <div className="col-lg-2">
              <p>Meeting Allowance</p>
              <table className="chart-data">
                <tbody>
                  <tr>
                    <td className="heading">Total:</td>
                    <td className="value">{this.props.data.meetingAllowance.limit}</td>
                  </tr>
                  <tr>
                    <td className="heading">Spent:</td>
                    <td className="value">{this.props.data.meetingAllowance.spent}</td>
                  </tr>
                  <tr>
                    <td className="heading">Balance:</td>
                    <td className="value">{this.props.data.meetingAllowance.balance}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-lg-1"/>
            <div className="col-lg-2">
              <div className="pieChart-wrapper">
                <Doughnut data={eventAllowanceChartData} options={{ maintainAspectRatio: false, legend: { display: false } }} />
              </div>
            </div>
            <div className="col-lg-2">
              <p>Event Allowance</p>
              <table className="chart-data">
                <tbody>
                  <tr>
                    <td className="heading">Total:</td>
                    <td className="value">{this.props.data.eventAllowance.limit}</td>
                  </tr>
                  <tr>
                    <td className="heading">Spent:</td>
                    <td className="value">{this.props.data.eventAllowance.spent}</td>
                  </tr>
                  <tr>
                    <td className="heading">Balance:</td>
                    <td className="value">{this.props.data.eventAllowance.balance}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-lg-1"/>
            <div id="other" className="col-lg-2">
              <p>Other Allowance</p>
              <table className="chart-data">
                <tbody>
                  <tr>
                    <td className="heading">Spent:</td>
                    <td className="value">{this.props.data.otherExpenseSpent}</td>
                  </tr>
                </tbody>
              </table>
              <div className="common-notifications">
                <table>
                  <tbody>
                    <tr>
                      <td className="heading"><strong>Total In-Hand:</strong></td>
                      <td className="value">{this.props.data.inHand}</td>
                    </tr>
                  </tbody>
                </table>
                {
                  this.props.data.amountType === "INR"?
                  <label className="denomination-type">*amount in rupees</label>:
                  <label className="denomination-type">*amount in dollars</label>
                }
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default DashboardChart;