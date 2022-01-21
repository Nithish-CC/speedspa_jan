import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../../redux/actions/userActions";

const SideMenu = (props: any) => {
  const [collapse, setCollapse] = useState({
    services: false,
    products: false,
    reports: false,
  });
  const logo = localStorage.getItem("logo");

  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  const handleClickLogout = (e: any) => {
    e.preventDefault();
    props.logoutUser();
  };

  const handleChange = (e: any, name: any, value: any) => {
    e.persist();
    setCollapse((collapse) => ({
      ...collapse,
      [name]: value,
    }));
  };

  return (
    <div>
      {props.authenticated && (
        <ul className="nav metismenu">
          <li className="nav-header">
            <div className="dropdown profile-element">
              <div
                style={{
                  display: "block",
                  textAlign: "left",
                  fontSize: "18px",
                  padding: "10px 0",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                <img
                  alt="logo"
                  src={
                    logo
                      ? logo
                      : process.env.PUBLIC_URL + "assets/I-Salon-logo.png"
                  }
                  style={{
                    height: "auto",
                    border: "0",
                    width: "50%",
                    verticalAlign: "middle",
                  }}
                />
              </div>
              <a data-toggle="dropdown" className="dropdown-toggle">
                <span className="clear">
                  <span className="block m-t-xs">
                    <strong className="font-bold">
                      {props.user.firstName} {props.user.lastName}
                    </strong>
                  </span>
                  <span className="block m-t-xs">
                    <strong className="font-bold">
                      {props.user.countryCode} {props.user.phoneNumber}
                    </strong>
                  </span>                  
                  {props.user.roles === undefined ? (
                    <React.Fragment></React.Fragment>
                  ) : (
                    <span className="text-muted text-xs block">
                      {props.user.roles[0]}&nbsp;
                      <b className="caret"></b>
                    </span>
                  )}
                </span>
              </a>
              <ul className="dropdown-menu animated fadeInRight m-t-xs">
                {props.user.roles && props.user.roles.includes("admin") && (
                  <React.Fragment>
                    <li>
                      <Link to="/profile">Profile</Link>
                    </li>
                    <li className="divider"></li>
                  </React.Fragment>
                )}
                <li>
                  <Link to="#" onClick={handleClickLogout}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
            <div className="logo-element">
              <img
                alt="sm-logo"
                src={
                  logo
                    ? logo
                    : process.env.PUBLIC_URL + "assets/I-Salon-logo.png"
                }
              />
            </div>
          </li>
          {props.user.roles && props.user.roles.includes("admin") && (
            <div className="dropdown profile-element">
              <ul className="nav metismenu" id="side-menu">
                <li
                  className={splitLocation[1] === "dashboard" ? "active" : ""}
                >
                  <Link to="/dashboard">
                    <span className="fa fa-columns" />
                    &nbsp;&nbsp;
                    <span className="nav-label">Dashboard</span>
                  </Link>
                </li>
                <li className={splitLocation[1] === "clients" ? "active" : ""}>
                  <Link to="/clients">
                    <span className="fa fa-users" />
                    &nbsp;&nbsp;
                    <span className="nav-label">Clients</span>
                  </Link>
                </li>
                <li className={splitLocation[1] === "staff" ? "active" : ""}>
                  <Link to="/staff">
                    <span className="fa fa-user-tie" />
                    &nbsp;&nbsp;
                    <span className="nav-label">Staff</span>
                  </Link>
                </li>
                <li className={splitLocation[1] === "schedule" ? "active" : ""}>
                  <Link to="/schedule">
                    <span className="fa fa-calendar-alt" />
                    &nbsp;&nbsp;
                    <span className="nav-label">Schedule</span>
                  </Link>
                </li>
                <li
                  className={
                    splitLocation[1] === "staff-schedule" ? "active" : ""
                  }
                >
                  <Link to="/staff-schedule">
                    <span className="far fa-calendar-check" />
                    &nbsp;&nbsp;
                    <span className="nav-label">Staff Schedule</span>
                  </Link>
                </li>
                <li
                  className={`${
                    splitLocation[1] === "services" ? "active" : ""
                  } ${collapse.services ? "slideddown" : ""}`}
                  onClick={(e) =>
                    handleChange(e, "services", !collapse.services)
                  }
                >
                  <a className="nav-second-level-label">
                    <span className="fa fa-cut f15" />
                    &nbsp;&nbsp;
                    <span className="nav-label">Services</span>
                    <span className="fa arrow"></span>
                  </a>
                  <ul
                    className={`nav nav-second-level ${
                      splitLocation[1] !== "services" && !collapse.services
                        ? "collapse"
                        : ""
                    }`}
                  >
                    <li>
                      <Link to="/services/categories">
                        <span className="nav-label">Categories</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/services">
                        <span className="nav-label">Services</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/services/orders">
                        <span className="nav-label">Orders</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li
                  className={`${
                    splitLocation[1] === "products" ? "active" : ""
                  } ${collapse.products ? "slideddown" : ""}`}
                  onClick={(e) =>
                    handleChange(e, "products", !collapse.products)
                  }
                >
                  <a className="nav-second-level-label">
                    <span className="fa fa-gifts f15" />
                    &nbsp;&nbsp;
                    <span className="nav-label">Products</span>
                    <span className="fa arrow"></span>
                  </a>
                  <ul
                    className={`nav nav-second-level ${
                      splitLocation[1] !== "products" && !collapse.products
                        ? "collapse"
                        : ""
                    }`}
                  >
                    <li>
                      <Link to="/products/categories">
                        <span className="nav-label">Categories</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/products">
                        <span className="nav-label">Products</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/products/orders">
                        <span className="nav-label">Orders</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/products/settings">
                        <span className="nav-label">Settings</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li
                  className={`${
                    splitLocation[1] === "reports" ? "active" : ""
                  } ${collapse.reports ? "slideddown" : ""}`}
                  onClick={(e) => handleChange(e, "reports", !collapse.reports)}
                >
                  <a className="nav-second-level-label">
                    <span className="fa fa-star f15" />
                    &nbsp;&nbsp;
                    <span className="nav-label">Reports</span>
                    <span className="fa arrow"></span>
                  </a>
                  <ul
                    className={`nav nav-second-level ${
                      splitLocation[1] !== "reports" && !collapse.reports
                        ? "collapse"
                        : ""
                    }`}
                  >
                    <li>
                      <Link to="/reports/total_sales">
                        <span className="nav-label">Total Sales</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/estimated_payroll">
                        <span className="nav-label">Estimated Payroll</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/services_completed">
                        <span className="nav-label">Services Completed</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/product_sales">
                        <span className="nav-label">Product Sales</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/client_report">
                        <span className="nav-label">Client Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/new_client_report">
                        <span className="nav-label">
                          New Clients: Rebookings
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/staff_booking_analysis">
                        <span className="nav-label">
                          Staff Booking Analysis
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/30_day_snapshot">
                        <span className="nav-label">30 Day Snapshot</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li
                  className={
                    splitLocation[1] === "insrtuctions" ? "active" : ""
                  }
                >
                  <Link to="/insrtuctions">
                    <span className="fa fa-video"></span>&nbsp;&nbsp;
                    <span className="nav-label">Instructional Videos</span>
                  </Link>
                </li>
                <li className={splitLocation[1] === "messages" ? "active" : ""}>
                  <Link to="/messages">
                    <span className="fa fa-comments" />
                    &nbsp;&nbsp;
                    <span className="nav-label">Messages</span>
                  </Link>
                </li>
                <li
                  className={splitLocation[1] === "terminals" ? "active" : ""}
                >
                  <Link to="/terminals">
                    <span className="fa fa-terminal" />
                    &nbsp;&nbsp;
                    <span className="nav-label">Terminals</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {props.user.roles && props.user.roles.includes("admin") && (
            <div className="logo-element">
              <ul className="nav metismenu" id="side-menu">
                <li
                  className={splitLocation[1] === "dashboard" ? "active" : ""}
                >
                  <Link to="/dashboard">
                    <span
                      className="fa fa-columns"
                      style={{ fontSize: "18px" }}
                    />
                  </Link>
                </li>
                <li className={splitLocation[1] === "clients" ? "active" : ""}>
                  <Link to="/clients">
                    <span
                      className="fa fa-users"
                      style={{ fontSize: "18px" }}
                    />
                  </Link>
                </li>
                <li className={splitLocation[1] === "staff" ? "active" : ""}>
                  <Link to="/staff">
                    <span
                      className="fa fa-user-tie"
                      style={{ fontSize: "18px" }}
                    />
                  </Link>
                </li>
                <li className={splitLocation[1] === "schedule" ? "active" : ""}>
                  <Link to="/schedule">
                    <span
                      className="fa fa-calendar-alt"
                      style={{ fontSize: "18px" }}
                    />
                  </Link>
                </li>
                <li
                  className={
                    splitLocation[1] === "staff-schedule" ? "active" : ""
                  }
                >
                  <Link to="/staff-schedule">
                    <span
                      className="far fa-calendar-check"
                      style={{ fontSize: "18px" }}
                    />
                  </Link>
                </li>
                <li
                  className={`${
                    splitLocation[1] === "services" ? "active" : ""
                  } ${collapse.services ? "slideddown" : ""}`}
                  onClick={(e) =>
                    handleChange(e, "services", !collapse.services)
                  }
                >
                  <a className="nav-second-level-label">
                    <span
                      className="fa fa-cut f15"
                      style={{ fontSize: "18px" }}
                    />
                    <span className="fa arrow"></span>
                  </a>
                  <ul
                    className={`nav nav-second-level ${
                      splitLocation[1] !== "services" && !collapse.services
                        ? "collapse"
                        : ""
                    }`}
                  >
                    <li>
                      <Link to="/services/categories">
                        <span className="nav-label">Categories</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/services">
                        <span className="nav-label">Services</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/services/orders">
                        <span className="nav-label">Orders</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li
                  className={`${
                    splitLocation[1] === "products" ? "active" : ""
                  } ${collapse.products ? "slideddown" : ""}`}
                  onClick={(e) =>
                    handleChange(e, "products", !collapse.products)
                  }
                >
                  <a className="nav-second-level-label">
                    <span
                      className="fa fa-gifts "
                      style={{ fontSize: "18px" }}
                    />
                    <span className="fa arrow"></span>
                  </a>
                  <ul
                    className={`nav nav-second-level ${
                      splitLocation[1] !== "products" && !collapse.products
                        ? "collapse"
                        : ""
                    }`}
                  >
                    <li>
                      <Link to="/products/categories">
                        <span className="nav-label">Categories</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/products">
                        <span className="nav-label">Products</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/products/orders">
                        <span className="nav-label">Orders</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/products/settings">
                        <span className="nav-label">Settings</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li
                  className={`${
                    splitLocation[1] === "reports" ? "active" : ""
                  } ${collapse.reports ? "slideddown" : ""}`}
                  onClick={(e) => handleChange(e, "reports", !collapse.reports)}
                >
                  <a className="nav-second-level-label">
                    <span
                      className="fa fa-star f15"
                      style={{ fontSize: "18px" }}
                    />
                    <span className="fa arrow"></span>
                  </a>
                  <ul
                    className={`nav nav-second-level ${
                      splitLocation[1] !== "reports" && !collapse.reports
                        ? "collapse"
                        : ""
                    }`}
                  >
                    <li>
                      <Link to="/reports/total_sales">
                        <span className="nav-label">Total Sales</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/estimated_payroll">
                        <span className="nav-label">Estimated Payroll</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/services_completed">
                        <span className="nav-label">Services Completed</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/product_sales">
                        <span className="nav-label">Product Sales</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/client_report">
                        <span className="nav-label">Client Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/new_client_report">
                        <span className="nav-label">
                          New Clients: Rebookings
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/staff_booking_analysis">
                        <span className="nav-label">
                          Staff Booking Analysis
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reports/30_day_snapshot">
                        <span className="nav-label">30 Day Snapshot</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li
                  className={
                    splitLocation[1] === "insrtuctions" ? "active" : ""
                  }
                >
                  <Link to="/insrtuctions">
                    <span
                      className="fa fa-video"
                      style={{ fontSize: "18px" }}
                    ></span>
                  </Link>
                </li>
                <li className={splitLocation[1] === "messages" ? "active" : ""}>
                  <Link to="/messages">
                    <span
                      className="fa fa-comments"
                      style={{ fontSize: "18px" }}
                    />
                  </Link>
                </li>
                <li
                  className={splitLocation[1] === "terminals" ? "active" : ""}
                >
                  <Link to="/terminals">
                    <span
                      className="fa fa-terminal"
                      style={{ fontSize: "18px" }}
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </ul>
      )}
      {props.authenticated &&
        props.user.roles &&
        props.user.roles.includes("sadmin") && (
          <div className="profile-element">
            <ul className="nav metismenu" id="side-menu">
              <li>
                <Link to="/users">
                  <span className="fa fas fa-users"></span>&nbsp;
                  <span className="nav-label">Business Clients</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      {props.authenticated &&
        props.user.roles &&
        props.user.roles.includes("sadmin") && (
          <div>
            <ul className="nav metismenu" id="side-menu">
              <li>
                <Link to="/users">
                  <span className="fa fas fa-users"></span>&nbsp;
                </Link>
              </li>
            </ul>
          </div>
        )}
      {props.authenticated &&
        props.user.roles &&
        props.user.roles.includes("stylist") && (
          <div className="profile-element">
            <ul className="nav metismenu" id="side-menu">
              <li>
                <a>
                  <span className="fa fas far fa-calendar-alt"></span>&nbsp;
                  <span className="nav-label">Schedule</span>
                </a>
              </li>
              <li>
                <a>
                  <span className="far fa-calendar-check"></span>&nbsp;
                  <span className="nav-label">Staff Schedule</span>
                </a>
              </li>
              <li>
                <a className="nav-second-level-label">
                  <span className="fa fas fa-cut"></span>&nbsp;
                  <span className="nav-label">Services</span>
                  <span className="fa arrow"></span>
                </a>
                <ul className="nav nav-second-level">
                  <li>
                    <a>
                      <span className="nav-label">Orders</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a className="nav-second-level-label">
                  <span className="fa fa-gifts"></span>&nbsp;
                  <span className="nav-label">Products</span>
                  <span className="fa arrow"></span>
                </a>
                <ul className="nav nav-second-level">
                  <li>
                    <a>
                      <span className="nav-label">Orders</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a className="nav-second-level-label">
                  <span className="fa fa-star"></span>&nbsp;
                  <span className="nav-label">Reports</span>
                  <span className="fa arrow"></span>
                </a>
                <ul className="nav nav-second-level">
                  <li>
                    <a>
                      <span className="nav-label">Total Sales</span>
                    </a>
                  </li>
                  <li>
                    <a>
                      <span className="nav-label">Estimated Payroll</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        )}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  authenticated: state.user.authenticated,
  user: state.user.credentials,
});

const mapActionsToProps = {
  logoutUser,
};

export default connect(mapStateToProps, mapActionsToProps)(SideMenu);
