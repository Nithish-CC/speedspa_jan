import React, { useEffect, useState, useRef } from "react";
import { connect, useSelector } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import { sorting, buildFilter } from "../../../utils/common";
import { useHistory, useParams } from "react-router-dom";
import _ from "lodash";
import PageHeader from "../../core/PageHeader";
import {
  getAllCategory,
  getAllService,
} from "../../../redux/actions/serviceActions";
import {
  getAllStylist,
  getAllStaff,
  staffService,
} from "../../../redux/actions/staffActions";
import { searchClients } from "../../../redux/actions/clientActions";
import {
  addAppointments,
  getAppointment,
  getAppointmentOrder,
} from "../../../redux/actions/scheduleActions";
import { Formik } from "formik";
import SelectSearch from "react-select-search";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker-input";
import {
  Form,
  Col,
  Row,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
  InputGroup,
} from "react-bootstrap";
import { AnyObject } from "yup/lib/types";

const AddSchedule = (props: any) => {
  const [title] = useState("New Appointment");
  const [errors, setErrors] = useState({} as Error);
  const view = window.location.href.includes("view");
  const urlParams = useParams();
  const id = urlParams.id;
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const userDetails = localStorage.getItem("userDetails");
  const businessId = localStorage.businessId;
  const service = useSelector((state: any) => state.service);
  const categoryDetails = service.categoryDetails;
  const serviceDetails = service.serviceDetails;
  const staffService = user.staffService;
  const allStaff = user.allStaff;
  const schedule = useSelector((state: any) => state.schedule);
  const appointment = schedule.appointment;
  const appointmentOrder = schedule.appointmentOrder;
  const history = useHistory();
  const searchInput = useRef();
  const [changeStaff, setchangeStaff] = useState({ name: "", value: "" });
  const [options, setOptions] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any[]>([]);
  const [changeCustomer, setchangeCustomer] = useState({ name: "", value: 0 });
  const allClient = user.allClients;
  const [params, setParams] = useState({
    begin_time: moment(new Date()).format("LLLL"),
    end_time: moment(new Date()).format("YYYY-MM-DD"),
  });
  const [serviceOption, setServiceOption] = useState<any[]>([]);
  const [staffMainService, setStaffMainService] = useState<any[]>([]);
  const [serviceCategoryId, setSerivceCategoryId] = useState("");
  const addSchedule = {
    businessId: "",
    categoryId: "",
    clientId: "",
    createdBy: {
      name: "",
      firstName: "",
      lastName: "",
      email: "",
      id: "",
    },
    resourceId: "",
    timeStart: "",
  };
  const [localUser, setLocalUser] = useState({
    name: "1",
    id: "1",
    email: "1",
    firstName: "1",
    lastName: "1",
  });
  const [mainServiceCategory, setMainServiceCategory] = useState<any[]>([]);
  const [value, setValue] = useState("00:00");
  const [startDate, setStartDate] = useState(new Date());
  const randomStr = _.uniqueId(getRandomStr(5) + "_") + new Date().getTime();
  // To set which user has ordered
  useEffect(
    () => setLocalUser(JSON.parse(localStorage.userDetails)),
    [userDetails]
  );

  function getRandomStr(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  useEffect(() => {
    let params = {
      businessId: businessId,
    };
    if (UI.errors) {
      setErrors(UI.errors);
    }
    if (view) {
      props.getAppointment(id, params);
      props.getAppointmentOrder(id, params);
    }
    props.getAllCategory(params);
    props.getAllService(params);
    getAllStaff();
    getAllClient();
  }, [view]);

  const getAllStaff = () => {
    var data: any = {
      filter: {
        roles: {
          $in: ["stylist"],
        },
      },
    };
    data.filter.status = {
      $not: {
        $eq: "inactive",
      },
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
          },
        },
      },
    };
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.searchClients(query);
  };

  const getAllStaffMainService = (staffMainService: any) => {
    var data: any = {
      id: staffMainService,
    };
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.staffService(query);
  };

  const handleStaffFilter = (items: any) => {
    return (searchValue: any) => {
      if (searchValue.length === 0) {
        return options;
      }

      const newItems = items.filter((item: any) => {
        return item.name.toLowerCase().includes(searchValue.toLowerCase());
      });
      return newItems;
    };
  };

  const handleChangeStaff = (...args: any) => {
    setchangeStaff(args[1]);
  };

  useEffect(() => {
    optionsData(allStaff);
  }, [allStaff]);

  useEffect(() => {
    optionsData(staffService);
  }, [staffService]);

  const optionsData = (allStaff: any) => {
    let tempArr: any[] = [];
    if (allStaff && allStaff.length) {
      allStaff.forEach((element: any) => {
        if (element.name) {
          tempArr.push({
            name: element.name,
            value: element.id,
          });
        } else {
          tempArr.push({
            name: element.firstName + " " + element.lastName,
            value: element.id,
          });
        }
      });
    }
    setOptions(tempArr);
  };

  const optionsClientData = (allClient: any) => {
    let tempArr: any[] = [];
    allClient.forEach((element: any) => {
      tempArr.push({
        name: element.name,
        value: element.id,
      });
    });
    setCustomer(tempArr);
  };

  useEffect(() => {
    optionsClientData(allClient);
  }, [allClient]);

  const handleChangeCustomer = (...args: any) => {
    setchangeCustomer(args[1]);
  };

  const optionsServiceData = (mainServiceCategory: any) => {
    let tempArr: any[] = [];
    mainServiceCategory.forEach((element: any) => {
      tempArr.push({
        name: element.name,
        value: element.id,
      });
    });
    setServiceOption(tempArr);
  };

  useEffect(() => {
    optionsClientData(allClient);
  }, [allClient]);
  useEffect(() => {
    mainServiceCategory.map((value: any) => {});
    optionsServiceData(mainServiceCategory);
  }, [mainServiceCategory]);

  const handleCustomerFilter = (items: any) => {
    return (searchValue: any) => {
      if (searchValue.length === 0) {
        return customer;
      }
      const newItems = items.filter((item: any) => {
        return item.name.toLowerCase().includes(searchValue.toLowerCase());
      });
      return newItems;
    };
  };

  const objectToQueryString = (obj: any) => {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  };

  const handleSubmit = (values: any) => {
    let setDate = startDate.toISOString().split("T")[0];
    let m = moment(`${setDate} ${value}`, "YYYY-MM-DD HH:mm");
    let setDateTime = m.toISOString();
    let check = {
      checkFreeTime: 1,
      checkResourceSchedule: 1,
      checkSeats: 1,
    };

    var queryString = objectToQueryString(check);
    values.businessId = businessId;
    values.categoryId = serviceCategoryId;
    values.clientId = String(changeCustomer.value);
    values.createdBy = {
      email: localUser.email,
      id: localUser.id,
      name: localUser.firstName + " " + localUser.lastName,
      firstName: localUser.firstName,
      lastName: localUser.lastName,
    };
    if (weeklyRepeat) {
      values.repeatRefId = randomStr;
    }
    values.resourceId = String(changeStaff.value);
    values.services = [staffMainService[0]];
    values.timeStart = setDateTime;
    repeatAppointments(values);
    props.addAppointments(values, queryString);
  };

  const selectedValue = (value: any) => {
    const mainService = _.filter(
      serviceDetails,
      (serviceDetails) => serviceDetails.id === value
    );
    return mainService;
  };

  const selectedCategoryValue = (value: any) => {
    const mainService = _.filter(
      serviceDetails,
      (serviceDetails) => serviceDetails.categoryId === value
    );

    return mainService;
  };

  const [addOnServiceData, setAddOnServiceData] = useState<any[]>([]);

  const [chooseAddOnOne, setChooseAddOnOne] = useState<any[]>([]);

  const chooseAddOnServiceValue = (value: any, id: number) => {
    const toFindServiceId = _.find(value, (value) => value.serviceId === id);
    let tempArr: any[] = [];
    toFindServiceId.servicesIds.forEach((servicesIdsValue: number) => {
      const addOnServiceData = _.find(
        serviceDetails,
        (serviceDetails) => serviceDetails.id === servicesIdsValue
      );
      tempArr.push(addOnServiceData);
    });
    setChooseAddOnOne(tempArr);
  };

  const [addOnServiceIds, setAddonServiceIds] = useState([]);

  const addOnServiceValue = (value: any) => {
    setAddonServiceIds(value);
    const tempArr: any[] = [];
    value.forEach((value: any) => {
      const addOnServiceData = _.find(
        serviceDetails,
        (serviceDetails) => serviceDetails.id === value.serviceId
      );
      tempArr.push(addOnServiceData);
    });
    return tempArr;
  };

  //Do you want also choose one of these
  const chooseAddonService = (value: any) => {
    //staffMainService.splice(2);
    getAllStaffMainService(staffMainService);
    if (addOnServiceIds && addOnServiceIds.length) {
      const addService = chooseAddOnServiceValue(
        addOnServiceIds,
        value.target.value
      );
    }
  };

  //Add On Service Selection
  const addOnService = (addOnService: any) => {
    const tempArr: any[] = addOnServiceValue(addOnService);
    setAddOnServiceData(tempArr);
    if (tempArr.length == 0) {
      setChooseAddOnOne([]);
    }
  };

  //Main Service Selection
  const selectedMainService = (value: any) => {
    staffMainService[0] = value;
    staffMainService.splice(1);
    getAllStaffMainService(staffMainService);
    const mainService = selectedValue(value);
    if (
      mainService[0] &&
      mainService[0].links &&
      Object.values(mainService[0].links).length &&
      mainService[0].links.addOns &&
      mainService[0].links.addOns.length
    ) {
      addOnService(mainService[0].links.addOns);
    } else if (
      mainService[0] &&
      mainService[0].links &&
      !mainService[0].links.addOns.length
    ) {
      addOnService([]);
    }
  };

  // first service category
  const selectedServiceCategory = (e: any) => {
    setSerivceCategoryId(String(e));
    const serviceCategory = e;
    const mainService = selectedCategoryValue(serviceCategory);
    setMainServiceCategory(mainService);
  };

  //Choose the one  addon
  const SelectedFinalAddon = (value: any) => {
    staffMainService[2] = value.target.value;
    if (staffMainService[2] == "") {
      staffMainService.splice(2);
    }
    getAllStaffMainService(staffMainService);
  };

  //update Effect
  useEffect(() => {
    if (view == true) {
      selectedServiceCategory(appointment.categoryId);
      if (appointment.services && appointment.services.length) {
        staffMainService[0] = appointment.services[0];
        selectedMainService(appointment.services[0]);
        let updateAddOnServiceId = updateAddOnService(appointment.services[0]);
        staffMainService[1] = updateAddOnServiceId.id;
        if (appointment.services[1]) {
          let updateChooseAddOnServiceId = updateAddOnService(
            appointment.services[0]
          );
          staffMainService[2] = appointment.services[1];
          let value = {
            target: {
              value: appointment.services[0],
            },
          };
          chooseAddonService(value);
        }
      }
      setchangeStaff({
        name: appointment.resourceName,
        value: appointment.resourceId,
      });
      setchangeCustomer({
        name: appointment.clientName,
        value: appointment.clientId,
      });
      if (appointment.timeStart) {
        let dateRange = moment.utc(appointment.timeStart).format("YYYY-MM-DD");
        setStartDate(new Date(dateRange));
        setValue(appointment.timeStart.substr(11, 5));
      }
    }
    //staffMainService[0]=appointment.services[0]
    //selectedMainService(appointment.services[0])
  }, [appointment]);

  //update  function
  const updateAddOnService = (appointment: any) => {
    const updateAddOnServiceData = _.find(
      serviceDetails,
      (serviceDetails) => serviceDetails.id === appointment
    );
    // staffMainService[1] = updateAddOnServiceData.id;
    // console.log(staffMainService);
    return updateAddOnServiceData;
  };

  //Repeat
  const [weeklyRepeat, setWeeklyRepeat] = useState("");

  // useEffect(()=>{
  // 	repeatAppointments(weeklyRepeat)
  // },[weeklyRepeat])

  function repeatAppointments(value: any) {
    var repeat = weeklyRepeat;
    if (repeat == "") {
      return false;
    }
    var repeatAppointmentsToCreateListF: any[] = [];
    var repeatPromise = Promise.resolve("repeat");
    var repeatArr = getRepeatList(repeat, value);
    // _.forEach(repeatArr, function (val) {
    // 	delete value.timeStart;
    // 	var repeatParams = _.clone(value);
    // 	var createRepeatAppointment = repeatPromise.then(function () {
    // 		repeatParams.timeStart = val;
    // 		return ScheduleService.addAppointment(repeatParams).then(function (res:any) {
    // 			return res;
    // 		});
    // 	});
    // 	repeatAppointmentsToCreateListF.push(createRepeatAppointment);
    // })
  }

  function getRepeatList(repeat: any, value: any) {
    var timeStart = value.timeStart;
    var repeatArrList = [];
    var thisYear = new Date().getFullYear();
    var end = new Date("12/31/" + thisYear);
    var yearEndDate = moment(end.valueOf());
    while (moment(yearEndDate).unix() > moment(timeStart).unix()) {
      timeStart = moment(timeStart).add(repeat, "days");
      if (moment(timeStart).unix() <= moment(yearEndDate).unix()) {
        repeatArrList.push(moment(timeStart).utc().toISOString());
      }
    }
    return repeatArrList;
  }

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading ? (
        <React.Fragment>
          <PageHeader title={title} />
          <Formik
            initialValues={{ ...addSchedule }}
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
                <div className="row">
                  <div className="col-lg-12">
                    <div className="wrapper wrapper-content animated fadeInRight">
                      <div className="ibox float-e-margins">
                        <div className="ibox-content m-b-sm border-bottom">
                          <Form
                            name="scheduleItemEdit"
                            className="form-horizontal"
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
                            <FormGroup>
                              <Col sm="12">
                                <FormLabel className="control-label">
                                  Service Category
                                </FormLabel>
                                <FormControl
                                  as="select"
                                  name="categoryId"
                                  value={serviceCategoryId}
                                  onChange={(e) => {
                                    selectedServiceCategory(e.target.value);
                                    setStaffMainService([]);
                                    addOnService([]);
                                  }}
                                  onBlur={handleBlur}
                                >
                                  <option value="">Category</option>
                                  {categoryDetails &&
                                    categoryDetails.length &&
                                    categoryDetails.map((value: any) => {
                                      return (
                                        <option value={value.id}>
                                          {value.name}
                                        </option>
                                      );
                                    })}
                                </FormControl>
                              </Col>
                            </FormGroup>
                            <FormGroup>
                              <Col sm="12">
                                <FormLabel className="control-label">
                                  Main Service
                                </FormLabel>
                                <SelectSearch
                                  ref={searchInput}
                                  options={serviceOption}
                                  value={
                                    staffMainService &&
                                    staffMainService.length &&
                                    staffMainService[0]
                                  }
                                  name="service"
                                  placeholder="service"
                                  search
                                  onChange={(e) => {
                                    selectedMainService(e);
                                  }}
                                />
                              </Col>
                            </FormGroup>

                            {addOnServiceData && addOnServiceData.length > 0 && (
                              <FormGroup>
                                <div
                                  className="col-lg-12 text-center"
                                  style={{
                                    paddingTop: "17px;",
                                    height: "60px;",
                                  }}
                                ></div>
                                <div className="col-xs-11 col-xs-push-1">
                                  <div style={{ height: "60px;" }}>
                                    <FormLabel className="control-label">
                                      Add On Service
                                    </FormLabel>
                                    <FormControl
                                      as="select"
                                      name="Add On Service"
                                      value={
                                        staffMainService &&
                                        staffMainService.length &&
                                        staffMainService[1]
                                      }
                                      onChange={(e) => {
                                        chooseAddonService(e);
                                        staffMainService[1] = e.target.value;
                                      }}
                                    >
                                      <option value="">
                                        Choose Add On Service
                                      </option>
                                      {addOnServiceData &&
                                        addOnServiceData.length &&
                                        addOnServiceData.map((value: any) => {
                                          return (
                                            <option value={value.id}>
                                              {value.name}
                                            </option>
                                          );
                                        })}
                                    </FormControl>
                                  </div>
                                </div>
                              </FormGroup>
                            )}
                            {chooseAddOnOne && chooseAddOnOne.length > 0 && (
                              <FormGroup>
                                <div
                                  className="col-lg-12 text-center"
                                  style={{
                                    paddingTop: "17px;",
                                    height: "60px;",
                                  }}
                                ></div>
                                <div className="col-xs-10 col-xs-push-2">
                                  <div style={{ height: "60px;" }}>
                                    <FormLabel className="control-label">
                                      Do you want also choose one of these?
                                    </FormLabel>
                                    <FormControl
                                      as="select"
                                      name="Add On Service"
                                      value={
                                        staffMainService &&
                                        staffMainService.length &&
                                        staffMainService[2]
                                      }
                                      onChange={(e) => SelectedFinalAddon(e)}
                                    >
                                      <option value="">
                                        Choose Add On Service
                                      </option>
                                      {chooseAddOnOne &&
                                        chooseAddOnOne.length &&
                                        chooseAddOnOne.map((value: any) => {
                                          return (
                                            <option value={value.id}>
                                              {value.name}
                                            </option>
                                          );
                                        })}
                                    </FormControl>
                                  </div>
                                </div>
                              </FormGroup>
                            )}
                            <FormGroup>
                              <Col sm="12">
                                <FormLabel className="control-label">
                                  Staff
                                </FormLabel>
                                <SelectSearch
                                  ref={searchInput}
                                  options={options}
                                  filterOptions={handleStaffFilter}
                                  value={changeStaff}
                                  name="staff"
                                  placeholder="Staff"
                                  search
                                  onChange={handleChangeStaff}
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup>
                              <Col sm="12">
                                <FormLabel className="control-label">
                                  Client
                                </FormLabel>
                                <SelectSearch
                                  ref={searchInput}
                                  options={customer}
                                  filterOptions={handleCustomerFilter}
                                  value={changeCustomer}
                                  name="Customer"
                                  placeholder="Client"
                                  search
                                  onChange={handleChangeCustomer}
                                />
                              </Col>
                            </FormGroup>
                            <div className="form-group">
                              <div className="col-lg-6">
                                <label className="control-label">
                                  Appointment Time
                                </label>

                                <DatePicker
                                  selected={startDate}
                                  showPopperArrow={false}
                                  style={{
                                    width: "100%",
                                    border: "1px solid white",
                                  }}
                                  onChange={(date: any) => setStartDate(date)}
                                  dateFormat="EEEE, MMMM d, yyyy"
                                />
                              </div>
                              {/* <div className="col-lg-5">
																<label className="control-label">
																	Available TimeSlots{" "}
																	<small> ( Not Available )</small>
																</label>
																<select className="form-control" required>
																	<option value="">Choose TimeSlot</option>
																</select>
															</div> */}
                            </div>
                            <div className="form-group">
                              <div className="col-lg-5">
                                <div className="input-group">
                                  <TimePicker
                                    eachInputDropdown
                                    onChange={(newValue: any) =>
                                      setValue(newValue)
                                    }
                                    value={value}
                                  />
                                </div>
                              </div>
                            </div>
                            <FormGroup>
                              <Col sm="6">
                                <FormLabel className="control-label">
                                  Repeat
                                </FormLabel>
                                <FormControl
                                  as="select"
                                  name="Repeat"
                                  onChange={(e: any) => {
                                    setWeeklyRepeat(e.target.value);
                                  }}
                                >
                                  <option value="">None</option>
                                  <option value="7">Weekly</option>
                                  <option value="28">Every 4 weeks</option>
                                  <option value="35">Every 5 weeks</option>
                                  <option value="42">Every 6 weeks</option>
                                </FormControl>
                              </Col>
                            </FormGroup>
                            <FormGroup>
                              <Col sm="6">
                                <FormLabel className="control-label">
                                  Repeat
                                </FormLabel>
                              </Col>
                            </FormGroup>
                            <FormGroup>
                              <Col lg="12">
                                <Button
                                  className="btn btn-white"
                                  style={{
                                    backgroundColor: "white",
                                    color: "black",
                                  }}
                                  type="button"
                                  onClick={() => {
                                    history.push("/schedule");
                                  }}
                                >
                                  Cancel
                                </Button>
                                &nbsp;
                                <Button
                                  variant="primary"
                                  type="submit"
                                  disabled={
                                    !(
                                      staffMainService &&
                                      staffMainService.length &&
                                      changeStaff.name &&
                                      changeStaff.name.length &&
                                      changeCustomer.name &&
                                      changeCustomer.name.length
                                    )
                                  }
                                >
                                  Save Changes
                                  {UI.buttonLoading && (
                                    <i className="fa fa-spinner fa-spin"></i>
                                  )}
                                </Button>
                              </Col>
                            </FormGroup>
                          </Form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </Formik>
        </React.Fragment>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

const mapActionsToProps = {
  getAllCategory,
  getAllService,
  getAllStaff,
  getAllStylist,
  searchClients,
  staffService,
  addAppointments,
  getAppointment,
  getAppointmentOrder,
};

export default connect(null, mapActionsToProps)(AddSchedule);
