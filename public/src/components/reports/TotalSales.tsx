import { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import "./../../scss/dashboard.scss";
import { searchTotalSales } from "../../redux/actions/report/totalSalesActions";
import PageHeader from "../../components/core/PageHeader";

const TotalSales = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [orderBy, setOrderBy] = useState(false);
  const [field, setField] = useState("createdAt");
  const [values , setValues] = useState()

  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const reportTotalSales = useSelector((state: any) => state.allreport);
  const TotalSales = reportTotalSales.reportTotalSales;
  const TotalSaleValue = TotalSales.map((sales: any) =>
    sales.data.map((value: any) => value)
  );
  console.log(TotalSaleValue);

  const [title] = useState("Total Sales");

  const handleSortChange = (sortOption: any) => {
    console.log(sortOption);
  };

  const handleSearch = () => {
    // if (status) {
    // 	params.filter['status']['$in']['0'] = status
    // }
    props.searchTotalSales();
  };

  return (
    <>
      {user.authenticated && !UI.loading ? (
        <>
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
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                name="startDate"
                                id="startDate"
                                required
                              />
                              <span className="input-group-btn">
                                <button
                                  type="button"
                                  className="btn btn-default"
                                >
                                  <i className="glyphicon glyphicon-calendar"></i>
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-group">
                            <label>End Date</label>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                name="endDate"
                                id="endDate"
                                required
                              />
                              <span className="input-group-btn">
                                <button
                                  type="button"
                                  className="btn btn-default"
                                >
                                  <i className="glyphicon glyphicon-calendar"></i>
                                </button>
                              </span>
                            </div>
                            <div>
                              <span className="text-danger"></span>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <div className="form-group">
                            <label>Staff</label>
                            <select className="form-control">
                              <option value="">All</option>
                              <option></option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <div className="form-group">
                            <label>Type</label>
                            <select className="form-control">
                              <option value="">All</option>
                              <option value="products">Products</option>
                              <option value="services">Services</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <div className="form-group">
                            <label>&nbsp;</label>
                            <div className="input-group">
                              <button
                                className="btn btn-primary"
                                type="button"
                                onClick={(e) => handleSearch(e)}
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
                            <tr key="header">
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "name"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_as"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("name")}
                              >
                                Date/Time
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "name"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("name")}
                              >
                                Staff
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "name"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("name")}
                              >
                                Customer
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "name"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("name")}
                              >
                                {" "}
                                Services/Products
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "name"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("name")}
                              >
                                Type
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "name"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("name")}
                              >
                                Price
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "name"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("name")}
                              >
                                Tip
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "name"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("name")}
                              >
                                Tax
                              </th>
                              <th
                                style={{ textAlign: "center" }}
                                className={
                                  field != "name"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("name")}
                              >
                                Total
                              </th>
                            </tr>

                            {/* <tr className="ignore font-weight-bold" ng-if="vm.filteredReports.length">
                                        <th>Summary</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th className="text-center">
                                           
                                        </th>
                                        <th className="text-center">
                                            
                                        </th>
                                        <th className="text-center">
                                            
                                        </th>
                                        <th className="text-center">

                                        </th>
                                    </tr> */}
                          </thead>
                          <tbody>
                            {TotalSaleValue && TotalSaleValue.length ? (
                              TotalSaleValue.map((printValue: any) =>
                                printValue.map((value: any) => {
                                    return (
                                      <tr className="gradeX">
                                        <td>{value.amount}</td>
                                        <td>{value.staffName}</td>
                                        <td>{value.clientName}</td>
                                        <td className="text-capitalize">
                                          {value.itemNames}
                                        </td>
                                        <td className="text-capitalize">
                                          {value.type}
                                        </td>
                                        <td className="text-center">
                                          {value.amount}
                                        </td>
                                        <td className="text-center">
                                          {value.tip}
                                        </td>
                                        <td className="text-center">
                                          {value.tax}
                                        </td>
                                        <td className="text-center">
                                          {value.total}
                                        </td>
                                      </tr>
                                    );
                                  })
                              )
                            ) : (
                              <tr>
                                <td colSpan={9} className="text-center">
                                  No reports
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
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const mapActionsToProps = {
  searchTotalSales,
};

export default connect(null, mapActionsToProps)(TotalSales);
