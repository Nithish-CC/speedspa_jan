import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { searchClientReport } from "../../redux/actions/reportActions";
import { getAllClients } from "../../redux/actions/clientActions";
import { sorting, commafy, buildFilter } from "../../utils/common";
import PageHeader from "../core/PageHeader";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Col, Button } from "react-bootstrap";
import XLSX from "xlsx";

const ClientReport = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title] = useState("Client Report");
  const [orderBy, setOrderBy] = useState(false);
  const [field, setField] = useState("totalGrossServiceRevenue");
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
  const clientReportFetch = report.reportClientReport;  

  useEffect(() => {
    getAllClients();
    handleSearch();
    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  useEffect(() => {
    filterData();
  }, [clientReportFetch]);

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

  const handleChange = (event: any) => {
    setParams({
      ...params,
      [event.target.name]: event.target.value,
    });
  };

  function trim1(str: any) {
    return setName(str.replace(/^\s\s*/, "").replace(/\s\s*$/, ""));
  }
  const printModal = (e: any) => {
    const printContents: any = document.getElementById(
      "clientReportModalPrint"
    );
    const WindowPrt: any = window.open(
      "",
      "",
      "left=0,top=0,width=2000,height=1000,toolbar=0,scrollbars=0,status=0"
    );
    WindowPrt.document.write("<html><head>");
    WindowPrt.document.write(
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" integrity="undefined" crossorigin="anonymous"> <style>.ignore{display: none}</style>'
    );
    WindowPrt.document.write("</head><body>");
    WindowPrt.document.write(printContents.innerHTML);
    WindowPrt.document.write("</body></html>");
    WindowPrt.document.close();
    WindowPrt.focus();
    setTimeout(() => {
      WindowPrt.print();
      WindowPrt.close();
    }, 500);
  };

  const printContent = (e: any) => {
    const printContents: any = document.getElementById("clientReportPrint");
    const WindowPrt: any = window.open(
      "",
      "",
      "left=0,top=0,width=2000,height=1000,toolbar=0,scrollbars=0,status=0"
    );
    WindowPrt.document.write("<html><head>");
    WindowPrt.document.write(
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" integrity="undefined" crossorigin="anonymous"> <style>.ignore{display: none}</style>'
    );
    WindowPrt.document.write("</head><body>");
    WindowPrt.document.write(printContents.innerHTML);
    WindowPrt.document.write("</body></html>");
    WindowPrt.document.close();
    WindowPrt.focus();
    setTimeout(() => {
      WindowPrt.print();
      WindowPrt.close();
    }, 500);
  };

  const ExportToExcel = (e: any, data: any) => {
    let jsonData: any = [];
    let pathName =
      params.begin_time === params.end_time
        ? "ClientReport_" + moment(params.end_time).format("MM_DD_YYYY")
        : "ClientReport_" +
          moment(params.begin_time).format("MM_DD_YYYY") +
          "_to_" +
          moment(params.end_time).format("MM_DD_YYYY");
    data.data.forEach((report: any) => {
      jsonData.push({
        "Client Name": report.clientName,
        "NoShow Count": report.noShowCount,
        "Flexible Count": report.flexibleCount,
        "Specific Count": report.specificCount,
        "Total Count": report.totalCount,
        "Total Amount ($)": "$" + report.totalGrossServiceRevenue.toFixed(2),
      });
    });
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          "Summary:",
          data.summaryOfNoShowCount,
          data.summaryOfFlexibleCount,
          data.summaryOfSpecificCount,
          data.summaryOfTotalCount,
          "$" + data.summaryOfTotalGrossServiceRevenue.toFixed(2),
        ],
      ],
      {
        origin: -1,
      }
    );
    XLSX.utils.book_append_sheet(wb, ws, "data");
    XLSX.writeFile(wb, pathName + ".xlsx");
  };

  const filterData = () => {
    if (name) {
      const newFliterJob: any = clientReportFetch[0].data.filter(
        (data: any) => {
          return Object.values(data)
            .join(" ")
            .toLocaleLowerCase()
            .includes(name.toLocaleLowerCase());
        }
      );
      setSearchResults(newFliterJob);
    } else if (clientReportFetch && clientReportFetch.length) {
      setSearchResults(
        _.orderBy(
          clientReportFetch[0].data,
          ["totalGrossServiceRevenue"],
          ["desc"]
        )
      );
    }
  };

  const handleSearch = () => {
    const input = {
      ...params,
      businessId: localStorage.businessId,
    };
    props.searchClientReport(input);
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

  const ModalWithGrid = (props: any) => {
    const { modalPopup, closeModal } = props;
    return (
      <Modal
        size="lg"
        show={modalPopup.deleteModal}
        centered={true}
        animation={false}
      >
        <ModalBody className="text-center">
          <button
            className="btn btn-sm btn-default ng-isolate-scope fontWeight-600"
            style={{
              marginBottom: "10px",
              background: "#EFEFEF",
              borderColor: "#dddddd",
            }}
            name="specificClientReportPrintDiv"
            id="printBtn"
            onClick={(e) => {
              printModal(e);
            }}
          >
            Print <i className="fa fa-print"></i>
          </button>
          <button type="button" className="close" onClick={() => closeModal()}>
            <span aria-hidden="true">×</span>
          </button>
          <h3 className="text-center">
            {/*<print-html name='specificClientReportPrintDiv' id='printBtn'></print-html>&nbsp; <span id='staff-detail-modal-close' aria-hidden='true' class='close' data-dismiss='modal'
                        aria-label='Close'>&times;</span>*/}
          </h3>
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12" id="clientReportModalPrint">
                <div
                  className="table-responsive"
                  id="specificClientReportPrintDiv"
                >
                  <table className="table table-striped table-bordered table-condensed align-middle">
                    <thead>
                      <tr>
                        <th
                          className="text-left text-uppercase"
                          style={{ width: "60%" }}
                        >
                          Client Report
                        </th>
                        <th className="text-center" style={{ width: "40%" }}>
                          <i>
                            {moment(params.begin_time).format("MMM DD, YYYY")} -
                            &nbsp;
                            {moment(params.end_time).format("MMM DD, YYYY")}
                          </i>
                        </th>
                      </tr>
                    </thead>
                  </table>
                  <table className="table table-striped table-bordered table-condensed align-middle">
                    <thead>
                      <tr>
                        <th colSpan={6} className="text-center text-uppercase">
                          {modalPopup.name.clientName}
                        </th>
                      </tr>
                      <tr>
                        <th className="text-center">Phone Number</th>
                        <th className="text-center">No Show Count</th>
                        <th className="text-center">Flexible Count</th>
                        <th className="text-center">Specific Count</th>
                        <th className="text-center">Total Count</th>
                        <th className="text-center">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td>{modalPopup.name.clientPhoneNumber}</td>
                        <td>{modalPopup.name.noShowCount}</td>
                        <td>{modalPopup.name.flexibleCount}</td>
                        <td>{modalPopup.name.specificCount}</td>
                        <td>
                          <strong>{modalPopup.name.totalCount}</strong>
                        </td>
                        {modalPopup.name.totalGrossServiceRevenue &&
                          modalPopup.name.totalGrossServiceRevenue.toString()
                            .length && (
                            <td>
                              <strong>
                                $
                                {modalPopup.name.totalGrossServiceRevenue.toFixed(
                                  2
                                )}
                              </strong>
                            </td>
                          )}
                      </tr>
                    </tbody>
                  </table>
                  <p style={{ textAlign: "left" }}>
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
                                <strong>{value.staffName}</strong>
                              </td>
                              <td className="text-center text-capitalize">
                                {value.itemNames}
                              </td>
                              <td className="text-center">
                                ${value.amount.toFixed(2)}
                              </td>
                              <td className="text-center">
                                ${value.tip.toFixed(2)}
                              </td>
                              <td className="text-center">
                                ${value.tax.toFixed(2)}
                              </td>
                              <td className="text-center">
                                ${value.total.toFixed(2)}
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
          </div>
        </ModalBody>
      </Modal>
    );
  };

  const handleSortChange = (key: any) => {
    if (field === key) {
      setOrderBy(!orderBy);
    } else {
      setOrderBy(true);
      setField(key);
    }
    sorting(clientReportFetch[0].data, key, orderBy);
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
                                    begin_time: params.begin_time,
                                    end_time: moment(date)
                                      .endOf("day")
                                      .utc()
                                      .format(),
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
                              placeholder="Search by Client Name"
                              className="form-control ng-pristine ng-valid ng-empty ng-touched"
                              onChange={(e) => trim1(e.target.value)}
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
                      {searchResults && searchResults.length ? (
                        <Col sm="12" className="text-right">
                          <Button
                            size="sm"
                            className="btn-default fontWeight-600"
                            onClick={(e) => printContent(e)}
                            style={{
                              marginBottom: "10px",
                              background: "#EFEFEF",
                              borderColor: "#dddddd",
                            }}
                            name="clientReportPrintDiv"
                            id="printBtn"
                          >
                            Print <i className="fa fa-print "></i>
                          </Button>
                          &nbsp;
                          <Button
                            size="sm"
                            className="btn-default fontWeight-600"
                            style={{
                              marginBottom: "10px",
                              background: "#EFEFEF",
                              borderColor: "#dddddd",
                            }}
                            onClick={(e) =>
                              ExportToExcel(e, clientReportFetch[0])
                            }
                          >
                            Export to Excel <i className="fa fa-download"></i>
                          </Button>
                        </Col>
                      ) : (
                        <></>
                      )}
                      <div
                        className="col-sm-12 table-responsive"
                        id="clientReportPrint"
                      >
                        <table className="table table-striped table-bordered table-condensed align-middle dataTables-example">
                          <thead>
                            {!UI.buttonLoading &&
                              clientReportFetch[0] &&
                              clientReportFetch[0].data &&
                              clientReportFetch[0].data.length > 0 && (
                                <React.Fragment>
                                  <tr>
                                    <th
                                      colSpan={3}
                                      className="text-left text-uppercase"
                                    >
                                      {title}
                                    </th>
                                    <th colSpan={4} className="text-center">
                                      {moment(params.begin_time).format(
                                        "MMM DD, YYYY"
                                      )}{" "}
                                      -{" "}
                                      {moment(params.end_time).format(
                                        "MMM DD, YYYY"
                                      )}
                                    </th>
                                  </tr>
                                  <tr className="ignore font-weight-bold">
                                    <th>Summary:</th>
                                    <th className="text-center">
                                      {
                                        clientReportFetch[0]
                                          .summaryOfNoShowCount
                                      }
                                    </th>
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
                                    <th>&nbsp;</th>
                                  </tr>
                                </React.Fragment>
                              )}
                            <tr key="header">
                              <th
                                className={
                                  field != "clientName"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("clientName")}
                              >
                                Client Name
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
                                onClick={(e) => handleSortChange("noShowCount")}
                              >
                                No Show Count
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
                            searchResults.length > 0 ? (
                              <React.Fragment>
                                {searchResults.map((value: any, index: any) => {
                                  return (
                                    <tr
                                      className="gradeX text-capitalize"
                                      key={index}
                                    >
                                      <td>{value.clientName}</td>
                                      <td className="text-center">
                                        {value.noShowCount}
                                      </td>
                                      <td className="text-center">
                                        {value.flexibleCount}
                                      </td>
                                      <td className="text-center">
                                        {value.specificCount}
                                      </td>
                                      <td className="text-center">
                                        {value.totalCount}
                                      </td>
                                      <td className="text-center">
                                        $
                                        {value.totalGrossServiceRevenue.toFixed(
                                          2
                                        )}
                                      </td>
                                      <td className="text-center ignore">
                                        <a
                                          href=""
                                          data-toggle="modal"
                                          data-target=".bs-example-modal-lg"
                                          onClick={() =>
                                            handleModalPopup(value, index)
                                          }
                                        >
                                          <i
                                            className="glyphicon glyphicon-eye-open"
                                            style={{ color: "#337ab7" }}
                                          ></i>{" "}
                                          Show
                                        </a>
                                      </td>
                                    </tr>
                                  );
                                })}
                                <tr className="ignore font-weight-bold">
                                  <th>Summary:</th>
                                  <th className="text-center">
                                    {clientReportFetch[0].summaryOfNoShowCount}
                                  </th>
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
                                  <th>&nbsp;</th>
                                </tr>
                              </React.Fragment>
                            ) : (
                              <tr>
                                <td colSpan={7} className="text-center">
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

const mapActionsToProps = {
  searchClientReport,
  getAllClients,
};

export default connect(null, mapActionsToProps)(ClientReport);
