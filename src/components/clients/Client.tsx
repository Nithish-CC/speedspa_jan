import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import PageHeader from "./../core/PageHeader";
import { StateList } from "./../../utils/StateList";
import { getAllOrder } from "../../redux/actions/serviceActions";
import { getproductOrders } from "../../redux/actions/reportActions";
import { getAllStaff, getAllStylist } from "../../redux/actions/staffActions";
import { sorting, commafy, buildFilter } from "../../utils/common";
import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";
import _ from "lodash";
import moment from "moment";
import * as yup from "yup";
import { Formik } from "formik";
import NumberFormat from "react-number-format";
import {
  Form,
  Col,
  Row,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import {
  addClient,
  updateClient,
  getClientDetails,
} from "../../redux/actions/clientActions";
import DeleteModal from "../core/DeleteModal";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const Client = (props: any) => {
  const [title, setTitle] = useState("New Client");
  const history = useHistory();
  const months = ["01", "03", "05", "07", "08", "10", "12"];
  const [orderBy, setOrderBy] = useState(false);
  const [field, setField] = useState("createdAt");
  const [bookingOrderBy, setBookingOrderBy] = useState(false);
  const [bookingField, setBookingField] = useState("appTimeStart");
  const [activePage, setActivePage] = useState(1);
  const [perPage] = useState(10);
  const userDetails = localStorage.getItem("userDetails");
  const [getproductOrders, setGetProductOrders] = useState<any[]>([]);
  const [getBookingOrders, setGetBookingOrders] = useState<any[]>([]);
  const [staffVal, setStaffVal] = useState("all");
  const [statusVal, setStatusVal] = useState("all");
  //const [staffBookingVal, setStaffBookingVal] = useState("all");
  //const [statusBookingVal, setStatusBookingVal] = useState("all");
  const [localUser, setLocalUser] = useState({
    businessId: "",
    name: "1",
    id: "1",
    email: "1",
    firstName: "1",
    lastName: "1",
  });
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState(true);
  const [client, setClient] = useState({
    firstName: "",
    lastName: "",
    countryCode: "",
    phoneNumber: "",
    email: "",
    gender: "",
    status: "active",
    dob: {
      day: "",
      month: "",
    },
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
    },
    roles: ["client"],
    notes: "",
    cards: [],
    devices: [],
  });
  const [dob, setDob] = useState({
    day: "",
    month: "",
  });
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const report = useSelector((state: any) => state.report);
  const service = useSelector((state: any) => state.service);
  const clientInfo = user.clientInfo;
  const allStylist = user.allStylist;
  const allStaff = user.allStaff;
  const allProductOrder = report.getproductOrders;
  const allServiceOrder = service.orderDetails;
  const [modalPopup, setModalPopup] = useState({
    deleteModal: false,
    id: "",
    name: "",
    index: "",
  });
  const [initialModalPopup] = useState({ ...modalPopup });

  //search status
  const productOrdersStatuses = [
    {
      status: "paid",
      name: "paid",
    },
    {
      status: "created",
      name: "created",
    },
    {
      status: "canceled",
      name: "canceled",
    },
  ];

  /* Get urlparams values */
  const view = window.location.href.includes("view");
  const urlParams = useParams();
  const id = urlParams.id;
  const bussinessId = localStorage.getItem("businessId");

  useEffect(
    () => setLocalUser(JSON.parse(localStorage.userDetails)),
    [userDetails]
  );

  useEffect(() => {
    if (view) {
      setTitle("Client Details");
      let params = {
        businessId: bussinessId,
      };
      props.getClientDetails(id, params);
      getAllOrder();
      getAllProduct();
      getAllStylist();
      let staffRole = {
        text: "",
        status: "",
        role: "all",
      };
      getAllStaff(staffRole);
    }
  }, [view]);

  useEffect(() => {
    if (view && Object.keys(clientInfo).length !== 0) {
      setClient(clientInfo);
      setDisable(true);
      dob.day = moment(clientInfo.dob).format("DD");
      dob.month = moment(clientInfo.dob).format("MM");
    }
  }, [clientInfo]);
  useEffect(() => {
    setError(
      client.firstName &&
        client.firstName.length &&
        client.lastName &&
        client.lastName.length &&
        client.countryCode &&
        client.countryCode.length &&
        client.phoneNumber &&
        client.phoneNumber.length
        ? true
        : false
    );
  }, [client]);

  useEffect(() => {
    setGetProductOrders(allProductOrder);
    clientFliterData();
  }, [allProductOrder]);

  /*   useEffect(() => {
    setGetBookingOrders(allServiceOrder);
    clientBookingFilter();
  }, [allServiceOrder]); */

  // All Order Details
  const getAllOrder = () => {
    var data: any = {
      clientId: {
        $eq: id,
      },
      type: {
        $eq: "services",
      },
    };
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.getAllOrder(query);
  };

  //To get all product Details
  const getAllProduct = () => {
    var data: any = {
      clientId: {
        $eq: id,
      },
      type: {
        $eq: "products",
      },
    };
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.getproductOrders(query);
  };

  //To get all staff stylist
  const getAllStylist = () => {
    var data: any = {
      filter: {
        roles: {
          $in: ["stylist"],
        },
      },
    };
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.getAllStylist(query);
  };

  //To get All staff
  const getAllStaff = (params: any) => {
    var requestRoles = ["admin", "stylist", "support"];
    if (params.role !== "all") {
      requestRoles = [params.role];
    }
    var data: any = {
      filter: {
        roles: {
          $in: requestRoles,
        },
      },
    };
    if (params.status) {
      data.filter.status = {
        $in: [params.status],
      };
    } else {
      data.filter.status = {
        $in: ["active", "inactive"],
      };
    }
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.getAllStaff(query);
  };

  const handleSubmit = (values: any) => {
    values.businessId = bussinessId;
    values.dob = new Date(
      values.dob.month + "/" + values.dob.day + "/" + "2000"
    );
    if (view) {
      props.updateClient(values, history);
    } else {
      props.addClient(values, history);
    }
  };

  const handleCancel = (e: any) => {
    props.history.push("/clients");
  };

  //For Products Purchased
  const handleSortChange = (key: any) => {
    if (field === key) {
      setOrderBy(!orderBy);
    } else {
      setOrderBy(true);
      setField(key);
    }
    sorting(getproductOrders, key, orderBy);
  };

  //Bookings
  const handleBookingSortChange = (key: any) => {
    if (bookingField === key) {
      setBookingOrderBy(!bookingOrderBy);
    } else {
      setBookingOrderBy(true);
      setBookingField(key);
    }
    sorting(getBookingOrders, key, bookingOrderBy);
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
      if (element.status !== "canceled") {
        var addToPriceSum =
          element !== undefined && element !== null ? element.amount : 0;
        sumOfAddition = sumOfAddition + addToPriceSum;
      }
    });
    return sumOfAddition.toFixed(2);
  };

  const tax = (searchResults: any) => {
    let sumOfAddition = 0;
    searchResults.forEach((element: any) => {
      if (element.status !== "canceled") {
        var addTotaxSum =
          element !== undefined && element !== null ? element.tax : 0;
        sumOfAddition = sumOfAddition + addTotaxSum;
      }
    });
    return sumOfAddition.toFixed(2);
  };

  const total = (searchResults: any) => {
    let sumOfAddition = 0;

    searchResults.forEach((element: any) => {
      if (element.status !== "canceled") {
        var addToadditionSum =
          element !== undefined && element !== null ? element.total : 0;
        sumOfAddition = addToadditionSum + sumOfAddition;
      }
    });

    return sumOfAddition.toFixed(2);
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

  const handleChangeDob = (event: any) => {
    setDob({
      ...dob,
      [event.target.name]: event.target.value,
    });
  };
  const basicFormSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    phoneNumber: yup.string().required("Phone Number is required"),
  });

  //Products Purchased Search Filter Calling Below clientFliterData Function
  const clientDetailsFilter = (e: any) => {
    e.preventDefault();
    setGetProductOrders(allProductOrder);
    clientFliterData();
  };

  //Products Purchased Search Data Filter
  const clientFliterData = () => {
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
    if (allProductOrder != undefined) {
      staffData(allProductOrder);
    }
  };

  //Bookings Function
  /*  
  const clientBookingFilter = (e: any) => {
    e.preventDefault();
    setGetBookingOrders(allServiceOrder);
    tempFliterBooking();
  };
  const tempFliterBooking = () => {
    const tempstatusVal = (newFliterJob: any) => {
      if (statusBookingVal == "all") {
        if (staffBookingVal == "all") {
          setGetBookingOrders(newFliterJob);
        } else {
          const newSecFliterJob: any = newFliterJob.filter((data: any) => {
            return Object.values(data)
              .join(" ")
              .toLocaleLowerCase()
              .includes(staffBookingVal);
          });
          setGetBookingOrders(newSecFliterJob);
        }
      } else {
        const newSecFliterJob: any = newFliterJob.filter((data: any) => {
          console.log(data, statusVal);
          return Object.values(data)
            .join(" ")
            .toLocaleLowerCase()
            .includes(statusBookingVal);
        });
        setGetBookingOrders(newSecFliterJob);
      }
    };

    const staffBookingData = (staffValData: any) => {
      if (staffBookingVal == "all") {
        const newFliterJob: any = staffValData;
        tempstatusVal(newFliterJob);
      } else {
        const newFliterJob: any = staffValData.filter((data: any) => {
          console.log(Object.values(data));
          return Object.values(data)
            .join(" ")
            .toLocaleLowerCase()
            .includes(staffBookingVal);
        });
        tempstatusVal(newFliterJob);
      }
    };
    staffBookingData(allServiceOrder);
  }; */

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading && (
        <React.Fragment>
          <PageHeader title={title} />
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item active">
                    <a
                      className="nav-link"
                      id="client-tab"
                      data-toggle="tab"
                      href="#client"
                      role="tab"
                      aria-controls="client"
                      aria-selected="true"
                    >
                      Client Info
                    </a>
                  </li>
                  {view && (
                    <React.Fragment>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          id="booking-tab"
                          data-toggle="tab"
                          href="#booking"
                          role="tab"
                          aria-controls="booking"
                          aria-selected="false"
                        >
                          Bookings
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          id="product-tab"
                          data-toggle="tab"
                          href="#product"
                          role="tab"
                          aria-controls="product"
                          aria-selected="false"
                        >
                          Products Purchased
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          id="device-tab"
                          data-toggle="tab"
                          href="#device"
                          role="tab"
                          aria-controls="device"
                          aria-selected="false"
                        >
                          Device Logs
                        </a>
                      </li>
                    </React.Fragment>
                  )}
                </ul>
                {/* Client Info*/}
                <div className="tab-content" id="myTabContent">
                  <div
                    className="tab-pane active"
                    id="client"
                    role="tabpanel"
                    aria-labelledby="client-tab"
                  >
                    <Formik
                      initialValues={{ ...client }}
                      validationSchema={basicFormSchema}
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
                        isSubmitting,
                        dirty,
                        isValid,
                      }) => {
                        return (
                          <Form
                            name="clientEdit"
                            className="form-horizontal"
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                          >
                            {UI.errors && (
                              <div className="row">
                                <div className="col-sm-12">
                                  <div
                                    className="alert alert-danger"
                                    role="alert"
                                  >
                                    {"Can not save your data."}{" "}
                                    {UI.errors.data.message}
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="ibox float-e-margins m-b-none">
                              <div className="ibox-content no-border">
                                <div className="m-t-md">
                                  <Row>
                                    <Col md="8">
                                      {UI.errors && UI.errors.message && (
                                        <div className="text-danger m-t-md m-b-md">
                                          Can not save your data.
                                          {UI.errors.message}
                                        </div>
                                      )}
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col md="6">
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          First Name
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            name="firstName"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                              errors.firstName &&
                                              touched.firstName
                                            }
                                            disabled={disable}
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Last Name
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            disabled={disable}
                                            name="lastName"
                                            value={values.lastName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                              errors.lastName &&
                                              touched.lastName
                                            }
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Date of Birth
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            as="select"
                                            name="month"
                                            value={dob.month}
                                            onChange={handleChangeDob}
                                            onBlur={handleBlur}
                                            style={{
                                              width: "59%",
                                              marginRight: "1%",
                                              float: "left",
                                            }}
                                          >
                                            <option value="">Month</option>
                                            <option value="01">January</option>
                                            <option value="02">February</option>
                                            <option value="03">March</option>
                                            <option value="04">April</option>
                                            <option value="05">May</option>
                                            <option value="06">June</option>
                                            <option value="07">July</option>
                                            <option value="08">August</option>
                                            <option value="09">
                                              September
                                            </option>
                                            <option value="10">October</option>
                                            <option value="11">November</option>
                                            <option value="12">December</option>
                                          </FormControl>
                                          <FormControl
                                            as="select"
                                            name="day"
                                            value={dob.day}
                                            onChange={handleChangeDob}
                                            onBlur={handleBlur}
                                            style={{
                                              width: "40%",
                                              float: "left",
                                            }}
                                          >
                                            <option value="">Day</option>
                                            <option value="01">01</option>
                                            <option value="02">02</option>
                                            <option value="03">03</option>
                                            <option value="04">04</option>
                                            <option value="05">05</option>
                                            <option value="06">06</option>
                                            <option value="07">07</option>
                                            <option value="08">08</option>
                                            <option value="09">09</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                            <option value="16">16</option>
                                            <option value="17">17</option>
                                            <option value="18">18</option>
                                            <option value="19">19</option>
                                            <option value="20">20</option>
                                            <option value="21">21</option>
                                            <option value="22">22</option>
                                            <option value="23">23</option>
                                            <option value="24">24</option>
                                            <option value="25">25</option>
                                            <option value="26">26</option>
                                            <option value="27">27</option>
                                            <option value="28">28</option>
                                            <option value="29">29</option>
                                            {values.dob.month !== "02" && (
                                              <option value="30">30</option>
                                            )}
                                            {values.dob.month != "02" &&
                                              months.includes(
                                                values.dob.month
                                              ) && (
                                                <option value="31">31</option>
                                              )}
                                          </FormControl>
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Country Code
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            as="select"
                                            name="countryCode"
                                            value={values.countryCode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            disabled={disable}
                                            isInvalid={
                                              errors.countryCode &&
                                              touched.countryCode
                                            }
                                          >
                                            <option value="">Select</option>
                                            <option value="+1">USA (+1)</option>
                                            <optgroup label="Other countries">
                                              <option value="+213">
                                                Algeria (+213)
                                              </option>
                                              <option value="+376">
                                                Andorra (+376)
                                              </option>
                                              <option value="+244">
                                                Angola (+244)
                                              </option>
                                              <option value="+1264">
                                                Anguilla (+1264)
                                              </option>
                                              <option value="+1268">
                                                Antigua &amp;Barbuda (+1268)
                                              </option>
                                              <option value="+54">
                                                Argentina (+54)
                                              </option>
                                              <option value="+374">
                                                Armenia (+374)
                                              </option>
                                              <option value="+297">
                                                Aruba (+297)
                                              </option>
                                              <option value="+61">
                                                Australia (+61)
                                              </option>
                                              <option value="+43">
                                                Austria (+43)
                                              </option>
                                              <option value="+994">
                                                Azerbaijan (+994)
                                              </option>
                                              <option value="+1242">
                                                Bahamas (+1242)
                                              </option>
                                              <option value="+973">
                                                Bahrain (+973)
                                              </option>
                                              <option value="+880">
                                                Bangladesh (+880)
                                              </option>
                                              <option value="+1246">
                                                Barbados (+1246)
                                              </option>
                                              <option value="+375">
                                                Belarus (+375)
                                              </option>
                                              <option value="+32">
                                                Belgium (+32)
                                              </option>
                                              <option value="+501">
                                                Belize (+501)
                                              </option>
                                              <option value="+229">
                                                Benin (+229)
                                              </option>
                                              <option value="+1441">
                                                Bermuda (+1441)
                                              </option>
                                              <option value="+975">
                                                Bhutan (+975)
                                              </option>
                                              <option value="+591">
                                                Bolivia (+591)
                                              </option>
                                              <option value="+387">
                                                Bosnia Herzegovina (+387)
                                              </option>
                                              <option value="+267">
                                                Botswana (+267)
                                              </option>
                                              <option value="+55">
                                                Brazil (+55)
                                              </option>
                                              <option value="+673">
                                                Brunei (+673)
                                              </option>
                                              <option value="+359">
                                                Bulgaria (+359)
                                              </option>
                                              <option value="+226">
                                                Burkina Faso (+226)
                                              </option>
                                              <option value="+257">
                                                Burundi (+257)
                                              </option>
                                              <option value="+855">
                                                Cambodia (+855)
                                              </option>
                                              <option value="+237">
                                                Cameroon (+237)
                                              </option>
                                              <option value="+1">
                                                Canada (+1)
                                              </option>
                                              <option value="+238">
                                                Cape Verde Islands (+238)
                                              </option>
                                              <option value="+1345">
                                                Cayman Islands (+1345)
                                              </option>
                                              <option value="+236">
                                                Central African Republic (+236)
                                              </option>
                                              <option value="+56">
                                                Chile (+56)
                                              </option>
                                              <option value="+86">
                                                China (+86)
                                              </option>
                                              <option value="+57">
                                                Colombia (+57)
                                              </option>
                                              <option value="+269">
                                                Comoros (+269)
                                              </option>
                                              <option value="+242">
                                                Congo (+242)
                                              </option>
                                              <option value="+682">
                                                Cook Islands (+682)
                                              </option>
                                              <option value="+506">
                                                Costa Rica (+506)
                                              </option>
                                              <option value="+385">
                                                Croatia (+385)
                                              </option>
                                              <option value="+53">
                                                Cuba (+53)
                                              </option>
                                              <option value="+90392">
                                                Cyprus North (+90392)
                                              </option>
                                              <option value="+357">
                                                Cyprus South (+357)
                                              </option>
                                              <option value="+42">
                                                Czech Republic (+42)
                                              </option>
                                              <option value="+45">
                                                Denmark (+45)
                                              </option>
                                              <option value="+253">
                                                Djibouti (+253)
                                              </option>
                                              <option value="+1809">
                                                Dominica (+1809)
                                              </option>
                                              <option value="+1809">
                                                Dominican Republic (+1809)
                                              </option>
                                              <option value="+593">
                                                Ecuador (+593)
                                              </option>
                                              <option value="+20">
                                                Egypt (+20)
                                              </option>
                                              <option value="+503">
                                                El Salvador (+503)
                                              </option>
                                              <option value="+240">
                                                Equatorial Guinea (+240)
                                              </option>
                                              <option value="+291">
                                                Eritrea (+291)
                                              </option>
                                              <option value="+372">
                                                Estonia (+372)
                                              </option>
                                              <option value="+251">
                                                Ethiopia (+251)
                                              </option>
                                              <option value="+500">
                                                Falkland Islands (+500)
                                              </option>
                                              <option value="+298">
                                                Faroe Islands (+298)
                                              </option>
                                              <option value="+679">
                                                Fiji (+679)
                                              </option>
                                              <option value="+358">
                                                Finland (+358)
                                              </option>
                                              <option value="+33">
                                                France (+33)
                                              </option>
                                              <option value="+594">
                                                French Guiana (+594)
                                              </option>
                                              <option value="+689">
                                                French Polynesia (+689)
                                              </option>
                                              <option value="+241">
                                                Gabon (+241)
                                              </option>
                                              <option value="+220">
                                                Gambia (+220)
                                              </option>
                                              <option value="+7880">
                                                Georgia (+7880)
                                              </option>
                                              <option value="+49">
                                                Germany (+49)
                                              </option>
                                              <option value="+233">
                                                Ghana (+233)
                                              </option>
                                              <option value="+350">
                                                Gibraltar (+350)
                                              </option>
                                              <option value="+30">
                                                Greece (+30)
                                              </option>
                                              <option value="+299">
                                                Greenland (+299)
                                              </option>
                                              <option value="+1473">
                                                Grenada (+1473)
                                              </option>
                                              <option value="+590">
                                                Guadeloupe (+590)
                                              </option>
                                              <option value="+671">
                                                Guam (+671)
                                              </option>
                                              <option value="+502">
                                                Guatemala (+502)
                                              </option>
                                              <option value="+224">
                                                Guinea (+224)
                                              </option>
                                              <option value="+245">
                                                Guinea - Bissau (+245)
                                              </option>
                                              <option value="+592">
                                                Guyana (+592)
                                              </option>
                                              <option value="+509">
                                                Haiti (+509)
                                              </option>
                                              <option value="+504">
                                                Honduras (+504)
                                              </option>
                                              <option value="+852">
                                                Hong Kong (+852)
                                              </option>
                                              <option value="+36">
                                                Hungary (+36)
                                              </option>
                                              <option value="+354">
                                                Iceland (+354)
                                              </option>
                                              <option value="+91">
                                                India (+91)
                                              </option>
                                              <option value="+62">
                                                Indonesia (+62)
                                              </option>
                                              <option value="+98">
                                                Iran (+98)
                                              </option>
                                              <option value="+964">
                                                Iraq (+964)
                                              </option>
                                              <option value="+353">
                                                Ireland (+353)
                                              </option>
                                              <option value="+972">
                                                Israel (+972)
                                              </option>
                                              <option value="+39">
                                                Italy (+39)
                                              </option>
                                              <option value="+1876">
                                                Jamaica (+1876)
                                              </option>
                                              <option value="+81">
                                                Japan (+81)
                                              </option>
                                              <option value="+962">
                                                Jordan (+962)
                                              </option>
                                              <option value="+7">
                                                Kazakhstan (+7)
                                              </option>
                                              <option value="+254">
                                                Kenya (+254)
                                              </option>
                                              <option value="+686">
                                                Kiribati (+686)
                                              </option>
                                              <option value="+850">
                                                Korea North (+850)
                                              </option>
                                              <option value="+82">
                                                Korea South (+82)
                                              </option>
                                              <option value="+965">
                                                Kuwait (+965)
                                              </option>
                                              <option value="+996">
                                                Kyrgyzstan (+996)
                                              </option>
                                              <option value="+856">
                                                Laos (+856)
                                              </option>
                                              <option value="+371">
                                                Latvia (+371)
                                              </option>
                                              <option value="+961">
                                                Lebanon (+961)
                                              </option>
                                              <option value="+266">
                                                Lesotho (+266)
                                              </option>
                                              <option value="+231">
                                                Liberia (+231)
                                              </option>
                                              <option value="+218">
                                                Libya (+218)
                                              </option>
                                              <option value="+417">
                                                Liechtenstein (+417)
                                              </option>
                                              <option value="+370">
                                                Lithuania (+370)
                                              </option>
                                              <option value="+352">
                                                Luxembourg (+352)
                                              </option>
                                              <option value="+853">
                                                Macao (+853)
                                              </option>
                                              <option value="+389">
                                                Macedonia (+389)
                                              </option>
                                              <option value="+261">
                                                Madagascar (+261)
                                              </option>
                                              <option value="+265">
                                                Malawi (+265)
                                              </option>
                                              <option value="+60">
                                                Malaysia (+60)
                                              </option>
                                              <option value="+960">
                                                Maldives (+960)
                                              </option>
                                              <option value="+223">
                                                Mali (+223)
                                              </option>
                                              <option value="+356">
                                                Malta (+356)
                                              </option>
                                              <option value="+692">
                                                Marshall Islands (+692)
                                              </option>
                                              <option value="+596">
                                                Martinique (+596)
                                              </option>
                                              <option value="+222">
                                                Mauritania (+222)
                                              </option>
                                              <option value="+269">
                                                Mayotte (+269)
                                              </option>
                                              <option value="+52">
                                                Mexico (+52)
                                              </option>
                                              <option value="+691">
                                                Micronesia (+691)
                                              </option>
                                              <option value="+373">
                                                Moldova (+373)
                                              </option>
                                              <option value="+377">
                                                Monaco (+377)
                                              </option>
                                              <option value="+976">
                                                Mongolia (+976)
                                              </option>
                                              <option value="+1664">
                                                Montserrat (+1664)
                                              </option>
                                              <option value="+212">
                                                Morocco (+212)
                                              </option>
                                              <option value="+258">
                                                Mozambique (+258)
                                              </option>
                                              <option value="+95">
                                                Myanmar (+95)
                                              </option>
                                              <option value="+264">
                                                Namibia (+264)
                                              </option>
                                              <option value="+674">
                                                Nauru (+674)
                                              </option>
                                              <option value="+977">
                                                Nepal (+977)
                                              </option>
                                              <option value="+31">
                                                Netherlands (+31)
                                              </option>
                                              <option value="+687">
                                                New Caledonia (+687)
                                              </option>
                                              <option value="+64">
                                                New Zealand (+64)
                                              </option>
                                              <option value="+505">
                                                Nicaragua (+505)
                                              </option>
                                              <option value="+227">
                                                Niger (+227)
                                              </option>
                                              <option value="+234">
                                                Nigeria (+234)
                                              </option>
                                              <option value="+683">
                                                Niue (+683)
                                              </option>
                                              <option value="+672">
                                                Norfolk Islands (+672)
                                              </option>
                                              <option value="+670">
                                                Northern Marianas (+670)
                                              </option>
                                              <option value="+47">
                                                Norway (+47)
                                              </option>
                                              <option value="+968">
                                                Oman (+968)
                                              </option>
                                              <option value="+680">
                                                Palau (+680)
                                              </option>
                                              <option value="+507">
                                                Panama (+507)
                                              </option>
                                              <option value="+675">
                                                Papua New Guinea (+675)
                                              </option>
                                              <option value="+595">
                                                Paraguay (+595)
                                              </option>
                                              <option value="+51">
                                                Peru (+51)
                                              </option>
                                              <option value="+63">
                                                Philippines (+63)
                                              </option>
                                              <option value="+48">
                                                Poland (+48)
                                              </option>
                                              <option value="+351">
                                                Portugal (+351)
                                              </option>
                                              <option value="+1787">
                                                Puerto Rico (+1787)
                                              </option>
                                              <option value="+974">
                                                Qatar (+974)
                                              </option>
                                              <option value="+262">
                                                Reunion (+262)
                                              </option>
                                              <option value="+40">
                                                Romania (+40)
                                              </option>
                                              <option value="+7">
                                                Russia (+7)
                                              </option>
                                              <option value="+250">
                                                Rwanda (+250)
                                              </option>
                                              <option value="+378">
                                                San Marino (+378)
                                              </option>
                                              <option value="+239">
                                                Sao Tome &amp; Principe (+239)
                                              </option>
                                              <option value="+966">
                                                Saudi Arabia (+966)
                                              </option>
                                              <option value="+221">
                                                Senegal (+221)
                                              </option>
                                              <option value="+381">
                                                Serbia (+381)
                                              </option>
                                              <option value="+248">
                                                Seychelles (+248)
                                              </option>
                                              <option value="+232">
                                                Sierra Leone (+232)
                                              </option>
                                              <option value="+65">
                                                Singapore (+65)
                                              </option>
                                              <option value="+421">
                                                Slovak Republic (+421)
                                              </option>
                                              <option value="+386">
                                                Slovenia (+386)
                                              </option>
                                              <option value="+677">
                                                Solomon Islands (+677)
                                              </option>
                                              <option value="+252">
                                                Somalia (+252)
                                              </option>
                                              <option value="+27">
                                                South Africa (+27)
                                              </option>
                                              <option value="+34">
                                                Spain (+34)
                                              </option>
                                              <option value="+94">
                                                Sri Lanka (+94)
                                              </option>
                                              <option value="+290">
                                                St. Helena (+290)
                                              </option>
                                              <option value="+1869">
                                                St. Kitts (+1869)
                                              </option>
                                              <option value="+1758">
                                                St. Lucia (+1758)
                                              </option>
                                              <option value="+249">
                                                Sudan (+249)
                                              </option>
                                              <option value="+597">
                                                Suriname (+597)
                                              </option>
                                              <option value="+268">
                                                Swaziland (+268)
                                              </option>
                                              <option value="+46">
                                                Sweden (+46)
                                              </option>
                                              <option value="+41">
                                                Switzerland (+41)
                                              </option>
                                              <option value="+963">
                                                Syria (+963)
                                              </option>
                                              <option value="+886">
                                                Taiwan (+886)
                                              </option>
                                              <option value="+7">
                                                Tajikstan (+7)
                                              </option>
                                              <option value="+66">
                                                Thailand (+66)
                                              </option>
                                              <option value="+228">
                                                Togo (+228)
                                              </option>
                                              <option value="+676">
                                                Tonga (+676)
                                              </option>
                                              <option value="+1868">
                                                Trinidad &amp; Tobago (+1868)
                                              </option>
                                              <option value="+216">
                                                Tunisia (+216)
                                              </option>
                                              <option value="+90">
                                                Turkey (+90)
                                              </option>
                                              <option value="+7">
                                                Turkmenistan (+7)
                                              </option>
                                              <option value="+993">
                                                Turkmenistan (+993)
                                              </option>
                                              <option value="+1649">
                                                Turks &amp; Caicos Islands
                                                (+1649)
                                              </option>
                                              <option value="+688">
                                                Tuvalu (+688)
                                              </option>
                                              <option value="+256">
                                                Uganda (+256)
                                              </option>
                                              <option value="+44">
                                                UK (+44)
                                              </option>
                                              <option value="+380">
                                                Ukraine (+380)
                                              </option>
                                              <option value="+971">
                                                United Arab Emirates (+971)
                                              </option>
                                              <option value="+598">
                                                Uruguay (+598)
                                              </option>
                                              <option value="+7">
                                                Uzbekistan (+7)
                                              </option>
                                              <option value="+678">
                                                Vanuatu (+678)
                                              </option>
                                              <option value="+379">
                                                Vatican City (+379)
                                              </option>
                                              <option value="+58">
                                                Venezuela (+58)
                                              </option>
                                              <option value="+84">
                                                Vietnam (+84)
                                              </option>
                                              <option value="+84">
                                                Virgin Islands - British (+1284)
                                              </option>
                                              <option value="+84">
                                                Virgin Islands - US (+1340)
                                              </option>
                                              <option value="+681">
                                                Wallis &amp; Futuna (+681)
                                              </option>
                                              <option value="+969">
                                                Yemen (North)(+969)
                                              </option>
                                              <option value="+967">
                                                Yemen (South)(+967)
                                              </option>
                                              <option value="+260">
                                                Zambia (+260)
                                              </option>
                                              <option value="+263">
                                                Zimbabwe (+263)
                                              </option>
                                            </optgroup>
                                          </FormControl>
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Phone Number
                                        </FormLabel>
                                        <Col sm="8">
                                          <NumberFormat
                                            type="tel"
                                            name="phoneNumber"
                                            className="form-control"
                                            format="(###) ###-####"
                                            allowEmptyFormatting
                                            disabled={disable}
                                            mask="_"
                                            value={values.phoneNumber}
                                            onValueChange={(e: any) => {
                                              if (e.value.length === 10)
                                                values.phoneNumber =
                                                  e.formattedValue;
                                              else values.phoneNumber = "";
                                            }}
                                            onBlur={handleBlur}
                                            isInvalid={
                                              errors.phoneNumber &&
                                              touched.phoneNumber
                                            }
                                            style={
                                              values.phoneNumber == ""
                                                ? { border: "1px solid red" }
                                                : {}
                                            }
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Email
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Status
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            as="select"
                                            name="status"
                                            value={values.status}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            style={{
                                              textTransform: "capitalize",
                                            }}
                                          >
                                            <option value="">Status</option>
                                            <option
                                              selected={
                                                values.status === "active"
                                                  ? "selected"
                                                  : ""
                                              }
                                              value="active"
                                            >
                                              Active
                                            </option>
                                            <option
                                              selected={
                                                values.status === "inactive"
                                                  ? "selected"
                                                  : ""
                                              }
                                              value="inactive"
                                            >
                                              Inactive
                                            </option>
                                          </FormControl>
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Gender
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            as="select"
                                            name="gender"
                                            value={values.gender}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          >
                                            <option value="">Gender</option>
                                            <option
                                              selected={
                                                values.gender === "male"
                                                  ? "selected"
                                                  : ""
                                              }
                                              value="male"
                                            >
                                              Male
                                            </option>
                                            <option
                                              selected={
                                                values.gender === "female"
                                                  ? "selected"
                                                  : ""
                                              }
                                              value="female"
                                            >
                                              Female
                                            </option>
                                          </FormControl>
                                        </Col>
                                      </FormGroup>
                                    </Col>

                                    <Col md="6">
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Street Adress 1
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            name="address.line1"
                                            value={
                                              values.address &&
                                              values.address.line1
                                                ? values.address.line1
                                                : ""
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Street Adress 2
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            name="address.line2"
                                            value={
                                              values.address &&
                                              values.address.line2
                                                ? values.address.line2
                                                : ""
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          City
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            name="address.city"
                                            value={
                                              values.address &&
                                              values.address.city
                                                ? values.address.city
                                                : ""
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          State
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            as="select"
                                            name="address.state"
                                            value={
                                              values.address &&
                                              values.address.state
                                                ? values.address.state
                                                : ""
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          >
                                            <option value=""></option>
                                            {StateList.map((e, index) => (
                                              <option
                                                key={index}
                                                aria-selected={
                                                  values.address &&
                                                  values.address.state &&
                                                  values.address.state ===
                                                    e.full
                                                    ? true
                                                    : false
                                                }
                                                selected={
                                                  values.address &&
                                                  values.address.state &&
                                                  values.address.state ===
                                                    e.full
                                                    ? true
                                                    : false
                                                }
                                                value={e.full}
                                              >
                                                {e.full}
                                              </option>
                                            ))}
                                          </FormControl>
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Zip (postal code)
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            name="address.postal_code"
                                            value={
                                              values.address &&
                                              values.address.postal_code
                                                ? values.address.postal_code
                                                : ""
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Notes
                                          <Tippy
                                            theme={"success"}
                                            maxWidth="225px"
                                            content={
                                              <div>
                                                <p>
                                                  Add anything you would like to
                                                  remember about this client;
                                                  e.g., favorite nail color,
                                                  hair color specifics, likes
                                                  Diet Coke...
                                                </p>
                                              </div>
                                            }
                                          >
                                            <i className="fa fa-question-circle"></i>
                                          </Tippy>
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            as="textarea"
                                            name="notes"
                                            value={values.notes}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            style={{ height: "112px" }}
                                          />
                                        </Col>
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                            <div
                              className="ibox float-e-margins"
                              key="vm.activeTab == 1 || vm.activeTab == 2 || vm.activeTab == 3"
                            >
                              <div className="ibox-content">
                                <div className="row">
                                  <div className="col-md-8">
                                    <div className="form-group">
                                      <div className="col-sm-9 col-sm-offset-3">
                                        <button
                                          className="btn btn-white"
                                          type="button"
                                          onClick={(e) => handleCancel(e)}
                                        >
                                          Cancel
                                        </button>
                                        &nbsp;
                                        <button
                                          className="btn btn-primary"
                                          type="submit"
                                          disabled={
                                            !(
                                              values.firstName &&
                                              values.firstName.length &&
                                              values.lastName &&
                                              values.lastName.length &&
                                              values.countryCode &&
                                              values.countryCode.length &&
                                              values.phoneNumber &&
                                              values.phoneNumber.length
                                            )
                                          }
                                        >
                                          Save Changes
                                          {UI.buttonLoading && (
                                            <i className="fa fa-spinner fa-spin"></i>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Form>
                        );
                      }}
                    </Formik>
                  </div>
                  {/* Booking */}
                  <div
                    className="tab-pane"
                    id="booking"
                    role="tabpanel"
                    aria-labelledby="booking-tab"
                  >
                    <div className="ibox float-e-margins m-b-none">
                      <div className="ibox-content no-border">
                        <div className="m-t-md">
                          <div className="row">
                            <div className="col-md-12">
                              <form role="form">
                                <div className="row">
                                  <div className="col-sm-4">
                                    <div className="form-group">
                                      <label>Staff</label>
                                      <select
                                        className="form-control"
                                        /* onChange={(e) => {setStaffBookingVal(e.target.value);}} */
                                      >
                                        <option value="">All</option>
                                        {allStylist &&
                                          allStylist.length &&
                                          allStylist.map((values: any) => {
                                            return (
                                              <option value={values.id}>
                                                {values.name}
                                              </option>
                                            );
                                          })}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group">
                                      <label>Status</label>
                                      <select
                                        className="form-control"
                                        /* onChange={(e) => {setStatusBookingVal(e.target.value);}} */
                                      >
                                        <option value="">Status</option>
                                        {productOrdersStatuses.map(
                                          (values: any) => {
                                            return (
                                              <option value={values.name}>
                                                {values.status}
                                              </option>
                                            );
                                          }
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group">
                                      <div>
                                        <label>&nbsp;</label>
                                      </div>
                                      <button
                                        id="searchBtn"
                                        className="btn btn-primary"
                                        //onClick={(e) => clientBookingFilter(e)}
                                      >
                                        Search
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                            <div className="col-md-12">
                              <div className="hr-line-dashed"></div>

                              <div className="table-responsive">
                                <table className="table table-bordered table-striped table-hover dataTables-example">
                                  <thead>
                                    <tr>
                                      <th
                                        className={
                                          bookingField !== "appTimeStart"
                                            ? "sorting"
                                            : bookingOrderBy
                                            ? "sorting_asc"
                                            : "sorting_desc"
                                        }
                                        onClick={(e) =>
                                          handleBookingSortChange(
                                            "appTimeStart"
                                          )
                                        }
                                      >
                                        Date/Time
                                      </th>
                                      <th
                                        className={
                                          bookingField !== "staffName"
                                            ? "sorting"
                                            : bookingOrderBy
                                            ? "sorting_asc"
                                            : "sorting_desc"
                                        }
                                        onClick={(e) =>
                                          handleBookingSortChange("staffName")
                                        }
                                      >
                                        Staff
                                      </th>
                                      <th
                                        className={
                                          bookingField !== "categoryName"
                                            ? "sorting"
                                            : bookingOrderBy
                                            ? "sorting_asc"
                                            : "sorting_desc"
                                        }
                                        onClick={(e) =>
                                          handleBookingSortChange(
                                            "categoryName"
                                          )
                                        }
                                      >
                                        Category
                                      </th>
                                      <th
                                        className={
                                          bookingField !== "items[0].name"
                                            ? "sorting"
                                            : bookingOrderBy
                                            ? "sorting_asc"
                                            : "sorting_desc"
                                        }
                                        onClick={(e) =>
                                          handleBookingSortChange(
                                            "items[0].name"
                                          )
                                        }
                                      >
                                        Services
                                      </th>
                                      <th
                                        className={
                                          bookingField !== "amount"
                                            ? "sorting"
                                            : bookingOrderBy
                                            ? "sorting_asc"
                                            : "sorting_desc"
                                        }
                                        onClick={(e) =>
                                          handleBookingSortChange("amount")
                                        }
                                      >
                                        Price
                                      </th>
                                      <th
                                        className={
                                          bookingField !== "tip"
                                            ? "sorting"
                                            : bookingOrderBy
                                            ? "sorting_asc"
                                            : "sorting_desc"
                                        }
                                        onClick={(e) =>
                                          handleBookingSortChange("tip")
                                        }
                                      >
                                        Tip
                                      </th>
                                      <th
                                        className={
                                          bookingField !== "total"
                                            ? "sorting"
                                            : bookingOrderBy
                                            ? "sorting_asc"
                                            : "sorting_desc"
                                        }
                                        onClick={(e) =>
                                          handleBookingSortChange("total")
                                        }
                                      >
                                        Total
                                      </th>
                                      <th
                                        className={
                                          bookingField !== "status"
                                            ? "sorting"
                                            : bookingOrderBy
                                            ? "sorting_asc"
                                            : "sorting_desc"
                                        }
                                        onClick={(e) =>
                                          handleBookingSortChange("status")
                                        }
                                      >
                                        Status
                                      </th>
                                      <th className="text-center">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {allServiceOrder.data &&
                                    allServiceOrder.data.length ? (
                                      <React.Fragment>
                                        {allServiceOrder.data.map(
                                          (order: any, index: any) => {
                                            return (
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
                                                  {order.staffName}
                                                </td>
                                                <td>{order.categoryName}</td>
                                                <td>{order.itemNames}</td>
                                                <td>
                                                  ${order.amount.toFixed(2)}
                                                </td>
                                                <td>${order.tip.toFixed(2)}</td>
                                                <td>
                                                  ${order.total.toFixed(2)}
                                                </td>
                                                <td>
                                                  {order.status === "paid" ? (
                                                    <span
                                                      className="btn btn-xs btn-primary"
                                                      style={{
                                                        width: "80px",
                                                      }}
                                                    >
                                                      Paid
                                                    </span>
                                                  ) : order.status ===
                                                    "created" ? (
                                                    <span
                                                      className="btn btn-xs btn-success"
                                                      style={{
                                                        width: "80px",
                                                      }}
                                                    >
                                                      Created
                                                    </span>
                                                  ) : order.status ==
                                                      "canceled" &&
                                                    order.noShow == true ? (
                                                    <span
                                                      className=" btn btn-xs btn-warning"
                                                      style={{
                                                        width: "80px",
                                                      }}
                                                    >
                                                      No Show
                                                    </span>
                                                  ) : order.status ===
                                                    "canceled" ? (
                                                    <span
                                                      className="btn btn-xs btn-danger"
                                                      style={{
                                                        width: "80px",
                                                      }}
                                                    >
                                                      Cancelled
                                                    </span>
                                                  ) : order.status ===
                                                    "refund" ? (
                                                    <span
                                                      className="btn btn-xs btn-danger"
                                                      style={{
                                                        width: "80px",
                                                      }}
                                                    >
                                                      Refund
                                                    </span>
                                                  ) : order.status ===
                                                    "voided" ? (
                                                    <span
                                                      className="btn btn-xs btn-warning"
                                                      style={{
                                                        width: "80px",
                                                      }}
                                                    >
                                                      Voided
                                                    </span>
                                                  ) : order.status ===
                                                    "extra_service_request" ? (
                                                    <span
                                                      className="btn btn-xs btn-warning"
                                                      style={{
                                                        width: "80px",
                                                      }}
                                                    >
                                                      Requested
                                                    </span>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </td>
                                                <td className="text-center">
                                                  <React.Fragment>
                                                    {order.status ==
                                                      "created" && (
                                                      <td className="text-center">
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
                                                            deletePopup(
                                                              value,
                                                              index
                                                            )
                                                          }
                                                        >
                                                          <i
                                                            title="Delete"
                                                            className="far fa-trash-alt"
                                                          ></i>
                                                        </a>
                                                      </td>
                                                    )}
                                                    {order.status ==
                                                      "canceled" && (
                                                      <Link
                                                        style={{
                                                          cursor: "pointer",
                                                          color: "#2a6954",
                                                        }}
                                                        to={`/services/payments/view/${order.id}`}
                                                      >
                                                        <i
                                                          title="Delete"
                                                          className="far fa-eye"
                                                        ></i>
                                                      </Link>
                                                    )}
                                                  </React.Fragment>
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                        <tr>
                                          <td colSpan={4}>
                                            <strong>Summary: </strong>
                                          </td>
                                          <th>
                                            ${price(allServiceOrder.data)}
                                          </th>
                                          <th>${tax(allServiceOrder.data)}</th>
                                          <th>
                                            ${total(allServiceOrder.data)}
                                          </th>
                                          <th colSpan={2}></th>
                                        </tr>
                                      </React.Fragment>
                                    ) : (
                                      <tr>
                                        <td
                                          colSpan={10}
                                          className="text-center"
                                        >
                                          No Bookings
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
                  {/* Products Purchased */}
                  <div
                    className="tab-pane"
                    id="product"
                    role="tabpanel"
                    aria-labelledby="product-tab"
                  >
                    <div className="ibox float-e-margins m-b-none">
                      <div className="ibox-content no-border">
                        <div className="m-t-md">
                          <div className="row">
                            <div className="col-md-12">
                              <form role="form">
                                <div className="row">
                                  <div className="col-sm-4">
                                    <div className="form-group">
                                      <label>Staff</label>
                                      <select
                                        className="form-control"
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
                                  <div className="col-sm-4">
                                    <div className="form-group">
                                      <label>Status</label>
                                      <select
                                        className="form-control"
                                        onChange={(e) => {
                                          setStatusVal(e.target.value);
                                        }}
                                      >
                                        <option value="all">Status</option>
                                        {productOrdersStatuses.map(
                                          (values: any) => {
                                            return (
                                              <option value={values.name}>
                                                {values.status}
                                              </option>
                                            );
                                          }
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group">
                                      <div>
                                        <label>&nbsp;</label>
                                      </div>
                                      <button
                                        id="searchBtn"
                                        className="btn btn-primary"
                                        onClick={(e) => clientDetailsFilter(e)}
                                      >
                                        Search
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                            <div className="col-md-12">
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
                                        onClick={(e) =>
                                          handleSortChange("createdAt")
                                        }
                                      >
                                        Date/Time
                                      </th>
                                      <th
                                        className={`text-center ${
                                          field !== "staffName"
                                            ? "sorting"
                                            : orderBy
                                            ? "sorting_asc"
                                            : "sorting_desc"
                                        }`}
                                        onClick={(e) =>
                                          handleSortChange("staffName")
                                        }
                                      >
                                        Staff
                                      </th>
                                      <th
                                        className={`text-center ${
                                          field !== "itemNames"
                                            ? "sorting"
                                            : orderBy
                                            ? "sorting_asc"
                                            : "sorting_desc"
                                        }`}
                                        onClick={(e) =>
                                          handleSortChange("itemNames")
                                        }
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
                                        onClick={(e) =>
                                          handleSortChange("amount")
                                        }
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
                                        onClick={(e) =>
                                          handleSortChange("total")
                                        }
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
                                        onClick={(e) =>
                                          handleSortChange("status")
                                        }
                                      >
                                        Status
                                      </th>
                                      <th className="text-center">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {getproductOrders &&
                                      getproductOrders.length && (
                                        <React.Fragment>
                                          {getproductOrders.map(
                                            (value: any, index: any) => {
                                              return (
                                                <tr className="gradeX">
                                                  <td>
                                                    {moment(
                                                      value.createdAt
                                                    ).format("LL LT")}
                                                  </td>
                                                  <td>{value.staffName}</td>
                                                  <td>{value.itemNames}</td>
                                                  <td>
                                                    $
                                                    {commafy(
                                                      value.amount.toFixed(2)
                                                    )}
                                                  </td>
                                                  <td>
                                                    $
                                                    {commafy(
                                                      value.tax.toFixed(2)
                                                    )}
                                                  </td>
                                                  <td>
                                                    $
                                                    {commafy(
                                                      value.total.toFixed(2)
                                                    )}
                                                  </td>
                                                  <td>
                                                    {value.status == "paid" && (
                                                      <span
                                                        className="btn btn-xs btn-primary"
                                                        style={{
                                                          width: "80px",
                                                        }}
                                                      >
                                                        Paid
                                                      </span>
                                                    )}
                                                    {value.status ==
                                                      "created" && (
                                                      <span
                                                        className="btn btn-xs btn-success"
                                                        style={{
                                                          width: "80px",
                                                        }}
                                                      >
                                                        Created
                                                      </span>
                                                    )}

                                                    {value.status ==
                                                      "canceled" && (
                                                      <span
                                                        className="btn btn-xs btn-danger"
                                                        style={{
                                                          width: "80px",
                                                        }}
                                                      >
                                                        Canceled
                                                      </span>
                                                    )}
                                                    {value.status ==
                                                      "refund" && (
                                                      <span
                                                        className="btn btn-xs btn-danger"
                                                        style={{
                                                          width: "80px",
                                                        }}
                                                      >
                                                        Refund
                                                      </span>
                                                    )}
                                                    {value.status ==
                                                      "voided" && (
                                                      <span
                                                        className="btn btn-xs btn-warning"
                                                        style={{
                                                          width: "80px",
                                                        }}
                                                      >
                                                        Voided
                                                      </span>
                                                    )}
                                                    {value.status ==
                                                      "extra_service_request" && (
                                                      <span
                                                        className="btn btn-xs btn-warning"
                                                        style={{
                                                          width: "80px",
                                                        }}
                                                      >
                                                        Requested
                                                      </span>
                                                    )}
                                                  </td>
                                                  {value.status ==
                                                  "canceled" ? (
                                                    <React.Fragment>
                                                      {viewOnPage(
                                                        value.id,
                                                        index
                                                      )}
                                                    </React.Fragment>
                                                  ) : (
                                                    value.status == "paid" && (
                                                      <React.Fragment>
                                                        {viewOnPage(
                                                          value.id,
                                                          index
                                                        )}
                                                      </React.Fragment>
                                                    )
                                                  )}
                                                  {value.status ==
                                                    "created" && (
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
                                                          deletePopup(
                                                            value,
                                                            index
                                                          )
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
                                            }
                                          )}
                                          <tr>
                                            <td colSpan={3}>
                                              <strong>Summary: </strong>
                                              <small>
                                                (Canceled order quantity and its
                                                values are excluded in this
                                                total summary count calculation)
                                              </small>
                                            </td>
                                            <th>
                                              $
                                              {commafy(
                                                (
                                                  Math.round(
                                                    price(getproductOrders)
                                                  ) / 100
                                                ).toFixed(2)
                                              )}
                                            </th>
                                            <th>
                                              $
                                              {commafy(
                                                (
                                                  Math.round(
                                                    tax(getproductOrders)
                                                  ) / 100
                                                ).toFixed(2)
                                              )}
                                            </th>
                                            <th>
                                              $
                                              {commafy(
                                                (
                                                  Math.round(
                                                    total(getproductOrders)
                                                  ) / 100
                                                ).toFixed(2)
                                              )}
                                            </th>
                                            <th colSpan={2}></th>
                                          </tr>
                                        </React.Fragment>
                                      )}
                                  </tbody>
                                </table>
                                {getproductOrders &&
                                getproductOrders.length > 10 ? (
                                  <div className="text-right">
                                    <Pagination
                                      activePage={activePage}
                                      itemsCountPerPage={perPage}
                                      totalItemsCount={getproductOrders.length}
                                      pageRangeDisplayed={5}
                                      onChange={(page: any) =>
                                        setActivePage(page)
                                      }
                                    />
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Device Logs */}
                  <div
                    className="tab-pane"
                    id="device"
                    role="tabpanel"
                    aria-labelledby="device-tab"
                  >
                    <div className="ibox float-e-margins m-b-none">
                      <div className="ibox-content no-border">
                        <div className="m-t-md">
                          <div className="row">
                            <div className="col-md-12">
                              {/* <form role="form">
                                <div className="row">
                                  <div className="col-sm-4">
                                    <div className="form-group">
                                      <label>Staff</label>
                                      <select className="form-control">
                                        <option value="">All</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group">
                                      <label>Status</label>
                                      <select className="form-control">
                                        <option value="">Status</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="form-group">
                                      <div>
                                        <label>&nbsp;</label>
                                      </div>
                                      <button
                                        id="searchBtn"
                                        className="btn btn-primary"
                                        type="submit"
                                      >
                                        Search
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form> */}
                            </div>
                            <div className="col-md-12">
                              <div className="table-responsive">
                                <table className="table table-bordered table-striped table-hover dataTables-example">
                                  <thead>
                                    <tr>
                                      <th>Device Id</th>
                                      <th>Device Token</th>
                                      <th className="text-center">
                                        Device Model
                                      </th>
                                      <th className="text-center">
                                        OS Version
                                      </th>
                                      <th className="text-center">OS Type</th>
                                      <th className="text-center">
                                        App Version
                                      </th>
                                      <th className="text-center">Last View</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {/* <tr
																		style={{
																		color: "green",
																		}}
																		className="gradeX"
																	>
																		<td
																		className="text-ellipsis"
																		title="{{device.deviceId}}"
																		style={{ maxWidth: "150px" }}
																		>
																		device.deviceId
																		</td>
																		<td
																		className="text-ellipsis"
																		title="{{device.token}}"
																		style={{ maxWidth: "150px" }}
																		>
																		device.token
																		</td>
																		<td className="text-center">
																		device.deviceModel
																		</td>
																		<td className="text-center">
																		device.osVersion
																		</td>
																		<td className="text-center">
																		device.ostype
																		</td>
																		<td className="text-center">
																		device.appVersion
																		</td>
																		<td className="text-center">
																		device.lastView | date : "dd MMM yyyy
																		HH:mm:ss:sss Z"
																		</td>
																	</tr> */}
                                    <tr className="text-center">
                                      <td colSpan={7}>No Devices Found</td>
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
  addClient,
  updateClient,
  getClientDetails,
  getAllOrder,
  getproductOrders,
  getAllStaff,
  getAllStylist,
};

export default connect(null, mapActionsToProps)(Client);
