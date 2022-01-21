import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import PageHeader from "../../core/PageHeader";
import { getAllStaff } from "../../../redux/actions/staffActions";
import { getAllOrder } from "../../../redux/actions/serviceActions";
import { sorting, buildFilter, commafy } from "../../../utils/common";
import {
  deleteAppointment,
  deleteFutureAppointment,
  noShowAppointments,
} from "../../../redux/actions/scheduleActions";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import DeleteModal from "../../core/DeleteModal";
import { Button } from "react-bootstrap";
import moment from "moment";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const ServiceOrders = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title] = useState("Service Orders");
  const [orderBy, setOrderBy] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [field, setField] = useState("appTimeStart");
  const [activePage, setActivePage] = useState(1);
  const [perPage] = useState(10);
  const [buttons] = useState([
    {
      title: "Add Appointment",
      url: "/schedule/add-appointment",
    },
  ]);
  const [getproductOrders, setGetProductOrders] = useState<any[]>([]);
  const [staffVal, setStaffVal] = useState("all");
  const [statusVal, setStatusVal] = useState("all");
  const [modalPopup, setModalPopup] = useState({
    deleteModal: false,
    id: "",
    name: "",
    index: "",
  });
  const [initialModalPopup] = useState({ ...modalPopup });
  const [params, setParams] = useState({
    date: moment(new Date()).format("YYYY-MM-DD"),
    staff: "",
  });

  const userDetails = localStorage.getItem("userDetails");
  const [localUser, setLocalUser] = useState({
    businessId: "",
    name: "1",
    id: "1",
    email: "1",
    firstName: "1",
    lastName: "1",
  });
  const [date, setDate] = useState(new Date());

  // From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const service = useSelector((state: any) => state.service);
  const allStaff = user.allStaff;
  const allOrder = service.orderDetails;

  useEffect(
    () => setLocalUser(JSON.parse(localStorage.userDetails)),
    [userDetails]
  );

  useEffect(() => {
    handleOrderSearch();
  }, [date]);

  useEffect(() => {
    getAllStaff();
    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  useEffect(() => {
    setGetProductOrders(allOrder);
    tempFliterData();
  }, [allOrder, statusVal, staffVal]);

  console.log(getproductOrders);

  const getAllStaff = () => {
    var data: any = {
      filter: {
        status: {
          $in: ["active", "inactive"],
        },
        roles: {
          $in: ["stylist"],
        },
      },
    };
    var query = buildFilter(data);
    query.text = "";
    query.businessId = localStorage.businessId;
    props.getAllStaff(query);
  };

  const handleOrderSearch = () => {
    let dateAppointment = moment(date).startOf("day");
    let start = new Date(
      moment(dateAppointment)
        .add(0, "day")
        .startOf("day")
        .subtract(1, "milliseconds")
    );
    start.setTime(start.getTime() - start.getTimezoneOffset() * 60 * 1000);
    let startDate = start.toISOString();
    let end = new Date(
      moment(dateAppointment).add(0, "day").endOf("day").add(1, "milliseconds")
    );
    end.setTime(end.getTime() - end.getTimezoneOffset() * 60 * 1000);
    let endDate = end.toISOString();
    // var start: any = moment(new Date(date)).subtract(1, "days").toISOString();
    // var end = moment(new Date(date)).add(1, "days").toISOString();
    var data: any = {
      timeStart: {
        $lte: endDate,
        $gt: startDate,
      },
    };
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.getAllOrder(query);
  };

  const handleChange = (event: any) => {
    setParams({
      ...params,
      [event.target.name]: event.target.value,
    });
  };

  const deletePopup = (order: any, index: any) => {
    setModalPopup({
      deleteModal: !modalPopup.deleteModal,
      id: order.id,
      name: order.clientName,
      arr: order,
    });
  };

  const futureAppoinmentPopup = (order: any, index: any) => {
    setModalPopup({
      deleteModal: !modalPopup.deleteModal,
      id: order.id,
      name: order.clientName,
    });
  };

  const closeModal = () => {
    setModalPopup(initialModalPopup);
  };

  const handleDelete = () => {
    if (modalPopup.arr.repeatRefId) {
      let params = {
        ...modalPopup.arr,
        businessId: localStorage.getItem("businessId"),
        canceledBy: {
          email: localUser.email,
          id: localUser.id,
          name: localUser.firstName + " " + localUser.lastName,
          at: moment().toISOString(),
        },
        canceledFrom: "web",
        created: null,
        updated: null,
      };
      props.deleteFutureAppointment(modalPopup.id, params);
      closeModal();
      getAllStaff();
      handleOrderSearch();
    } else {
      let params = {
        businessId: localStorage.getItem("businessId"),
        canceledBy: {
          email: localUser.email,
          id: localUser.id,
          name: localUser.firstName + " " + localUser.lastName,
          at: moment().toISOString(),
        },
        canceledFrom: "web",
      };
      props.deleteAppointment(modalPopup.id, params);
      closeModal();
      getAllStaff();
      handleOrderSearch();
    }
  };

  const handleNoShow = () => {
    if (modalPopup.id.repeatRefId) {
    } else {
      let params = {
        businessId: localStorage.getItem("businessId"),
        canceledBy: {
          email: localUser.email,
          id: localUser.id,
          name: localUser.firstName + " " + localUser.lastName,
          at: moment().toISOString(),
        },
        canceledFrom: "web",
        noShow: true,
      };
      props.noShowAppointments(modalPopup.id, params);
      closeModal();
      getAllStaff();
      handleOrderSearch();
    }
  };

  const handleFutureDelete = () => {};

  const handleSortChange = (key: any) => {
    if (field === key) {
      setOrderBy(!orderBy);
    } else {
      setOrderBy(true);
      setField(key);
    }
    sorting(allOrder, key, orderBy);
  };

  const tempFliterData = () => {
    if (allOrder && allOrder.length) {
      const tempstatusVal = (newFliterJob: any) => {
        if (statusVal == "all") {
          if (staffVal == "all") {
            setGetProductOrders(newFliterJob);
          } else {
            const newSecFliterJob: any = newFliterJob.filter((data: any) => {
              return Object.values(data)
                .join(" ")
                .toLocaleLowerCase()
                .includes(staffVal);
            });
            setGetProductOrders(newSecFliterJob);
          }
        } else {
          const newSecFliterJob: any = newFliterJob.filter((data: any) => {
            return Object.values(data)
              .join(" ")
              .toLocaleLowerCase()
              .includes(statusVal);
          });
          setGetProductOrders(newSecFliterJob);
        }
      };
      const staffData = (staffValData: any) => {
        if (staffVal == "all") {
          const newFliterJob: any = staffValData;
          tempstatusVal(newFliterJob);
        } else {
          const newFliterJob: any = staffValData.filter((data: any) => {
            return Object.values(data)
              .join(" ")
              .toLocaleLowerCase()
              .includes(staffVal);
          });
          tempstatusVal(newFliterJob);
        }
      };
      staffData(allOrder);
    }
  };

  const price = (searchResults: any) => {
    let sumOfAddition = 0;
    searchResults.forEach((element: any) => {
      if (element.status != "canceled") {
        sumOfAddition += element.amount;
      }
    });
    return sumOfAddition;
  };

  const tax = (searchResults: any) => {
    let sumOfAddition = 0;
    searchResults.forEach((element: any) => {
      if (element.status != "canceled") {
        sumOfAddition += element.tax;
      }
    });
    return sumOfAddition;
  };

  const total = (searchResults: any) => {
    let sumOfAddition = 0;
    searchResults.forEach((element: any) => {
      if (element.status != "canceled") {
        sumOfAddition += element.total;
      }
    });
    return sumOfAddition;
  };

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading && (
        <React.Fragment>
          <PageHeader title={title} buttons={buttons} />
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <div className="ibox float-e-margins">
                  <div className="ibox-content">
                    <form role="form">
                      <div className="row">
                        <div className="col-sm-3">
                          <div className="form-group">
                            <label>Date</label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                className="form-control"
                                value={moment(date).format("YYYY-MM-DD")}
                                onChange={(date: any) => {
                                  setDate(date);
                                }}
                                format="yyyy-MM-dd"
                                style={{
                                  border: "1px solid #e5e6e7",
                                }}
                                showTodayButton={true}
                                keyboardIcon={
                                  <i className="glyphicon glyphicon-calendar"></i>
                                }
                              />
                            </MuiPickersUtilsProvider>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-group">
                            <label>Staff</label>
                            <select
                              className="form-control"
                              onChange={(e) => {
                                setStaffVal(e.target.value);
                              }}
                              name="staff"
                            >
                              <option value="">All</option>
                              <optgroup label="Stylist">
                                {allStaff &&
                                  allStaff.length &&
                                  allStaff.map((value: any) => {
                                    if (
                                      value.roles.includes("stylist") &&
                                      !value.deleted &&
                                      value.status == "active"
                                    ) {
                                      return (
                                        <option value={value.id}>
                                          {value.name}
                                        </option>
                                      );
                                    }
                                  })}
                              </optgroup>
                              <optgroup label="Admin/Support">
                                {allStaff &&
                                  allStaff.length &&
                                  allStaff.map((value: any) => {
                                    if (
                                      !value.roles.includes("stylist") &&
                                      !value.deleted &&
                                      value.status == "active"
                                    ) {
                                      return (
                                        <option value={value.id}>
                                          {value.name}
                                        </option>
                                      );
                                    }
                                  })}
                              </optgroup>
                              <optgroup label="In Active">
                                {allStaff &&
                                  allStaff.length &&
                                  allStaff.map((value: any) => {
                                    if (value.status == "inactive") {
                                      return (
                                        <option value={value.id}>
                                          {value.name}
                                        </option>
                                      );
                                    }
                                  })}
                              </optgroup>
                              <optgroup label="Deleted">
                                {allStaff &&
                                  allStaff.length &&
                                  allStaff.map((value: any) => {
                                    if (value.deleted) {
                                      return (
                                        <option value={value.id}>
                                          {value.name}
                                        </option>
                                      );
                                    }
                                  })}
                              </optgroup>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-group">
                            <label>Status</label>
                            <select
                              className="form-control"
                              name="type"
                              onChange={(e) => {
                                setStatusVal(e.target.value);
                              }}
                            >
                              <option value="all">All</option>
                              <option value="paid">paid</option>
                              <option value="created">Created</option>
                              <option value="canceled">Canceled</option>
                              <option value="noshow">No Show</option>
                              <option value="extra_service_request">
                                Requested
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div className="hr-line-dashed"></div>
                    <div className="table-responsive">
                      <table
                        className="table table-bordered table-striped table-hover dataTables-example"
                        id="orderTable"
                      >
                        <thead>
                          <tr>
                            <th
                              className={
                                field !== "appTimeStart"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }
                              onClick={(e) => handleSortChange("appTimeStart")}
                            >
                              Date/Time
                            </th>
                            <th
                              className={
                                field !== "clientName"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }
                              onClick={(e) => handleSortChange("clientName")}
                            >
                              Customer
                            </th>
                            <th
                              className={
                                field !== "staffName"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }
                              onClick={(e) => handleSortChange("staffName")}
                            >
                              Staff
                            </th>
                            <th
                              className={
                                field !== "categoryName"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }
                              onClick={(e) => handleSortChange("categoryName")}
                            >
                              Category
                            </th>
                            <th
                              className={
                                field !== "items[0].name"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }
                              onClick={(e) => handleSortChange("items[0].name")}
                            >
                              Services
                            </th>
                            <th
                              className={
                                field !== "amount"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }
                              onClick={(e) => handleSortChange("amount")}
                            >
                              Price
                            </th>
                            <th
                              className={
                                field !== "tip"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }
                              onClick={(e) => handleSortChange("tip")}
                            >
                              Tip
                            </th>
                            <th
                              className={
                                field !== "total"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }
                              onClick={(e) => handleSortChange("total")}
                            >
                              Total
                            </th>
                            <th
                              className={
                                field !== "status"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }
                              onClick={(e) => handleSortChange("status")}
                            >
                              Status
                            </th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        {!UI.buttonLoading ? (
                          <tbody>
                            {allOrder &&
                            allOrder &&
                            allOrder.length &&
                            getproductOrders &&
                            getproductOrders.length ? (
                              <React.Fragment>
                                {getproductOrders.map(
                                  (order: any, index: any) => {
                                    return (
                                      <React.Fragment>
                                        <tr className="gradeX">
                                          <td>
                                            {moment
                                              .utc(order.timeStart)
                                              .format("lll")}
                                          </td>
                                          <td
                                            style={{
                                              textTransform: "capitalize",
                                            }}
                                          >
                                            {order.clientName}
                                          </td>
                                          <td
                                            style={{
                                              textTransform: "capitalize",
                                            }}
                                          >
                                            {order.staffName}
                                          </td>
                                          <td>
                                            {order.categoryId &&
                                            order.rootCategoryId
                                              ? order.categoryId ===
                                                order.rootCategoryId
                                                ? order.rootCategoryName
                                                : order.rootCategoryName +
                                                  "|" +
                                                  order.categoryName
                                              : order.rootCategoryId
                                              ? order.rootCategoryName
                                              : order.categoryName}
                                          </td>
                                          <td>{order.itemNames}</td>
                                          <td className="text-center">
                                            ${order.amount.toFixed(2)}
                                          </td>
                                          <td className="text-center">
                                            ${order.tip.toFixed(2)}
                                          </td>
                                          <td className="text-center">
                                            ${order.total.toFixed(2)}
                                          </td>
                                          <td className="text-capitalize text-center">
                                            {order.status === "paid" ? (
                                              <Button
                                                className="btn btn-xs"
                                                variant="success"
                                                style={{ width: "80px" }}
                                              >
                                                Paid
                                              </Button>
                                            ) : order.status === "created" ? (
                                              <Button
                                                className="btn btn-xs"
                                                variant="primary"
                                                style={{ width: "80px" }}
                                              >
                                                Created
                                              </Button>
                                            ) : order.status === "canceled" &&
                                              order.noShow == true ? (
                                              <Button
                                                className="btn-xs"
                                                variant="warning"
                                                style={{ width: "80px" }}
                                              >
                                                No Show
                                              </Button>
                                            ) : order.status === "canceled" ? (
                                              <Button
                                                className="btn-xs"
                                                variant="danger"
                                                style={{ width: "80px" }}
                                              >
                                                Cancelled
                                              </Button>
                                            ) : order.status === "refund" ? (
                                              <Button
                                                className="btn-xs"
                                                variant="danger"
                                                style={{ width: "80px" }}
                                              >
                                                Refund
                                              </Button>
                                            ) : order.status === "voided" ? (
                                              <Button
                                                className="btn-xs"
                                                variant="warning"
                                                style={{ width: "80px" }}
                                              >
                                                Voided
                                              </Button>
                                            ) : order.status ===
                                              "extra_service_request" ? (
                                              <Button
                                                className="btn-xs"
                                                variant="warning"
                                                style={{ width: "80px" }}
                                              >
                                                Requested
                                              </Button>
                                            ) : (
                                              <></>
                                            )}
                                          </td>
                                          <td className="text-center">
                                            {order.status === "created" && (
                                              <React.Fragment>
                                                <Link
                                                  style={{
                                                    cursor: "pointer",
                                                    color: "#2a6954",
                                                  }}
                                                  key={index}
                                                  to={`/schedule/edit-appointment/view/${order.id}`}
                                                >
                                                  <i
                                                    title="View | Edit"
                                                    className="far fa-edit"
                                                  ></i>
                                                  &nbsp;&nbsp;
                                                </Link>
                                                <Link
                                                  style={{
                                                    cursor: "pointer",
                                                    color: "#2a6954",
                                                  }}
                                                  key={index}
                                                  to={`/services/payments/view/${order.id}`}
                                                >
                                                  <i
                                                    title="View | Edit"
                                                    className="far fa-money-bill-alt"
                                                  ></i>
                                                  &nbsp;&nbsp;
                                                </Link>
                                                <a
                                                  style={{
                                                    cursor: "pointer",
                                                    color: "#2a6954",
                                                  }}
                                                  name="delete"
                                                  onClick={() =>
                                                    deletePopup(order, index)
                                                  }
                                                >
                                                  <i
                                                    title="Delete"
                                                    className="far fa-trash-alt"
                                                  ></i>
                                                </a>
                                                <br />
                                                {order.repeatRefId && (
                                                  <a
                                                    style={{
                                                      cursor: "pointer",
                                                      color: "#2a6954",
                                                    }}
                                                    onClick={() =>
                                                      deletePopup(order, index)
                                                    }
                                                  >
                                                    <i
                                                      title="Delete Future Appoinment"
                                                      className="fa far fa-redo"
                                                    ></i>
                                                  </a>
                                                )}
                                              </React.Fragment>
                                            )}

                                            {order.status === "canceled" && (
                                              <React.Fragment>
                                                <Link
                                                  style={{
                                                    cursor: "pointer",
                                                    color: "#2a6954",
                                                  }}
                                                  key={index}
                                                  to={`/services/payments/view/${order.id}`}
                                                >
                                                  <i
                                                    title="View"
                                                    className="far fa-eye"
                                                  ></i>
                                                </Link>
                                              </React.Fragment>
                                            )}
                                          </td>
                                        </tr>
                                      </React.Fragment>
                                    );
                                  }
                                )}
                                <tr>
                                  <td colSpan={5}>
                                    <strong>Summary: </strong>
                                  </td>
                                  <th className="text-center">
                                    $
                                    {commafy(
                                      (
                                        Math.round(
                                          price(getproductOrders) * 100
                                        ) / 100
                                      ).toFixed(2)
                                    )}
                                  </th>
                                  <th className="text-center">
                                    $
                                    {commafy(
                                      (
                                        Math.round(
                                          tax(getproductOrders) * 100
                                        ) / 100
                                      ).toFixed(2)
                                    )}
                                  </th>
                                  <th className="text-center" colSpan={1}>
                                    $
                                    {commafy(
                                      (
                                        Math.round(
                                          total(getproductOrders) * 100
                                        ) / 100
                                      ).toFixed(2)
                                    )}
                                  </th>
                                  <th colSpan={2}></th>
                                </tr>
                              </React.Fragment>
                            ) : (
                              <tr>
                                <td colSpan={10} className="text-center">
                                  No Service Orders
                                </td>
                              </tr>
                            )}
                          </tbody>
                        ) : (
                          <tbody>
                            <tr>
                              <td colSpan={10} className="text-center">
                                <React.Fragment>Loading...</React.Fragment>
                              </td>
                            </tr>
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <DeleteModal
                title="Category"
                modalPopup={modalPopup}
                closeModal={closeModal}
                handleDelete={handleDelete}
                handleNoShow={handleNoShow}
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapActionsToProps = {
  getAllStaff,
  getAllOrder,
  deleteAppointment,
  deleteFutureAppointment,
  noShowAppointments,
};

export default connect(null, mapActionsToProps)(ServiceOrders);
