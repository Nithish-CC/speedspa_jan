import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { searchEstimatedPayroll } from "../../redux/actions/reportActions";
import { getAllClients } from "../../redux/actions/clientActions";
import { sorting, commafy, buildFilter } from "../../utils/common";
import PageHeader from "../core/PageHeader";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import { Row, Col, Button, Table } from "react-bootstrap";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const EstimatedPayroll = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title] = useState("Estimated Payroll");
  const [orderBy, setOrderBy] = useState(false);
  const [field, setField] = useState("staffName");
  const [params, setParams] = useState({
    begin_time: new Date(),
    end_time: new Date(),
    resourceId: "",
  });

  const [modalPopup, setModalPopup] = useState({
    deleteModal: false,
    name: [],
    index: "",
  });

  const [initialModalPopup] = useState({ ...modalPopup });

  // From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const report = useSelector((state: any) => state.report);
  const allClients = user.allClients;
  const estimatedPay = report.reportEstimatedRoll[0];

  useEffect(() => {
    getAllClients();
    handleSearch();
    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  const percentageNum: number = 100;

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

  const handleSearch = () => {
    var filter: any = {};
    if (params.resourceId) {
      filter.resourceId = params.resourceId;
    }
    var data = Object.assign({}, { filter: filter });
    var query = buildFilter(data);
    query.begin_time = moment(params.begin_time).startOf("day").utc().format();
    query.end_time = moment(params.end_time).endOf("day").utc().format();
    query.businessId = localStorage.businessId;
    props.searchEstimatedPayroll(query);
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

  const handleSortChange = (key: any) => {
    if (field === key) {
      setOrderBy(!orderBy);
    } else {
      setOrderBy(true);
      setField(key);
    }
    sorting(estimatedPay.data, key, orderBy);
  };

  const printContent = (e: any) => {
    const printContents: any = document.getElementById(
      "specificEstimatedPayrollPrintDiv"
    );
    const WindowPrt: any = window.open(
      "",
      "",
      "left=0,top=0,width=2000,height=1000,toolbar=0,scrollbars=0,status=0"
    );
    WindowPrt.document.write("<html><head>");
    WindowPrt.document.write(
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" />'
    );
    WindowPrt.document.write("</head><body >");
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
        ? "EstimatedPayrollReport_" +
          moment(params.end_time).format("MM_DD_YYYY")
        : "EstimatedPayrollReport_" +
          moment(params.begin_time).format("MM_DD_YYYY") +
          "to" +
          moment(params.end_time).format("MM_DD_YYYY");

    data.forEach((eachPayRoll: any) => {
      jsonData.push({
        Name: eachPayRoll.staffName,
        "Service Revenue":
          "$" +
          commafy(
            (Math.round(eachPayRoll.serviceRevenue * 100) / 100).toFixed(2)
          ),
        "Service Payout":
          "$" +
          commafy(
            (Math.round(eachPayRoll.servicePayout * 100) / 100).toFixed(2)
          ),
        "Tip Revenue":
          "$" +
          commafy((Math.round(eachPayRoll.tipRevenue * 100) / 100).toFixed(2)),
        "Tip Payout":
          "$" +
          commafy((Math.round(eachPayRoll.tipPayout * 100) / 100).toFixed(2)),

        "Product Sales":
          "$" +
          commafy(
            (Math.round(eachPayRoll.productRevenue * 100) / 100).toFixed(2)
          ),
        "Product Payout":
          "$" +
          commafy(
            (Math.round(eachPayRoll.productPayout * 100) / 100).toFixed(2)
          ),
        "Gross Pay":
          "$" +
          commafy((Math.round(eachPayRoll.grossPay * 100) / 100).toFixed(2)),
        Payout:
          "$" +
          commafy((Math.round(eachPayRoll.payout * 100) / 100).toFixed(2)),
        "Total Hours": eachPayRoll.totalHours,
      });
    });
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          "Summary",
          commafy(
            (Math.round(estimatedPay.totalServiceRevenue * 100) / 100).toFixed(
              2
            )
          ),

          "$" +
            commafy(
              (Math.round(estimatedPay.totalTipRevenue * 100) / 100).toFixed(2)
            ),
          "$" +
            commafy(
              (Math.round(estimatedPay.totalTipPayout * 100) / 100).toFixed(2)
            ),
          "$" +
            commafy(
              (Math.round(estimatedPay.totalTipPayout * 100) / 100).toFixed(2)
            ),
          "$" +
            commafy(
              (
                Math.round(estimatedPay.totalProductRevenue * 100) / 100
              ).toFixed(2)
            ),
          "$" +
            commafy(
              (Math.round(estimatedPay.totalProductPayout * 100) / 100).toFixed(
                2
              )
            ),
          "$" +
            commafy(
              (Math.round(estimatedPay.totalGrossPay * 100) / 100).toFixed(2)
            ),
          "$" +
            commafy(
              (Math.round(estimatedPay.totalPayout * 100) / 100).toFixed(2)
            ),
        ],
      ],
      {
        origin: -1,
      }
    );
    XLSX.utils.book_append_sheet(wb, ws, "data");
    XLSX.writeFile(wb, pathName + ".xlsx");
  };

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading && (
        <React.Fragment>
          <PageHeader title={title} />
          <Row>
            <Col lg="12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <div className="ibox float-e-margins m-b-none">
                  <div className="ibox-content">
                    <form role="form">
                      <Row>
                        <Col sm="3">
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
                                    begin_time: date,
                                    end_time: params.end_time,
                                  });
                                }}
                                format="yyyy-MM-dd"
                                style={{
                                  border: "1px solid #e5e6e7",
                                }}
                                views={["year", "month", "date"]}
                                showTodayButton={true}
                                keyboardIcon={
                                  <i className="glyphicon glyphicon-calendar"></i>
                                }
                              />
                            </MuiPickersUtilsProvider>
                          </div>
                        </Col>
                        <Col sm="3">
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
                                    end_time: date,
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
                            <div>
                              <span className="text-danger"></span>
                            </div>
                          </div>
                        </Col>
                        <Col sm="4">
                          <div className="form-group">
                            <label>Staff</label>
                            <select
                              className="form-control"
                              onChange={handleChange}
                              name="resourceId"
                            >
                              <option value="">All</option>
                              <optgroup label="Stylist">
                                {allClients &&
                                  allClients.length &&
                                  allClients.map((value: any) => {
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
                                {allClients &&
                                  allClients.length &&
                                  allClients.map((value: any) => {
                                    if (
                                      (value.roles.includes("support") ||
                                        value.roles.includes("admin")) &&
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
                              <optgroup label="Inactive">
                                {allClients &&
                                  allClients.length &&
                                  allClients.map((value: any) => {
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
                                {allClients &&
                                  allClients.length &&
                                  allClients.map((value: any) => {
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
                        </Col>
                        <Col sm="2">
                          <div className="form-group">
                            <label>&nbsp;</label>
                            <div className="input-group">
                              <Button
                                className="btn-primary"
                                onClick={(e) => handleSearch()}
                              >
                                Search
                              </Button>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </form>
                    <div className="hr-line-dashed"></div>
                    <Row>
                      <Col sm="12" className="text-right">
                        <Button
                          size="sm"
                          className="btn-default"
                          onClick={(e) => printContent(e)}
                          style={{
                            marginBottom: "10px",
                            background: "#EFEFEF",
                            borderColor: "#dddddd",
                            fontWeight: "600",
                          }}
                          name="clientReportPrintDiv"
                          id="printBtn"
                        >
                          Print <i className="fa fa-print "></i>
                        </Button>
                        &nbsp;
                        <Button
                          size="sm"
                          className="btn-default"
                          style={{
                            marginBottom: "10px",
                            fontWeight: "600",
                            background: "#EFEFEF",
                            borderColor: "#dddddd",
                          }}
                          onClick={(e) => ExportToExcel(e, estimatedPay.data)}
                        >
                          Export to Excel <i className="fa fa-download"></i>
                        </Button>
                      </Col>

                      <Col
                        sm="12"
                        className="table-responsive"
                        id="specificEstimatedPayrollPrintDiv"
                      >
                        <Table
                          striped
                          bordered
                          className="align-middle dataTables-example"
                        >
                          <thead>
                            {estimatedPay &&
                              estimatedPay.data &&
                              estimatedPay.data.length > 0 && (
                                <tr>
                                  <th
                                    colSpan={6}
                                    className="text-left text-uppercase"
                                  >
                                    Estimated Payroll
                                  </th>
                                  <th colSpan={5} className="text-center">
                                    {moment(params.begin_time).format(
                                      "MMM DD, YYYY"
                                    )}{" "}
                                    -{" "}
                                    {moment(params.end_time).format(
                                      "MMM DD, YYYY"
                                    )}
                                  </th>
                                </tr>
                              )}
                            <tr key="header">
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "staffName"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("staffName")}
                              >
                                Name
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "serviceRevenue"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) =>
                                  handleSortChange("serviceRevenue")
                                }
                              >
                                Service Revenue
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "servicePayout"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) =>
                                  handleSortChange("servicePayout")
                                }
                              >
                                Service Payout
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "tipRevenue"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("tipRevenue")}
                              >
                                Tip Revenue
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "tipPayout"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("tipPayout")}
                              >
                                Tip Payout
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "productRevenue"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) =>
                                  handleSortChange("productRevenue")
                                }
                              >
                                Product Sales
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "productPayout"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) =>
                                  handleSortChange("productPayout")
                                }
                              >
                                Product Payout
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "payoutCash"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("payoutCash")}
                              >
                                Gross Pay
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "payoutCheck"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("payoutCheck")}
                              >
                                Payout
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "totalHours"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("totalHours")}
                              >
                                Total Hours
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className="text-center ignore"
                              >
                                Sales Details
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {!UI.buttonLoading &&
                            estimatedPay &&
                            estimatedPay.data &&
                            estimatedPay.data.length ? (
                              <React.Fragment>
                                {estimatedPay.data.map(
                                  (eachPayRoll: any, index: any) => {
                                    return (
                                      <tr className="gradeX" key={index}>
                                        <th>{eachPayRoll.staffName}</th>
                                        {eachPayRoll.serviceRevenue ? (
                                          <td className="text-center">
                                            $
                                            {commafy(
                                              (
                                                Math.round(
                                                  eachPayRoll.serviceRevenue *
                                                    100
                                                ) / 100
                                              ).toFixed(2)
                                            )}
                                          </td>
                                        ) : (
                                          <td className="text-center">-</td>
                                        )}
                                        {eachPayRoll.servicePayout ? (
                                          <td className="text-center">
                                            $
                                            {commafy(
                                              (
                                                Math.round(
                                                  eachPayRoll.servicePayout *
                                                    100
                                                ) / 100
                                              ).toFixed(2)
                                            )}
                                          </td>
                                        ) : (
                                          <td className="text-center">-</td>
                                        )}
                                        {eachPayRoll.tipRevenue ? (
                                          <td className="text-center">
                                            $
                                            {commafy(
                                              (
                                                Math.round(
                                                  eachPayRoll.tipRevenue * 100
                                                ) / 100
                                              ).toFixed(2)
                                            )}
                                          </td>
                                        ) : (
                                          <td className="text-center">-</td>
                                        )}
                                        {eachPayRoll.tipPayout ? (
                                          <td className="text-center">
                                            $
                                            {commafy(
                                              (
                                                Math.round(
                                                  eachPayRoll.tipPayout * 100
                                                ) / 100
                                              ).toFixed(2)
                                            )}
                                          </td>
                                        ) : (
                                          <td className="text-center">-</td>
                                        )}
                                        {eachPayRoll.productRevenue !== 0 ? (
                                          <td className="text-center">
                                            $
                                            {commafy(
                                              (
                                                Math.round(
                                                  eachPayRoll.productRevenue *
                                                    100
                                                ) / 100
                                              ).toFixed(2)
                                            )}
                                          </td>
                                        ) : (
                                          <td className="text-center">-</td>
                                        )}
                                        {eachPayRoll.productPayout ? (
                                          <td className="text-center">
                                            $
                                            {commafy(
                                              (
                                                Math.round(
                                                  eachPayRoll.productPayout *
                                                    100
                                                ) / 100
                                              ).toFixed(2)
                                            )}
                                          </td>
                                        ) : (
                                          <td className="text-center">-</td>
                                        )}
                                        {eachPayRoll.grossPay ? (
                                          <th className="text-center">
                                            $
                                            {commafy(
                                              (
                                                Math.round(
                                                  eachPayRoll.grossPay * 100
                                                ) / 100
                                              ).toFixed(2)
                                            )}
                                          </th>
                                        ) : (
                                          <th className="text-center">-</th>
                                        )}
                                        {eachPayRoll.payout ? (
                                          <th className="text-center">
                                            $
                                            {commafy(
                                              (
                                                Math.round(
                                                  eachPayRoll.payout * 100
                                                ) / 100
                                              ).toFixed(2)
                                            )}
                                          </th>
                                        ) : (
                                          <th className="text-center">-</th>
                                        )}
                                        <td className="text-center">
                                          {eachPayRoll.totalHours}
                                        </td>
                                        <td className="text-center">
                                          {eachPayRoll.serviceRevenue > 0 &&
                                            eachPayRoll.servicePayout > 0 &&
                                            eachPayRoll.tipRevenue > 0 &&
                                            eachPayRoll.tipPayout > 0 &&
                                            eachPayRoll.productRevenue > 0 &&
                                            eachPayRoll.productPayout > 0 &&
                                            eachPayRoll.grossPay > 0 &&
                                            eachPayRoll.payout > 0 && (
                                              <a
                                                href=""
                                                data-toggle="modal"
                                                data-target=".bs-example-modal-lg"
                                                onClick={() =>
                                                  handleModalPopup(
                                                    eachPayRoll,
                                                    index
                                                  )
                                                }
                                              >
                                                <i className="glyphicon glyphicon-eye-open"></i>{" "}
                                                Show
                                              </a>
                                            )}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                                <tr className="ignore font-weight-bold">
                                  <th>Summary</th>
                                  <th className="text-center">
                                    $
                                    {commafy(
                                      (
                                        Math.round(
                                          estimatedPay.totalServiceRevenue * 100
                                        ) / 100
                                      ).toFixed(2)
                                    )}
                                  </th>
                                  <th className="text-center">
                                    $
                                    {commafy(
                                      (
                                        Math.round(
                                          estimatedPay.totalTipRevenue * 100
                                        ) / 100
                                      ).toFixed(2)
                                    )}
                                  </th>
                                  <th className="text-center">
                                    $
                                    {commafy(
                                      (
                                        Math.round(
                                          estimatedPay.totalTipPayout * 100
                                        ) / 100
                                      ).toFixed(2)
                                    )}
                                  </th>
                                  <th className="text-center">
                                    $
                                    {commafy(
                                      (
                                        Math.round(
                                          estimatedPay.totalTipPayout * 100
                                        ) / 100
                                      ).toFixed(2)
                                    )}
                                  </th>
                                  <th className="text-center">
                                    $
                                    {commafy(
                                      (
                                        Math.round(
                                          estimatedPay.totalProductRevenue * 100
                                        ) / 100
                                      ).toFixed(2)
                                    )}
                                  </th>
                                  <th className="text-center">
                                    $
                                    {commafy(
                                      (
                                        Math.round(
                                          estimatedPay.totalProductPayout * 100
                                        ) / 100
                                      ).toFixed(2)
                                    )}
                                  </th>
                                  <th className="text-center">
                                    $
                                    {commafy(
                                      (
                                        Math.round(
                                          estimatedPay.totalGrossPay * 100
                                        ) / 100
                                      ).toFixed(2)
                                    )}
                                  </th>
                                  <th className="text-center">
                                    $
                                    {commafy(
                                      (
                                        Math.round(
                                          estimatedPay.totalPayout * 100
                                        ) / 100
                                      ).toFixed(2)
                                    )}
                                  </th>
                                  <th colSpan={2}></th>
                                </tr>
                              </React.Fragment>
                            ) : (
                              <tr>
                                <td colSpan={11} className="text-center">
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
                        </Table>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapActionsToProps = {
  getAllClients,
  searchEstimatedPayroll,
};

export default connect(null, mapActionsToProps)(EstimatedPayroll);
