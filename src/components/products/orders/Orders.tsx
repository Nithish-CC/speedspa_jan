import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import PageHeader from "../../core/PageHeader";
import { sorting, commafy, buildFilter } from "../../../utils/common";
import { getAllStaff } from "../../../redux/actions/staffActions";
import { getAllClients } from "../../../redux/actions/clientActions";
import { getproductOrders } from "../../../redux/actions/reportActions";
import { getProductOrderUpdate } from "../../../redux/actions/productAction";
import { Link } from "react-router-dom";
import _ from "lodash";
import moment from "moment";
import Pagination from "react-js-pagination";
import DeleteModal from "../../core/DeleteModal";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const ProductOrders = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title] = useState("Product Orders");
  const [orderBy, setOrderBy] = useState(false);
  const [field, setField] = useState("createdAt");
  const [activePage, setActivePage] = useState(1);
  const [perPage] = useState(10);
  const [buttons] = useState([
    {
      title: "Add Order",
      url: "/products/orders/add-new",
    },
  ]);
  const [modalPopup, setModalPopup] = useState({
    deleteModal: false,
    id: "",
    name: "",
    index: "",
  });
  const [initialModalPopup] = useState({ ...modalPopup });

  // From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const product = useSelector((state: any) => state.product);
  const report = useSelector((state: any) => state.report);
  const getproductOrdersData = report.getproductOrders;
  const allCategories = product.categoryDetails;
  const allStaff = user.allStaff;
  const allClients = user.allClients;
  const allProducts = product.productDetails;
  const bussinessId = localStorage.getItem("businessId");
  const userDetails = localStorage.getItem("userDetails");
  const [getproductOrders, setGetProductOrders] = useState<any[]>([]);
  const [localUser, setLocalUser] = useState({
    businessId: "", 
    name: "1",
    id: "1",
    email:"1",
    firstName: "1",
    lastName: "1",
  })
  //For Filter
  let todayDate: any = moment(new Date()).format("YYYY-MM-DD");
  const [staffVal, setStaffVal] = useState("all");
  const [statusVal, setStatusVal] = useState("all");
  const [orderData, setOrderData] = useState(todayDate);

  useEffect(
    () => setLocalUser(JSON.parse(localStorage.userDetails)),
    [userDetails]
  );

  useEffect(() => {
    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  const handleSortChange = (key: any) => {
    if (field === key) {
      setOrderBy(!orderBy);
    } else {
      setOrderBy(true);
      setField(key);
    }
    sorting(getproductOrders, key, orderBy);
  };

  useEffect(() => {
    getAllStaff();
    getAllClient();
    getAllOrder();
    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  const getAllStaff = () => {
    var data: any = {
      filter: {
        roles: {
          $in: {
            0: "stylist",
          },
        },
      },
    };
    data.filter.status = {
      $in: ["active"],
    };
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.getAllStaff(query);
  };

  const getAllClient = () => {
    var data: any = {
      filter: {
        roles: {
          $in: {
            0: "client",
          },
        },
        status: {
          $in: {
            0: "active",
            1: "inactive",
          },
        },
      },
    };
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.getAllClients(query);
  };

  const getAllOrder = () => {
    var data: any = {
      type: { $eq: "products" },
    };
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.getproductOrders(query);
  };

  const deletePopup = (value: any, index: any) => {
    setModalPopup({
      deleteModal: !modalPopup.deleteModal,
      id: value.id,
      name: value.clientName,
      index: index,
    });
  };

  const closeModal = () => {
    setModalPopup(initialModalPopup);
  };

  const handleDelete = () => {
    let params = {
      businessId: localStorage.getItem("businessId"),
      canceledBy: {
        email: localUser.email,
        firstName: localUser.firstName,
        id: localUser.id,
        lastName: localUser.lastName,
        name: localUser.name,
      },
      isUpdate: true,
      status: "canceled",
    };
    props.getProductOrderUpdate(modalPopup.id, params);
    closeModal();
    getAllOrder();
  };

  const viewOnPage = (value: any, index: any) => {
    return (
      <td className="text-center">
        <Link
          style={{
            cursor: "pointer",
            color: "#2a6954",
          }}
          key={index}
          to={`/products/orders/view/${value}`}
        >
          <i title="View" className="far fa-eye"></i>
        </Link>
      </td>
    );
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

  useEffect(() => {
    setGetProductOrders(getproductOrdersData);
    tempFliterData();
  }, [staffVal, statusVal, orderData, getproductOrdersData]);

  const tempFliterData = () => {
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
    if (getproductOrdersData && getproductOrdersData.length > 0) {
      const newFirstFliterJob: any = getproductOrdersData.filter(
        (data: any) => {
          delete data["updatedAt"];
          return Object.values(data)
            .join(" ")
            .toLocaleLowerCase()
            .includes(orderData);
        }
      );
      staffData(newFirstFliterJob);
    }
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
                            <label>Start Date</label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                className="form-control"
                                name="begin_time"
                                value={orderData}
                                onChange={(e: any, date: any) => {
                                  setOrderData(date);
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
                              name="type"
                              onChange={(e) => {
                                setStaffVal(e.target.value);
                              }}
                            >
                              <option value="all">All</option>
                              {allStaff &&
                                allStaff.length &&
                                allStaff.map((values: any) => {
                                  return (
                                    <option value={values.id}>
                                      {values.name}
                                    </option>
                                  );
                                })}
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
                              <option value="created">Created</option>
                              <option value="fulfilled">Fulfilled</option>
                              <option value="returned">Returned</option>
                              <option value="canceled">Canceled</option>
                              <option value="paid">Paid</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div className="hr-line-dashed"></div>
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped table-hover dataTables-example">
                        <thead>
                          <tr>
                            <th
                              className={
                                field !== "createdAt"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }
                              onClick={(e) => handleSortChange("createdAt")}
                            >
                              Date/Time
                            </th>
                            <th
                              className={`text-center ${
                                field !== "clientName"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("clientName")}
                            >
                              Customer
                            </th>
                            <th
                              className={` ${
                                field !== "staffName"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("staffName")}
                            >
                              Staff
                            </th>
                            <th
                              className={` ${
                                field !== "itemNames"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("itemNames")}
                            >
                              Products
                            </th>
                            <th
                              className={`text-center ${
                                field !== "amount"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("amount")}
                            >
                              Price
                            </th>
                            <th
                              className={`text-center ${
                                field !== "tax"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("tax")}
                            >
                              Tax (9%)
                            </th>
                            <th
                              className={`text-center ${
                                field !== "total"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("total")}
                            >
                              Total
                            </th>
                            <th
                              className={`text-center ${
                                field !== "status"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("status")}
                            >
                              Status
                            </th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getproductOrders && getproductOrders.length ? (
                            <React.Fragment>
                              {getproductOrders
                                .slice(
                                  (activePage - 1) * perPage,
                                  activePage * perPage
                                )
                                .map((value: any, index: any) => {
                                  return (
                                    <tr className="gradeX">
                                      <td>
                                        {moment(value.createdAt).format(
                                          "LL LT"
                                        )}
                                      </td>
                                      <td>{value.clientName}</td>
                                      <td>{value.staffName}</td>
                                      <td>{value.itemNames}</td>
                                      <td className="text-center">
                                        $
                                        {commafy(
                                          (
                                            Math.round(value.amount * 100) / 100
                                          ).toFixed(2)
                                        )}
                                      </td>
                                      <td className="text-center">
                                        $
                                        {commafy(
                                          (
                                            Math.round(value.tax * 100) / 100
                                          ).toFixed(2)
                                        )}
                                      </td>
                                      <td className="text-center">
                                        $
                                        {commafy(
                                          (
                                            Math.round(value.total * 100) / 100
                                          ).toFixed(2)
                                        )}
                                      </td>
                                      <td>
                                        {value.status == "paid" && (
                                          <span
                                            className="btn btn-xs btn-primary"
                                            style={{ width: "80px" }}
                                          >
                                            Paid
                                          </span>
                                        )}
                                        {value.status == "created" && (
                                          <span
                                            className="btn btn-xs btn-success"
                                            style={{ width: "80px" }}
                                          >
                                            Created
                                          </span>
                                        )}
                                        {value.status == "canceled" && (
                                          <span
                                            className="btn btn-xs btn-danger"
                                            style={{ width: "80px" }}
                                          >
                                            Canceled
                                          </span>
                                        )}
                                        {value.status == "refund" && (
                                          <span
                                            className="btn btn-xs btn-danger"
                                            style={{ width: "80px" }}
                                          >
                                            Refund
                                          </span>
                                        )}
                                        {value.status == "voided" && (
                                          <span
                                            className="btn btn-xs btn-warning"
                                            style={{ width: "80px" }}
                                          >
                                            Voided
                                          </span>
                                        )}
                                        {value.status ==
                                          "extra_service_request" && (
                                          <span
                                            className="btn btn-xs btn-warning"
                                            style={{ width: "80px" }}
                                          >
                                            Requested
                                          </span>
                                        )}
                                      </td>
                                      {value.status == "canceled" ? (
                                        <React.Fragment>
                                          {viewOnPage(value.id, index)}
                                        </React.Fragment>
                                      ) : (
                                        value.status == "paid" && (
                                          <React.Fragment>
                                            {viewOnPage(value.id, index)}
                                          </React.Fragment>
                                        )
                                      )}
                                      {value.status == "created" && (
                                        <td className="text-center">
                                          <Link
                                            style={{
                                              cursor: "pointer",
                                              color: "#2a6954",
                                            }}
                                            key={index}
                                            to={`/products/orders/view/${value.id}`}
                                          >
                                            <i
                                              title="View | Edit"
                                              className="far fa-edit"
                                            ></i>
                                          </Link>
                                          &nbsp;
                                          <a
                                            style={{
                                              cursor: "pointer",
                                              color: "#2a6954",
                                            }}
                                            onClick={() =>
                                              deletePopup(value, index)
                                            }
                                          >
                                            <i
                                              title="Delete"
                                              className="far fa-trash-alt"
                                            ></i>
                                          </a>
                                        </td>
                                      )}
                                    </tr>
                                  );
                                })}
                              <tr>
                                <td colSpan={4}>
                                  <strong>Summary: </strong>
                                  <small>
                                    (Canceled order quantity and its values are
                                    excluded in this total summary count
                                    calculation)
                                  </small>
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
                                {}
                                <th className="text-center">
                                  $
                                  {commafy(
                                    (
                                      Math.round(tax(getproductOrders) * 100) /
                                      100
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
                              <td colSpan={9} className="text-center">
                                {!UI.buttonLoading ? (
                                  "No Orders"
                                ) : (
                                  <div>
                                    <p className="fa fa-spinner fa-spin"></p>
                                    <br /> Please Wait , Loading...
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {getproductOrders && getproductOrders.length > 10 ? (
                        <div className="text-right">
                          <Pagination
                            activePage={activePage}
                            itemsCountPerPage={perPage}
                            totalItemsCount={getproductOrders.length}
                            pageRangeDisplayed={5}
                            onChange={(page: any) => setActivePage(page)}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DeleteModal
                title="Category"
                modalPopup={modalPopup}
                closeModal={closeModal}
                handleDelete={handleDelete}
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
  getproductOrders,
  getProductOrderUpdate,
  getAllClients,
};

export default connect(null, mapActionsToProps)(ProductOrders);
