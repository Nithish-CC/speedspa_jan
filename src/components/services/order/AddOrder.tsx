import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../core/PageHeader";
import { useHistory, useParams } from "react-router-dom";
import { buildFilter, commafy } from "../../../utils/common";
import { getAllStaff } from "../../../redux/actions/staffActions";
import { getAllClients } from "../../../redux/actions/clientActions";
import { updateServiceOrder } from "../../../redux/actions/serviceActions";
import { Formik } from "formik";
import SelectSearch from "react-select-search";
import {
  getAllProducts,
  addProductOrder,
  getProductOrderView,
  updateProductOrder,
  addProductUpdateStaffOrder,
} from "../../../redux/actions/productAction";
import { getAllService } from "../../../redux/actions/serviceActions";
import { getServiceOrders } from "../../../redux/actions/reportActions";
import { updateAppointments } from "../../../redux/actions/scheduleActions";
import {
  getPaymentCC,
  makePaymentCC,
  refundPayment,
} from "../../../redux/actions/userActions";
import "../../../scss/selectsearch.css";
import moment from "moment";
import {
  Form,
  Col,
  Row,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
} from "react-bootstrap";
import _ from "lodash";

const ServiceOrder = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title, setTitle] = useState("New Order");
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const product = useSelector((state: any) => state.product);
  const report = useSelector((state: any) => state.report);
  const service = useSelector((state: any) => state.service);
  const serviceDetails = service.serviceDetails;
  const productDetails = product.productDetails;
  const ProductOrderView = product.ProductOrderView;
  const serviceOrderView = report.getServiceOrders;
  const view = window.location.href.includes("view");
  const history = useHistory();
  const urlParams = useParams();
  const allStaff = user.allStaff;
  const allClient = user.allClients;
  const payWithCC = user.paywithCC.data;
  const id = urlParams.id;
  const searchInput = useRef();
  const [serviceSelected, setServiceSelected] = useState({ price: "" });
  const bussinessId = localStorage.getItem("businessId");
  const orderValuesData = {
    businessId: "",
    clientId: "",
    createdBy: {},
    items: [],
    resourceId: "",
    shipping: { name: "chair" },
    status: "created",
    type: "products",
  };
  const [productOrder, setproductOrder] = useState({ ...orderValuesData });
  const [serviceSubAmt, setServiceSubAmt] = useState(0);
  const [cardSubAmt, setCardSubAmt] = useState(0);

  const [serviceTable, setServiceTable] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [updateButton, setUpdateButton] = useState(false);
  const [cardButton, setCardButton] = useState(false);
  const [cardMonth, setCardMonth] = useState("");
  const [cardYear, setCardYear] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardTip, SetCardTip] = useState("");
  const [cardTotalAmt, setCardTotalAmt] = useState(cardSubAmt);
  const userDetails = localStorage.getItem("userDetails");
  const [localUser, setLocalUser] = useState({
    businessId: "",
    name: "1",
    id: "1",
    email: "1",
    firstName: "1",
    lastName: "1",
  });
  useEffect(
    () => setLocalUser(JSON.parse(localStorage.userDetails)),
    [userDetails]
  );

  //USE-EFFECT

  //TO FETCH RELATED SERVICE FROM CATEGORY

  useEffect(() => {
    setCardTotalAmt(cardSubAmt + Number(cardTip));
  }, [cardTip]);

  useEffect(() => {
    setTitle("Services: Order Details");
    let params = {
      businessId: bussinessId,
    };
    props.getServiceOrders(id, params);
    props.getAllService(params);
    yearArr();
  }, [view]);

  useEffect(() => {
    const service = _.filter(
      serviceDetails,
      (serviceDetails) =>
        serviceDetails.categoryId === serviceOrderView.categoryId
    );
    if (serviceData && serviceData.length) {
      serviceName(service, serviceData);
    }
  }, [serviceDetails, serviceOrderView, serviceData]);

  useEffect(() => {
    setServiceData(serviceOrderView.items);
    cardPaymentSubTotal(serviceOrderView.items);
    orginalData(serviceOrderView.items);
    let paramsCC = {
      mxCustomerId: serviceOrderView.mxCustomerId,
      businessId: bussinessId,
    };
    props.getPaymentCC(id, paramsCC);
  }, [serviceOrderView]);

  //FUNCTION CALLS

  //FOR SEARCH FILTER SERVICE NAMES LISITING
  const serviceName = (service: any, serviceData: any) => {
    let tempArr: any[] = [];
    service.forEach((element: any) => {
      serviceData.forEach((value: any) => {
        if (value.parent == element.id) {
          element.price = value.amount;
        }
      });
      tempArr.push({
        value: element.id,
        ...element,
      });
    });

    setServiceTable(tempArr);
  };

  //TO GET SELECTED SERVICE
  const handleChangeService = (...args: any) => {
    console.log(args);
    setServiceSelected(args[1]);
  };

  //SERVICE FILTER SEARCH
  const handleServiceFilter = (items: any) => {
    return (searchValue: any) => {
      if (searchValue.length === 0) {
        return serviceTable;
      }
      const newItems = items.filter((item: any) => {
        return item.name.toLowerCase().includes(searchValue.toLowerCase());
      });
      return newItems;
    };
  };

  //TO FIND THE EXSISTING SERVICE AND ADD
  const addService = () => {
    if (serviceSelected.id) {
      const duplicate = serviceData.filter((item: any) => {
        if (!item.parent) {
          item.parent = item.id;
        }
        return item.parent.includes(serviceSelected.id);
      });
      if (!duplicate.length) {
        serviceSelected.amount = serviceSelected.price;
        setServiceData([...serviceData, serviceSelected]);
        orginalData([...serviceData, serviceSelected]);
        setUpdateButton(true);
      }
    }
  };

  //TO ADD THE SUB TOTAL AND TOTAL
  const addAmountData = (serviceData: any) => {
    let temp = 0;
    serviceData.forEach((element: any) => {
      temp = temp + element.amount;
    });
    return temp;
  };

  //TO ADD THE SUB TOTAL AND TOTAL
  const orginalData = (serviceData: any) => {
    if (serviceData && serviceData.length > 0) {
      const temp = addAmountData(serviceData);
      setServiceSubAmt(((Math.round(temp) * 100) / 10000).toFixed(2));
    }
  };

  //TO ADD THE SUB TOTAL AND TOTAL FOR CARD PAYMENT
  const cardPaymentSubTotal = (serviceData: any) => {
    if (serviceData && serviceData.length > 0) {
      const temp = addAmountData(serviceData);
      setCardSubAmt(Number(((Math.round(temp) * 100) / 10000).toFixed(2)));
    }
  };

  //Updates products to table
  const deleteUpdate = (newProductData: any) => {
    let tempArr: any[] = [];
    newProductData.forEach((element: any) => {
      tempArr.push(element);
    });
    setServiceData(tempArr);
    orginalData(tempArr);
  };

  //TO REMOVE TABLE SERVICE DATA
  const tableData = (key: number, value: any) => {
    serviceData.splice(key, 1);
    deleteUpdate(serviceData);
  };

  useEffect(() => {
    const year = moment().year();
    let temp: any[] = [];
    for (var i = year; i <= 10; i++) {
      temp.push(year + i);
    }
  }, []);

  const handleItems = () => {
    let tempArr: any[] = [];
    serviceData.forEach((element: any) => {
      let tempObj = {};
      tempObj.parent = element.id;
      tempObj.amount = element.amount;
      tempObj.name = element.name;
      tempArr.push(tempObj);
    });
    return tempArr;
  };

  const handleSubmit = () => {
    let values = {
      bussinessId: bussinessId,
      id: serviceOrderView.id,
      items: handleItems(),
      status: "created",
    };
    props.updateServiceOrder(values, (success: any, key: any) => {
      if (success) {
        let params = {
          ...serviceOrderView,
        };
        params.items = key.data.items;
        props.updateAppointments(params);
      }
    });
  };

  const [getYear, setGetYear] = useState<any[]>([]);
  const yearArr = () => {
    let tempArr: any[] = [];
    for (let i = 0; i < 10; i++) {
      tempArr.push(moment().year() + i);
    }
    setGetYear(tempArr);
  };

  //make payment cc
  const paymentCC = () => {
    let paramsViaCC = {
      businessId: bussinessId,
      card: {
        cvv: Number(cardCVV),
        expiryMonth: cardMonth,
        expiryYear: cardYear,
        number: cardNumber,
      },
      isManualPay: true,
      order: {
        ...serviceOrderView,
      },
      paidBy: {
        email: localUser.email,
        id: localUser.id,
        name: localUser.firstName + " " + localUser.lastName,
        at: moment().toISOString(),
      },
      paidFrom: "web",
    };
    props.makePaymentCC(paramsViaCC);
  };

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading && (
        <React.Fragment>
          <PageHeader title={title} />
          <Formik
            initialValues={{ ...productOrder }}
            //validationSchema={basicFormSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => {
              return (
                <React.Fragment>
                  {cardButton && (
                    <React.Fragment>
                      <div className="row">
                        <div className="col-lg-12">
                          <div
                            className="wrapper wrapper-content animated fadeInRight"
                            style={{ padding: "20px 10px 0px 10px" }}
                          >
                            <div className="ibox float-e-margins">
                              <div className="ibox-content">
                                <form
                                  name="orderEdit"
                                  className="form-horizontal"
                                >
                                  <div className="row">
                                    <div className="col-md-12">
                                      <h2>Pay with Credit Card</h2>
                                      <hr />
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Customer
                                        </FormLabel>
                                        <Col sm="8">
                                          <input
                                            type="text"
                                            className="form-control"
                                            name="customer"
                                            value={
                                              serviceOrderView &&
                                              serviceOrderView.clientName
                                            }
                                            disabled
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Amount ($)
                                        </FormLabel>
                                        <Col sm="8">
                                          <input
                                            type="number"
                                            className="form-control"
                                            name="staff"
                                            value={cardSubAmt}
                                            disabled
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Tip ($)
                                        </FormLabel>
                                        <Col sm="8">
                                          <input
                                            type="number"
                                            className="form-control"
                                            name="tip"
                                            value={cardTip}
                                            onChange={(e) =>
                                              SetCardTip(e.target.value)
                                            }
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Total Amount ($)
                                        </FormLabel>
                                        <Col sm="8">
                                          <input
                                            type="number"
                                            className="form-control"
                                            name="totalAmount"
                                            value={
                                              Number(cardTip) < 0
                                                ? cardSubAmt
                                                : cardTotalAmt
                                            }
                                            disabled
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Card Number
                                        </FormLabel>
                                        <Col sm="8">
                                          <input
                                            type="number"
                                            className="form-control"
                                            name="cardNumber"
                                            value={cardNumber}
                                            maxlength="16"
                                            onChange={(e) =>
                                              setCardNumber(e.target.value)
                                            }
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Card Expiration Month
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            as="select"
                                            name="month"
                                            value={cardMonth}
                                            onChange={(e) =>
                                              setCardMonth(e.target.value)
                                            }
                                          >
                                            <option value="">Month</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                          </FormControl>
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Card Expiration Year
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            as="select"
                                            name="year"
                                            value={cardYear}
                                            onChange={(e) =>
                                              setCardYear(e.target.value)
                                            }
                                          >
                                            <option value="">year</option>
                                            {getYear && getYear.length ? (
                                              getYear.map((year: any) => {
                                                return (
                                                  <option value={year}>
                                                    {year}
                                                  </option>
                                                );
                                              })
                                            ) : (
                                              <React.Fragment></React.Fragment>
                                            )}
                                          </FormControl>
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          3 or 4 digit card verification value
                                          (CVV)
                                        </FormLabel>
                                        <Col sm="8">
                                          <input
                                            type="number"
                                            className="form-control"
                                            name="cvv"
                                            onChange={(e) => {
                                              setCardCVV(e.target.value);
                                            }}
                                          />
                                        </Col>
                                      </FormGroup>
                                    </div>
                                  </div>
                                  <div className="hr-line-dashed"></div>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <div className="col-sm-12">
                                          <Button
                                            className="btn btn-white"
                                            type="button"
                                            onClick={() => {
                                              setCardButton(false);
                                            }}
                                          >
                                            Cancel
                                          </Button>
                                          &nbsp;
                                          <Button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={() => {
                                              paymentCC();
                                            }}
                                          >
                                            Make Payment
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  <React.Fragment>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="wrapper wrapper-content animated fadeInRight">
                          <div className="ibox float-e-margins">
                            <div className="ibox-content">
                              <h3>
                                Order Details
                                <p
                                  style={{
                                    float: "right",
                                    marginTop: "-6px",
                                    fontWeight: 600,
                                  }}
                                >
                                  <span
                                    className="btn btn-sm btn-default ng-scope"
                                    style={{
                                      color: "inherit;",
                                      border: "1px solid #d2d2d2;",
                                      backgroundColor: "#d4d4d4;",
                                    }}
                                  >
                                    Specific
                                  </span>
                                  &nbsp;
                                  {serviceOrderView &&
                                    serviceOrderView.status == "created" && (
                                      <span className="btn btn-sm btn-primary">
                                        Created
                                      </span>
                                    )}
                                  {serviceOrderView &&
                                    serviceOrderView.status == "canceled" && (
                                      <span className="btn btn-sm btn-danger">
                                        Canceled
                                      </span>
                                    )}
                                </p>
                              </h3>
                              <div className="hr-line-dashed"></div>
                              <form
                                name="orderEdit"
                                className="form-horizontal"
                              >
                                <div className="row">
                                  <div className="col-md-6">
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        Customer
                                      </FormLabel>
                                      <Col sm="9">
                                        <input
                                          type="text"
                                          className="form-control"
                                          name="customer"
                                          value={
                                            serviceOrderView &&
                                            serviceOrderView.clientName
                                          }
                                          disabled
                                        />
                                      </Col>
                                    </FormGroup>
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        Staff
                                      </FormLabel>
                                      <Col sm="9">
                                        <input
                                          type="text"
                                          className="form-control"
                                          name="staff"
                                          value={
                                            serviceOrderView &&
                                            serviceOrderView.staffName
                                          }
                                          disabled
                                        />
                                      </Col>
                                    </FormGroup>
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        Category
                                      </FormLabel>
                                      <Col sm="9">
                                        <input
                                          type="text"
                                          className="form-control"
                                          name="category"
                                          value={
                                            serviceOrderView &&
                                            serviceOrderView.categoryName
                                          }
                                          disabled
                                        />
                                      </Col>
                                    </FormGroup>
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        Date
                                      </FormLabel>
                                      <Col sm="9">
                                        <input
                                          type="text"
                                          className="form-control"
                                          name="date"
                                          value={moment(
                                            serviceOrderView.timeStart
                                          ).format("ll")}
                                          disabled
                                        />
                                      </Col>
                                    </FormGroup>
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        Time
                                      </FormLabel>
                                      <Col sm="9">
                                        <input
                                          type="text"
                                          className="form-control"
                                          name="time"
                                          value={moment
                                            .utc(serviceOrderView.timeStart)
                                            .format("LT")}
                                          disabled
                                        />
                                      </Col>
                                    </FormGroup>
                                  </div>
                                  <div className="col-sm-6">
                                    {/* <span className="btn btn-large m-t-sm btn-success">
																		Paid
																	</span>
																	<span className="btn btn-large m-t-sm btn-danger">
																		Canceled
																	</span> */}

                                    <table className="table table-bordered  table-hover dataTables-example">
                                      <thead>
                                        <tr>
                                          <th>Service</th>
                                          <th className="text-center">Price</th>
                                          {serviceOrderView &&
                                            serviceOrderView.status ==
                                              "created" && <th>Action</th>}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {serviceOrderView &&
                                          serviceOrderView.status ==
                                            "created" && (
                                            <tr className="gradeX">
                                              <td>
                                                <SelectSearch
                                                  ref={searchInput}
                                                  options={serviceTable}
                                                  filterOptions={
                                                    handleServiceFilter
                                                  }
                                                  value={serviceSelected}
                                                  name="service"
                                                  placeholder="service"
                                                  search
                                                  onChange={handleChangeService}
                                                />
                                              </td>
                                              <td>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  name="price"
                                                  value={
                                                    serviceSelected &&
                                                    serviceSelected.price > 0
                                                      ? serviceSelected.price /
                                                        100
                                                      : "Price"
                                                  }
                                                  disabled
                                                />
                                              </td>                                              
                                              <td className="text-right">
                                                <Button
                                                  className="btn btn-success center-block"
                                                  onClick={() => addService()}
                                                >
                                                  Add
                                                </Button>
                                              </td>
                                            </tr>
                                          )}
                                        {serviceOrderView &&
                                        serviceOrderView.items &&
                                        serviceData &&
                                        serviceData.length ? (
                                          serviceData.map(
                                            (value: any, index: number) => {
                                              return (
                                                <tr key={index}>
                                                  <td>
                                                    <Link
                                                      to={`/services/view/${value.parent}`}
                                                    >
                                                      {value.name}
                                                    </Link>
                                                  </td>

                                                  <td className="text-center">
                                                    <Link
                                                      to={`/services/view/${value.parent}`}
                                                    >
                                                      $
                                                      {(
                                                        (Math.round(
                                                          value.amount
                                                        ) *
                                                          100) /
                                                        10000
                                                      ).toFixed(2)}
                                                    </Link>
                                                  </td>
                                                  {serviceOrderView &&
                                                    serviceOrderView.status ==
                                                      "created" && (
                                                      <td>
                                                        <Button
                                                          onClick={() => {
                                                            tableData(
                                                              index,
                                                              value
                                                            );
                                                            setUpdateButton(
                                                              true
                                                            );
                                                          }}
                                                          className="btn text-center center-block"
                                                          style={{
                                                            color: "red",
                                                            backgroundColor:
                                                              "transparent",
                                                            borderColor:
                                                              "transparent",
                                                          }}
                                                        >
                                                          Remove
                                                        </Button>
                                                      </td>
                                                    )}
                                                </tr>
                                              );
                                            }
                                          )
                                        ) : (
                                          <React.Fragment></React.Fragment>
                                        )}
                                        <tr className="gradeX">
                                          <td>Sub Total</td>
                                          <td className="text-center">
                                            $&nbsp;
                                            {serviceData && serviceData.length
                                              ? serviceSubAmt
                                              : "0.00"}
                                          </td>
                                          {serviceOrderView &&
                                            serviceOrderView.status ==
                                              "created" && (
                                              <td className="text-right"></td>
                                            )}
                                        </tr>
                                        <tr className="gradeX">
                                          <td>
                                            <strong>Total</strong>
                                          </td>
                                          <td className="text-center">
                                            $&nbsp;
                                            {serviceData && serviceData.length
                                              ? serviceSubAmt
                                              : "0.00"}
                                          </td>
                                          {serviceOrderView &&
                                            serviceOrderView.status ==
                                              "created" && (
                                              <td className="text-right"></td>
                                            )}
                                        </tr>
                                        <tr>
                                          {updateButton &&
                                          serviceData &&
                                          serviceData.length ? (
                                            <td colSpan={3} align="center">
                                              <Button
                                                className="btn btn-success"
                                                style={{
                                                  width: "100%",
                                                }}
                                                onClick={() => handleSubmit()}
                                              >
                                                Update
                                              </Button>
                                            </td>
                                          ) : (
                                            <React.Fragment></React.Fragment>
                                          )}
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-12">
                                    <h3>
                                      <b>Log Details</b>
                                    </h3>
                                    <div className="hr-line-dashed"></div>
                                    <ul>
                                      <li>
                                        Order Created At&nbsp;
                                        <b>
                                          {serviceOrderView &&
                                            moment(
                                              serviceOrderView.createdAt
                                            ).format("lll")}
                                        </b>
                                        &nbsp; By&nbsp;
                                        <b>
                                          {serviceOrderView &&
                                            serviceOrderView.createdBy &&
                                            serviceOrderView.createdBy.name}
                                        </b>
                                      </li>
                                      {serviceOrderView &&
                                        serviceOrderView.status ==
                                          "canceled" && (
                                          <li style={{ color: "red" }}>
                                            Order Canceled At&nbsp;
                                            <b>
                                              {serviceOrderView &&
                                                moment(
                                                  serviceOrderView.canceledBy
                                                    .canceledDate
                                                ).format("lll")}
                                            </b>
                                            &nbsp; By&nbsp;
                                            <b>
                                              {serviceOrderView &&
                                                serviceOrderView.createdBy &&
                                                serviceOrderView.createdBy.name}
                                            </b>
                                          </li>
                                        )}
                                    </ul>
                                  </div>
                                </div>
                                <div className="hr-line-dashed"></div>
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="form-group">
                                      <div className="col-sm-12">
                                        <Button
                                          className="btn btn-white"
                                          style={{
                                            backgroundColor: "white",
                                            color: "black",
                                          }}
                                          type="button"
                                          onClick={() => {
                                            history.push("/services/orders");
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                        &nbsp;
                                        {serviceOrderView &&
                                          serviceOrderView.status ==
                                            "created" && (
                                            <React.Fragment>
                                              <Button
                                                className="btn btn-success"
                                                type="button"
                                                onClick={() =>
                                                  setCardButton(true)
                                                }
                                              >
                                                Pay with CC
                                              </Button>
                                              &nbsp;
                                              <Button
                                                className="btn btn-danger"
                                                type="button"
                                              >
                                                Pay with EMV
                                              </Button>
                                            </React.Fragment>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                </React.Fragment>
              );
            }}
          </Formik>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapActionsToProps = {
  getAllStaff,
  getAllProducts,
  addProductOrder,
  getProductOrderView,
  getPaymentCC,
  makePaymentCC,
  updateProductOrder,
  addProductUpdateStaffOrder,
  refundPayment,
  getAllClients,
  getServiceOrders,
  getAllService,
  updateServiceOrder,
  updateAppointments,
};

export default connect(null, mapActionsToProps)(ServiceOrder);
