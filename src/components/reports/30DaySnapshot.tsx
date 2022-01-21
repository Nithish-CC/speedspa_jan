import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { getThirtyDaySnapshot } from "../../redux/actions/reportActions";
import moment from "moment";
import PageHeader from "../../components/core/PageHeader";

const ThirtyDaySanpshot = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title] = useState("30 Day Snapshot");

  // From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const report = useSelector((state: any) => state.report);
  const thirtyDaySnapshot = report.thirtyDaySnapshot;

  useEffect(() => {
    getThirtyDaySnapshot();
    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  const getThirtyDaySnapshot = () => {
    const params = {
      begin_time: moment.utc(moment().subtract(1, "month").add(1, "day").startOf("day")).format(),
      end_time: moment.utc(moment().subtract(1, "day").endOf("day")).format(),
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
                <div className="row">
                  {/* total customers */}
                  <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div class="ibox float-e-margins m-b-none">
                        <div class="ibox-content customer_analysis_content">                
                        <i
                          className="fa fa-users"
                          style={{ fontSize: "4.5rem" }}
                        ></i>
                        &nbsp;&nbsp;
                        <span className="customer_analysis_count">
                          {thirtyDaySnapshot.customerCount}{" "}
                        </span>
                        <p>TOTAL CUSTOMERS</p>
                      </div>
                    </div>
                  </div>
                  {/* new customers */}
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div className="ibox-content customer_analysis_content">
                        <i
                          className="fa fa-user-plus"
                          style={{ fontSize: "4.5rem" }}
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
                      <div className="ibox-content customer_analysis_content">
                        <i
                          className="fa fa-user"
                          style={{ fontSize: "4.5rem" }}
                        ></i>
                        &nbsp;&nbsp;
                        <span className="customer_analysis_count">
                          {thirtyDaySnapshot.returningCustomerCount}
                        </span>
                        <p>RETURNING CUSTOMERS</p>
                      </div>
                    </div>
                  </div>
                  {/* average $ per visit */}
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div className="ibox-content customer_analysis_content">
                        <span className="customer_analysis_count">
                          {"\u0024"}
                          {thirtyDaySnapshot.averageAmount.toFixed(2)}
                        </span>
                        <p>AVERAGE $ per VISIT</p>
                      </div>
                    </div>
                  </div>
                  {/* average visit per customer */}
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div className="ibox-content customer_analysis_content">
                        <i
                          className="fa fa-user"
                          style={{ fontSize: "4.5rem" }}
                        ></i>
                        &nbsp;&nbsp;
                        <span className="customer_analysis_count">
                          {thirtyDaySnapshot.averageVisitCount}x
                        </span>
                        <p>AVERAGE VISITS per CUSTOMER</p>
                      </div>
                    </div>
                  </div>
                  {/* % of rebooking */}
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
                    <div className="ibox float-e-margins m-b-none">
                      <div className="ibox-content customer_analysis_content">
                        <span className="customer_analysis_count">
                          {thirtyDaySnapshot.averagePreBooking}
                        </span>
                        &nbsp;&nbsp;
                        <i
                          className="fa fa-percent"
                          style={{ fontSize: "3.5rem" }}
                        ></i>
                        <p>% of RE-BOOKING</p>
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
  getThirtyDaySnapshot,
};

export default connect(null, mapActionsToProps)(ThirtyDaySanpshot);
