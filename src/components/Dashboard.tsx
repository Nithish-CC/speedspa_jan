import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import "./../scss/dashboard.scss";
import {
  getTodayTodaySales,
  getThirtyDaySnapshot,
  searchServiceCompleted,
  setDashboardChart,
} from "../redux/actions/reportActions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import _ from "lodash";
import { Line, Bar } from "react-chartjs-2";
import moment from "moment";
import PageHeader from "../components/core/PageHeader";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  Tooltip,
  Legend
);
const Dashboard = (props: any) => {
  //useState
  const [errors, setErrors] = useState({} as Error);
  const [topSalesService, setTopSalesService] = useState([]);
  const [topCategory, setTopCategory] = useState([]);
  const demo = [-1, 0.5, 0.2, 1, -0.2];
  // From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const totalSales = useSelector((state: any) => state.report.totalSales);
  const thirtyDaySnapshot = useSelector(
    (state: any) => state.report.thirtyDaySnapshot
  );
  const serviceCompleted = useSelector(
    (state: any) => state.report.reportServiceCompleted
  );
  const dashboardChart = useSelector(
    (state: any) => state.report.dashboardChart[0]
  );
  const userDetails = JSON.parse(localStorage.userDetails);
  const [colors, setColors] = useState<string[]>([]);
  const [title] = useState(
    `Welcome, ` + userDetails.firstName + ` ` + userDetails.lastName + `!`
  );

  useEffect(() => {
    getRandomColorEachEmployee();
  }, []);
  function getRandomColor() {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  function getRandomColorEachEmployee() {
    var data = ["#333"];
    for (var i = 0; i < 14; i++) {
      data.push(getRandomColor());
    }
    setColors(data);
  }

  //useEffect
  useEffect(() => {
    getTodayTodaySales();
    searchServiceCompleted();
    getThirtyDaySnapshot();
    setDashboardChart();

    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  useEffect(() => {
    if (serviceCompleted && serviceCompleted.length) {
      setTopSalesService(
        _.maxBy(serviceCompleted[0].data, "totalGrossServiceRevenue")
      );
    }
  }, [serviceCompleted]);

  useEffect(() => {
    if (serviceCompleted && serviceCompleted.length) {
      setTopCategory(_.maxBy(serviceCompleted[0].data, "totalAmount"));
    }
  }, [serviceCompleted]);

  const getTodayTodaySales = () => {
    const params = {
      begin_time: moment().startOf("day").toISOString(),
      end_time: moment().endOf("day").toISOString(),
      businessId: localStorage.businessId,
    };
    props.getTodayTodaySales(params);
  };

  const searchServiceCompleted = () => {
    const params = {
      begin_time: moment().startOf("day").toISOString(),
      end_time: moment().endOf("day").toISOString(),
      businessId: localStorage.businessId,
    };
    props.searchServiceCompleted(params);
  };

  const setDashboardChart = () => {
    const params = {
      begin_time: moment().startOf("day").toISOString(),
      end_time: moment().endOf("day").toISOString(),
      businessId: localStorage.businessId,
    };
    props.setDashboardChart(params);
  };

  const getThirtyDaySnapshot = () => {
    const params = {
      begin_time: moment().startOf("day").toISOString(),
      end_time: moment().endOf("day").toISOString(),
      businessId: localStorage.businessId,
    };
    props.getThirtyDaySnapshot(params);
  };

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading && (
        <React.Fragment>
          <PageHeader title={title} />
          <div id="dashboard" className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <h1
                  style={{ marginTop: "0px", marginBottom: "30px" }}
                  className="ng-binding"
                ></h1>
                <h2> Today's Total Sales </h2>
                <div className="row" style={{ textTransform: "uppercase" }}>
                  {/* total customers */}
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div
                        className="ibox-content customer-analysis-content greenWhite"
                        style={{ marginBottom: "0" }}
                      >
                        <span className="customer_analysis_count">
                          ${totalSales.summaryOfAmount}
                        </span>
                        <p>Total Sales</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div
                        className="ibox-content customer-analysis-content greenWhite"
                        style={{ marginBottom: "0" }}
                      >
                        <span className="customer_analysis_count">
                          ${totalSales.summaryOfTip}
                        </span>
                        <p>Total Tips</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div
                        className="ibox-content customer-analysis-content greenWhite"
                        style={{ marginBottom: "0" }}
                      >
                        <span className="customer_analysis_count">
                          {"\u0024"}
                          {totalSales.summaryOfTotal}
                        </span>
                        <p>Gross Revenue</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ textTransform: "uppercase" }} className="row">
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div
                        className="ibox-content customer-analysis-content greenWhite"
                        style={{ height: "150px", marginBottom: "0" }}
                      >
                        <span
                          className="customer_analysis_count"
                          style={{
                            fontSize: "2.5rem",
                            textTransform: "capitalize",
                            width: "200px",
                            whiteSpace: "nowrap",
                            overflow: "hidden ",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {(serviceCompleted &&
                            serviceCompleted.length &&
                            _.maxBy(
                              serviceCompleted[0].data,
                              "rootCategoryName"
                            )) ||
                            "-"}
                          <br />
                          {topCategory &&
                            topCategory.length &&
                            {
                              /* {topSalesService.serviceAmountCompleted  ||
                                " "} */
                            }}
                        </span>
                        <p>TOP CATEGORY</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div
                        className="ibox-content customer-analysis-content greenWhite"
                        style={{ marginBottom: "0" }}
                      >
                        <span className="customer_analysis_count">
                          {totalSales.total}
                        </span>
                        <p>Total Transactions</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div
                        className="ibox-content customer-analysis-content greenWhite"
                        style={{ height: "150px", marginBottom: "0" }}
                      >
                        <span
                          className="customer_analysis_count"
                          style={{
                            fontSize: "2.5rem",
                            textTransform: "capitalize",
                            width: "200px",
                            whiteSpace: "nowrap",
                            overflow: "hidden !important",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {(serviceCompleted &&
                            serviceCompleted.length &&
                            _.maxBy(
                              serviceCompleted[0].data,
                              "totalGrossServiceRevenue"
                            )) ||
                            "-"}
                          <br />

                          {topSalesService && topSalesService.length && (
                            <span>
                              {topSalesService.serviceAmountCompleted + " Xs" ||
                                " "}
                            </span>
                          )}
                        </span>
                        <p>TOP SERVICE</p>
                      </div>
                    </div>
                  </div>
                </div>

                <h2> 30 Day Snapshot </h2>
                <div className="row">
                  {/* total customers */}
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div className="ibox-content customer-analysis-content greenWhite">
                        <i
                          className="fa fa-user"
                          style={{ fontSize: "4.75rem" }}
                        ></i>
                        &nbsp;&nbsp;
                        <span className="customer_analysis_count">
                          {thirtyDaySnapshot.customerCount}
                        </span>
                        <p>TOTAL CUSTOMERS</p>
                      </div>
                    </div>
                  </div>
                  {/* new customers */}
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div className="ibox-content customer-analysis-content greenWhite">
                        <i
                          className="fa fa-user-plus"
                          style={{ fontSize: "4.75rem" }}
                        ></i>
                        &nbsp;&nbsp;
                        <span className="customer_analysis_count">
                          {thirtyDaySnapshot.newCustomerCount}
                        </span>
                        <p>NEW CUSTOMERS</p>
                      </div>
                    </div>
                  </div>
                  {/* returning customers */}
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div className="ibox-content customer-analysis-content greenWhite">
                        <i
                          className="fa fa-users"
                          style={{ fontSize: "4.75rem" }}
                        ></i>
                        &nbsp;&nbsp;
                        <span className="customer_analysis_count">
                          {thirtyDaySnapshot.returningCustomerCount}
                        </span>
                        <p>REPEAT CUSTOMERS</p>
                      </div>
                    </div>
                  </div>
                  {/* average $ per visit */}
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div className="ibox-content customer-analysis-content greenWhite">
                        <span className="customer_analysis_count">
                          {"\u0024"}
                          {thirtyDaySnapshot.averageAmount || 0}
                        </span>
                        <p>AVG $ per VISIT</p>
                      </div>
                    </div>
                  </div>
                  {/* average visit per customer */}
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div className="ibox-content customer-analysis-content greenWhite">
                        <i
                          className="fa fa-user"
                          style={{ fontSize: "4.75rem" }}
                        ></i>
                        &nbsp;&nbsp;
                        <span className="customer_analysis_count">
                          {thirtyDaySnapshot.averageVisitCount}x
                        </span>
                        <p>AVG VISITS per CUSTOMER</p>
                      </div>
                    </div>
                  </div>
                  {/* % of rebooking */}
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div className="ibox-content customer-analysis-content greenWhite">
                        <span className="customer_analysis_count">
                          {"\u0024"}
                          {thirtyDaySnapshot.avgTotalSales || 0}
                        </span>
                        <p>AVG SALES / DAY</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="wrapper wrapper-content animated fadeInRight">
                      <h2 className="text-center">Daily Sales Trend</h2>
                      <div className="row">
                        <div className="col-md-8">
                          {dashboardChart && (
                            <Line
                              data={{
                                labels: [
                                  "7:00 AM",
                                  "8:00 AM",
                                  "9:00 AM",
                                  "10:00 AM",
                                  "11:00 AM",
                                  "12:00 PM",
                                  "01:00 PM",
                                  "02:00 PM",
                                  "03:00 PM",
                                  "04:00 PM",
                                  "05:00 PM",
                                  "06:00 PM",
                                  "07:00 PM",
                                  "8:00 PM",
                                  "9:00 PM",
                                ],
                                datasets: [
                                  {
                                    backgroundColor: colors,
                                    data:
                                      dashboardChart &&
                                      dashboardChart.data &&
                                      dashboardChart.data.dayView !== undefined
                                        ? [dashboardChart.data.dayView]
                                        : [
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                            0, 0, 0, 0,
                                          ],
                                    // series: [
                                    //   "Day -" +
                                    //     moment()
                                    //       .subtract(1, "years")
                                    //       .format("MMMM DD, YYYY"),
                                    //   +"Day -" +
                                    //     moment().format("MMMM DD, YYYY"),
                                    // ],
                                  },
                                ],
                              }}
                              options={{
                                plugins: {
                                  legend: {
                                    display: false,
                                  },
                                },
                                scales: {
                                  y: {
                                    suggestedMin: -1.0,
                                    suggestedMax: 1.0,
                                  },
                                },
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <h2 className="text-center">Weekly Sales Trend</h2>
                      <div className="row">
                        <div className="col-md-8">
                          {dashboardChart && (
                            <Bar
                              data={{
                                labels: [
                                  "Sunday",
                                  "Monday",
                                  "Tuesday",
                                  "Wednesday",
                                  "Thursday",
                                  "Friday",
                                  "Saturday",
                                ],
                                datasets: [
                                  {
                                    data:
                                      dashboardChart &&
                                      dashboardChart.data &&
                                      dashboardChart.data.weekView !== undefined
                                        ? [dashboardChart.data.weekView]
                                        : [0, 0, 0, 0, 0, 0, 0],
                                  },
                                ],
                              }}
                              options={{
                                plugins: {
                                  legend: {
                                    display: false,
                                  },
                                },
                                scales: {
                                  y: {
                                    suggestedMin: -1.0,
                                    suggestedMax: 1.0,
                                  },
                                },
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <h2 className="text-center">Monthly Sales Trend</h2>
                      <div className="row">
                        <div className="col-md-8">
                          {dashboardChart && (
                            <Bar
                              data={{
                                labels: [
                                  "Jan",
                                  "Feb",
                                  "Mar",
                                  "Apr",
                                  "May",
                                  "Jun",
                                  "Jul",
                                  "Aug",
                                  "Sep",
                                  "Oct",
                                  "Nov",
                                  "Dec",
                                ],
                                datasets: [
                                  {
                                    data:
                                      dashboardChart &&
                                      dashboardChart.data &&
                                      dashboardChart.data.monthView !==
                                        undefined
                                        ? [dashboardChart.data.monthView]
                                        : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                    series: [
                                      "Year -" +
                                        moment()
                                          .subtract(1, "years")
                                          .format("YYYY"),
                                      "Year -" + moment().format("YYYY"),
                                    ],
                                  },
                                ],
                              }}
                              options={{
                                plugins: {
                                  legend: {
                                    display: false,
                                  },
                                },
                                scales: {
                                  y: {
                                    suggestedMin: -1.0,
                                    suggestedMax: 1.0,
                                  },
                                },
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapActionsToProps = {
  getTodayTodaySales,
  getThirtyDaySnapshot,
  searchServiceCompleted,
  setDashboardChart,
};

export default connect(null, mapActionsToProps)(Dashboard);
