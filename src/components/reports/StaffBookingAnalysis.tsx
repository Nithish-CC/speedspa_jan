import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { searchStaffBookingAnalysis } from "../../redux/actions/reportActions";
import { getAllClients } from "../../redux/actions/clientActions";
import { sorting, commafy, buildFilter } from "../../utils/common";
import PageHeader from "../core/PageHeader";
import moment from "moment";
import { Modal, Container } from "react-bootstrap";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const StaffBokkingAnalysis = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title] = useState("Staff Booking Analysis");
  const [orderBy, setOrderBy] = useState(false);
  const [field, setField] = useState("createdAt");
  const [params, setParams] = useState({
    begin_time: moment(new Date()).startOf("day").utc().format(),
    end_time: moment(new Date()).endOf("day").utc().format(),
  });
  const [modalPopup, setModalPopup] = useState({
    deleteModal: false,
    name: [],
    index: "",
  });
  const [initialModalPopup] = useState({ ...modalPopup });
  const [name, setName] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const report = useSelector((state: any) => state.report);
  const fetchStaffBookingAnalysis = report.reportStaffBookingAnalysis;

  useEffect(() => {
    handleSearch();
    getAllClients();
    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  useEffect(() => {
    filterData();
  }, [fetchStaffBookingAnalysis]);

  const getAllClients = () => {
    var requestRoles = ["admin", "support", "stylist"];
    var data: any = {
      filter: {
        roles: {
          $in: requestRoles,
        },
      },
    };
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.getAllClients(query);
  };

  const filterData = () => {
    if (name) {
      const newFliterJob: any = fetchStaffBookingAnalysis[0].data.filter(
        (data: any) => {
          return Object.values(data)
            .join(" ")
            .toLocaleLowerCase()
            .includes(name.toLocaleLowerCase());
        }
      );
      setSearchResults(newFliterJob);
    } else if (fetchStaffBookingAnalysis && fetchStaffBookingAnalysis.length) {
      setSearchResults(fetchStaffBookingAnalysis[0].data);
    }
  };

  const trim = (str: any) => {
    return setName(str.replace(/^\s\s*/, "").replace(/\s\s*$/, ""));
  };

  const totalGrossServiceRevenue = (searchResults: any) => {
    let sumOfAddition = 0;
    searchResults.forEach((element: any) => {
      sumOfAddition += element.totalGrossServiceRevenue;
    });
    return sumOfAddition;
  };

  const addTotalCount = (searchResults: any) => {
    let sumOfAddition = 0;
    searchResults.forEach((element: any) => {
      sumOfAddition += element.totalCount;
    });
    return sumOfAddition;
  };

  const addSpecificCount = (searchResults: any) => {
    let sumOfAddition = 0;
    searchResults.forEach((element: any) => {
      sumOfAddition += element.specificCount;
    });
    return sumOfAddition;
  };

  const addFlexibleCount = (searchResults: any) => {
    let sumOfAddition = 0;
    searchResults.forEach((element: any) => {
      sumOfAddition += element.flexibleCount;
    });
    return sumOfAddition;
  };

  const handleChange = (event: any) => {
    setParams({
      ...params,
      [event.target.name]: event.target.value,
    });
  };

  const handleSearch = () => {
    const input = {
      ...params,
      businessId: localStorage.businessId,
    };
    props.searchStaffBookingAnalysis(input);
  };

  const handleModalPopup = (value: any, index: any) => {
    setModalPopup({
      deleteModal: !modalPopup.deleteModal,
      name: value,
      index: index,
    });
  };

  const closeModal = () => {
    setModalPopup(initialModalPopup);
  };

  function ModalWithGrid(props: any) {
    const { modalPopup, closeModal } = props;
    return (
      <Modal size="lg" show={modalPopup.deleteModal} centered>
        <Modal.Header>
          <button
            className="btn btn-secondary"
            style={{ float: "right" }}
            onClick={() => closeModal()}
          >
            X
          </button>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <div className="row">
              <div className="col-sm-12">
                <div
                  className="table-responsive"
                  id="specificClientReportPrintDiv"
                  style={{ width: "70%" }}
                >
                  <table className="table table-striped table-bordered table-condensed align-middle">
                    <tr>
                      <th
                        className="text-left text-uppercase"
                        style={{ width: "60%" }}
                      >
                        STAFF BOOKING ANALYSIS
                      </th>
                      <th className="text-center" style={{ width: "40%" }}>
                        <i>
                          {moment(params.begin_time).format("LL")} -{" "}
                          {moment(params.end_time).format("LL")}
                        </i>
                      </th>
                    </tr>
                  </table>
                  <table className="table table-striped table-bordered table-condensed align-middle">
                    <thead>
                      <tr>
                        <th colSpan={5} className="text-center text-uppercase">
                          {modalPopup.name.staffName}
                        </th>
                      </tr>
                      <tr>
                        <th className="text-center">Email</th>
                        <th className="text-center">Flexible Count</th>
                        <th className="text-center">Specific Count</th>
                        <th className="text-center">Total Count</th>
                        <th className="text-center">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td>{modalPopup.name.staffEmail}</td>
                        <td>{modalPopup.name.flexibleCount}</td>
                        <td>{modalPopup.name.specificCount}</td>
                        <td>
                          <strong>{modalPopup.name.totalCount}</strong>
                        </td>
                        <td>
                          <strong>
                            $
                            {commafy(
                              Math.round(
                                (modalPopup.name.totalGrossServiceRevenue *
                                  100) /
                                  100
                              ).toFixed(2)
                            )}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p>
                    <b>Services Details</b>
                  </p>
                  <table className="table table-striped table-bordered table-condensed align-middle">
                    <thead>
                      <tr>
                        <th className="text-center">Staff</th>
                        <th className="text-center">Services</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Tip</th>
                        <th className="text-center">Tax</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalPopup.name.data &&
                        modalPopup.name.data.length &&
                        modalPopup.name.data.map((value: any) => {
                          return (
                            <tr>
                              <td className="text-capitalize text-left">
                                <strong>{value.clientName}</strong>
                                <br />
                                <small>
                                  <i>
                                    {moment(value.updatedAt).format("LL LT")}
                                  </i>
                                </small>
                              </td>
                              <td className="text-center text-capitalize">
                                {value.itemNames}
                              </td>
                              <td className="text-center">
                                $
                                {commafy(
                                  Math.round(
                                    (value.amount * 100) / 100
                                  ).toFixed(2)
                                )}
                              </td>
                              <td className="text-center">
                                $
                                {commafy(
                                  Math.round((value.tip * 100) / 100).toFixed(2)
                                )}
                              </td>
                              <td className="text-center">
                                $
                                {commafy(
                                  Math.round((value.tax * 100) / 100).toFixed(2)
                                )}
                              </td>
                              <td className="text-center">
                                $
                                {commafy(
                                  Math.round((value.total * 100) / 100).toFixed(
                                    2
                                  )
                                )}
                              </td>
                              <td className="text-center">
                                {value &&
                                  value.requestType.length &&
                                  value.requestType == "NORMAL" &&
                                  "SPECIFIC"}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Container>
        </Modal.Body>
      </Modal>
    );
  }

  const handleSortChange = (key: any) => {
    if (field === key) {
      setOrderBy(!orderBy);
    } else {
      setOrderBy(true);
      setField(key);
    }
    sorting(fetchStaffBookingAnalysis.data, key, orderBy);
  };

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading && (
        <React.Fragment>
          <ModalWithGrid modalPopup={modalPopup} closeModal={closeModal} />
          <PageHeader title={title} />
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <div className="ibox float-e-margins m-b-none">
                  <div className="ibox-content">
                    <form role="form">
                      <div className="row">
                        <div className="col-sm-3">
                          <div className="form-group">
                            <label>Start Date</label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                className="form-control"
                                value={moment(params.begin_time).format(
                                  "YYYY-MM-DD"
                                )}
                                onChange={(e: any, date: any) => {
                                  setParams({
                                    begin_time: moment(date)
                                      .startOf("day")
                                      .utc()
                                      .format(),
                                    end_time: params.end_time,
                                  });
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
                            <label>End Date</label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                className="form-control"
                                value={moment(params.end_time).format(
                                  "YYYY-MM-DD"
                                )}
                                onChange={(e: any, date: any) => {
                                  setParams({
                                    begin_time: moment(date)
                                      .endOf("day")
                                      .utc()
                                      .format(),
                                    end_time: params.end_time,
                                  });
                                }}
                                views={["year", "month", "date"]}
                                format="yyyy-MM-dd"
                                style={{
                                  border: "1px solid #e5e6e7",
                                }}
                                minDate={params.begin_time}
                                showTodayButton={true}
                                helperText={null}
                                keyboardIcon={
                                  <i className="glyphicon glyphicon-calendar"></i>
                                }
                              />
                              {params.end_time < params.begin_time && (
                                <p className="text-danger">
                                  {" "}
                                  End date should be greater than start date
                                </p>
                              )}
                            </MuiPickersUtilsProvider>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label>Search</label>
                            <input
                              type="text"
                              placeholder="Search by Name"
                              className="form-control"
                              onChange={(e) => trim(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <div className="form-group">
                            <label>&nbsp;</label>
                            <div className="input-group">
                              <button
                                className="btn btn-primary"
                                type="button"
                                onClick={(e) => handleSearch()}
                              >
                                Search
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div className="hr-line-dashed"></div>
                    <div className="row">
                      <div className="col-sm-12 table-responsive">
                        <table className="table table-striped table-bordered table-condensed align-middle dataTables-example">
                          <thead>
                            {!UI.buttonLoading &&
                            fetchStaffBookingAnalysis &&
                            fetchStaffBookingAnalysis.data &&
                            fetchStaffBookingAnalysis.data.length ? (
                              <tr>
                                <th
                                  colSpan={3}
                                  className="text-left text-uppercase"
                                >
                                  {title}
                                </th>
                                <th colSpan={4} className="text-center">
                                  {moment(params.begin_time).format("LL")} -{" "}
                                  {moment(params.end_time).format("LL")}
                                </th>
                              </tr>
                            ) : (
                              <></>
                            )}
                            <tr key="header">
                              <th
                                className={
                                  field != "staffName"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("staffName")}
                              >
                                Staff Name
                              </th>

                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "flexibleCount"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) =>
                                  handleSortChange("flexibleCount")
                                }
                              >
                                Flexible Count
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "specificCount"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) =>
                                  handleSortChange("specificCount")
                                }
                              >
                                Specific Count
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "totalCount"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("totalCount")}
                              >
                                Total Count
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "totalGrossServiceRevenue"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) =>
                                  handleSortChange("totalGrossServiceRevenue")
                                }
                              >
                                Total Amount ($)
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className="text-center ignore"
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {!UI.buttonLoading &&
                            searchResults &&
                            searchResults.length ? (
                              <React.Fragment>
                                {searchResults.map((value: any, index: any) => {
                                  return (
                                    <tr className="gradeX">
                                      <td>{value.staffName}</td>
                                      <td className="text-center">
                                        {commafy(value.flexibleCount)}
                                      </td>
                                      <td className="text-center">
                                        {commafy(value.specificCount)}
                                      </td>
                                      <td className="text-center">
                                        {commafy(value.totalCount)}
                                      </td>
                                      <td className="text-center">
                                        $
                                        {commafy(
                                          Math.round(
                                            (value.totalGrossServiceRevenue *
                                              100) /
                                              100
                                          ).toFixed(2)
                                        )}
                                      </td>
                                      <td>
                                        <a
                                          href=""
                                          data-toggle="modal"
                                          data-target=".bs-example-modal-lg"
                                          onClick={() =>
                                            handleModalPopup(value, index)
                                          }
                                        >
                                          <i className="glyphicon glyphicon-eye-open"></i>
                                          Show
                                        </a>
                                      </td>
                                    </tr>
                                  );
                                })}
                                <tr>
                                  <th>Summary</th>

                                  <th className="text-center">
                                    {commafy(addFlexibleCount(searchResults))}
                                  </th>
                                  <th className="text-center">
                                    {commafy(addSpecificCount(searchResults))}
                                  </th>
                                  <th className="text-center">
                                    {commafy(addTotalCount(searchResults))}
                                  </th>
                                  <th className="text-center">
                                    $
                                    {commafy(
                                      (
                                        Math.round(
                                          totalGrossServiceRevenue(
                                            searchResults
                                          ) * 100
                                        ) / 100
                                      ).toFixed(2)
                                    )}
                                  </th>
                                  <th></th>
                                </tr>
                              </React.Fragment>
                            ) : (
                              <tr>
                                <td colSpan={6} className="text-center">
                                  {!UI.buttonLoading ? (
                                    "No Reports"
                                  ) : (
                                    <div>
                                      <p className="fa fa-spinner fa-spin"></p>{" "}
                                      <br /> Please Wait , Loading...
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
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

const mapActionsToProps = { searchStaffBookingAnalysis, getAllClients };

export default connect(null, mapActionsToProps)(StaffBokkingAnalysis);
