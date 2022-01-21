import React, { useState, useEffect } from "react";
import PageHeader from "../core/PageHeader";
import { useSelector, connect } from "react-redux";
import { Row, Col, Table, Button } from "react-bootstrap";
import { getData } from "../../redux/actions/reportActions";
import _ from "lodash";
import moment from "moment";

const NewClientsRebooking = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title] = useState("New Clients: Rebookings");
  const [dropdownMonth, setDropdownMonth] = useState(6);
  const [params] = useState({
    begin_time: moment().format("YYYY-MM-DD"),
    businessId: localStorage.businessId,
    end_time: moment().subtract(1, "day").endOf("day").utc().format(),
    isNewClientBooking: true,
  });

  const [reporting, setReporting] = useState([]);

  // From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const report = useSelector((state: any) => state.report);
  const reportData = report.getData;
  const todaysDate = moment(new Date()).utc().format();
  //useEffect
  useEffect(() => {
    getData(dropdownMonth);
    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  useEffect(() => {
    filteringData();
  }, [reportData]);

  //Get data from the api
  const getData = (dropdownMonth: any) => {
    params.begin_time = moment(params.end_time)
      .subtract(dropdownMonth, "month")
      .add(1, "day")
      .startOf("day")
      .utc()
      .format();
    props.getData(params);
  };  

  //filtering the datas from the array
  const filteringData = () => {
    const reports: any = [];
    reportData.map((item: any) => {
      if (item.data.length !== 0) {
        const filter = item.data.filter((report: any) => {
          return (
            moment(report.report.timeStart).format("YYYY-MM-DD") > todaysDate
          );
        });
        filter.sort((a: any, b: any) =>
          a.report.timeStart > b.report.timeStart ? 1 : -1
        );
        reports.push(filter);
        const filters = reports.filter((report: any) => {
          return report.length !== 0;
        });
        setReporting(filters);
      }
    });
  };  
  
  //Excel Export
  const ExportToExcel = (e: any, data: any) => {
    let jsonData: any = [];
    data.forEach((report: any) => {
      let name = report[0].client.firstName + " " + report[0].client.lastName;
      jsonData.push({
        "Client Name": name,
        "First Appt. Date": "-",
        "Last Appt. Date": "-",
        "Future Appt. Date	": moment(report[0].report.timeStart).format("ll"),
        "Total Future Appts": report.length,
      });
    });
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(ws, [["Total Client", reporting.length]], {
      origin: -1,
    });
    XLSX.utils.book_append_sheet(wb, ws, "data");
    XLSX.writeFile(wb, "NewClientsRebookingReport.xlsx");
  };

  //print the table with css
  const printContent = (e: any) => {
    const printContents: any = document.getElementById("clientReportPrintDiv");
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
                    <h3>
                      Last{" "}
                      <select
                        style={{ backgroundColor: "white", border: "none" }}
                        onChange={(e: any) => {
                          setDropdownMonth(e.target.value);
                          getData(e.target.value);
                        }}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6" selected>
                          6
                        </option>
                      </select>{" "}
                      Months New Clients: Rebookings
                    </h3>
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
                          onClick={(e) => ExportToExcel(e, reporting)}
                        >
                          Export to Excel <i className="fa fa-download"></i>
                        </Button>
                      </Col>
                      <Col sm="12" id="clientReportPrintDiv">
                        <Table
                          striped
                          bordered
                          className="align-middle"
                          id="table2export"
                        >
                          <thead>
                            <tr>
                              <th
                                colSpan={4}
                                className="text-left text-uppercase "
                              >
                                New Clients: Rebookings (Last {dropdownMonth}{" "}
                                Months)
                              </th>
                              <th>Total Clients : {reporting.length} </th>
                            </tr>
                            <tr className="align-middle">
                              <th className="sorting sorting_desc">
                                Client Name
                              </th>
                              <th className="text-center">First Appt. Date</th>
                              <th className="text-center">Last Appt. Date </th>
                              <th className="text-center">Future Appt. Date</th>
                              <th className="text-center">
                              Total Future Appts
                              </th>
                            </tr>
                          </thead>
                          <tbody>                                              
                            {!UI.buttonLoading &&
                            reporting &&
                            reporting.length > 0? (
                              reporting.map((item: any) => {
                                return (
                                  <tr key={params.businessId}>
                                    <td className="sorting sorting_desc">
                                      {item[0].client.firstName}{" "}
                                      {item[0].client.lastName}
                                    </td>
                                    <td className="text-center">-</td>
                                    <td className="text-center">-</td>
                                    <td className="text-center">
                                      {moment(item[0].report.timeStart).format(
                                        "ll"
                                      )}
                                    </td>
                                    <td className="text-center">
                                      {item.length}
                                    </td>
                                  </tr>
                                );
                              })
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
  getData,
};

export default connect(null, mapActionsToProps)(NewClientsRebooking);
