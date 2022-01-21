import { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";

import PageHeader from "../core/PageHeader";

const ProductSales = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [orderBy, setOrderBy] = useState(false);
  const [field, setField] = useState("createdAt");

  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);

  const [title] = useState("Product Sales");

  const handleSortChange = (sortOption: any) => {
    console.log(sortOption);
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
                                className="form-control datepicker"
                                uib-datepicker-popup="{{'yyyy-MM-dd'}}"
                                placeholder="Start Date"
                                datepicker-options="startDateOptions"
                                is-open="startOpened"
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
                                className="form-control datepicker"
                                uib-datepicker-popup="{{'yyyy-MM-dd'}}"
                                placeholder="End Date"
                                datepicker-options="endDateOptions"
                                is-open="endOpened"
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
                        <div className="col-sm-3">
                          <div className="form-group">
                            <label>Brand</label>
                            <select className="form-control" name="brand">
                              <option value="">All</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <div className="form-group">
                            <label>&nbsp;</label>
                            <div className="input-group">
                              <button className="btn btn-primary" type="button">
                                Search
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>

                    <div className="hr-line-dashed"></div>
                    <div className="row text-center">
                      <div className="col-sm-6">
                        <div className="panel panel-default">
                          <div className="panel-heading">
                            <h3 className="panel-title">Sold Stock</h3>
                          </div>
                          <div className="panel-body">
                            <b>Quantity: </b> <br />
                            <b>Values: </b>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="panel panel-default">
                          <div className="panel-heading">
                            <h3 className="panel-title">Total Inventory</h3>
                          </div>
                          <div className="panel-body">
                            <b>Quantity: </b> <br />
                            <b>Values: </b>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="hr-line-dashed"></div>
                    <div className="row">
                      <div className="col-sm-12 table-responsive">
                        <table className="table table-striped table-bordered table-condensed align-middle dataTables-example">
                          <thead>
                            <tr className="align-middle ignore">
                              <th colSpan={3}></th>
                              <th colSpan={2} className="text-center">
                                Current Stock Inventory
                              </th>
                              <th colSpan={2} className="text-center">
                                Total SOLD
                              </th>
                            </tr>
                            <tr key="header">
                              <th
                                className={
                                  field != "name"
                                    ? "sorting"
                                    : orderBy
                                    ? "sorting_asc"
                                    : "sorting_desc"
                                }
                                onClick={(e) => handleSortChange("name")}
                              >
                                Product Name
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
                                Brand
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
                                Inventory Quantity
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
                                Inventory Values
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
                                Quantity Sold
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
                                Sold Value
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
                            {/*  <tr className="gradeX" >
                                        <td></td>
                                        <td> </td>
                                        <td> </td>
                                        <td className="text-capitalize"></td>
                                        <td className="text-capitalize"></td>
                                        <td className="text-center"></td>
                                        <td className="text-center"></td>
                                        <td className="text-center"></td>
                                        <td className="text-center"></td>
                                    </tr> */}
                            {/* <tr>
                                        <th>Summary</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th className="text-center"></th>
                                        <th className="text-center"></th>
                                        <th className="text-center"></th>
                                        <th className="text-center"></th>
                                    </tr> */}
                            <tr>
                              <th colSpan={3}>
                                Summary:
                                <small>
                                  <i>
                                    (Gift/Packages quantity and its values are
                                    EXCLUDED in total inventory dollar count)
                                  </i>
                                </small>
                              </th>
                              <th className="text-center"></th>
                              <th className="text-center"></th>
                              <th className="text-center"></th>
                              <th className="text-center"></th>
                            </tr>
                            <tr>
                              <td colSpan={6} className="text-center">
                                {"No Reports"}
                              </td>
                            </tr>
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

const mapActionsToProps = {};

export default connect(null, mapActionsToProps)(ProductSales);
