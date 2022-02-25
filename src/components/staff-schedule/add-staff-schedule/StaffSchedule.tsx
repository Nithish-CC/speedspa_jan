import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { sorting, buildFilter } from "../../../utils/common";
import { getAllStaff } from "../../../redux/actions/staffActions";
import { addSchedule } from "../../../redux/actions/scheduleActions";
import _ from "lodash";
import moment from "moment";
import PageHeader from "../../core/PageHeader";
import { ToastContainer, toast } from "react-toastify";
import GppMaybeRoundedIcon from "@mui/icons-material/GppMaybeRounded";
import { Formik } from "formik";
import { Prompt } from "react-router";
import {
  Form,
  Col,
  Row,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
} from "react-bootstrap";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import TimePicker from "react-time-picker-input";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const StaffSchedule = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const Title = {
    title: "New Staff Schedule",
  };
  const history = useHistory();
  const user = useSelector((state: any) => state.user);
  const [validationShape, setValidationShape] = useState({});
  const UI = useSelector((state: any) => state.UI);
  const staff = user.allStaffDropdown;
  const view = window.location.href.includes("view");
  const urlParams = useParams();
  const [todaysDate, setTodaysDate] = useState(new Date());
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const id = urlParams.id;
  const bussinessId = localStorage.getItem("businessId");
  const staffSchedule = {
    businessId: bussinessId,
    frequency: [],
    period: "",
    repeatingEndDate: "",
    repeatingEndTime: "",
    repeatingStartDate: "",
    repeatingStartTime: "",
    resourceId: "",
  };
  const [occuranceValues, setOccuranceValues] = useState({
    montly: false,
    weekly: true,
    daily: false,
  });
  const [monthlyDates, setMontlyDates] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [repeat, setRepeat] = useState("weekly");
  const [frequency, setFrequency] = useState<any[]>([]);

  //useEffect
  let verifyDateTime =
    moment(startDate).format("YYYY-MM-DD") >
    moment(endDate).format("YYYY-MM-DD")
      ? false
      : true;

  //intial call
  useEffect(() => {
    getAllStaff();
  }, []);

  const getAllStaff = () => {
    var requestRoles = ["admin", "support", "stylist"];
    var data: any = {
      filter: {
        roles: {
          $in: requestRoles,
        },
      },
    };
    data.filter.status = {
      $in: ["active", "inactive"],
    };
    var query = buildFilter(data);
    query.text = "";
    query.businessId = localStorage.businessId;
    props.getAllStaff(query);
  };

  const handleSubmit = (values: any) => {
    setOnSubmit(true);
    if (
      verifyDateTime &&
      values.resourceId != "" &&
      frequency &&
      frequency.length > 0
    ) {
      staffSchedule.resourceId = values.resourceId;
      staffSchedule.frequency = frequency.sort();
      staffSchedule.period = repeat;
      staffSchedule.repeatingEndDate = moment(endDate).format("YYYY-MM-DD");
      staffSchedule.repeatingStartDate = moment(startDate).format("YYYY-MM-DD");
      staffSchedule.repeatingEndTime = moment(endTime, "hh:mm").format("LT");
      staffSchedule.repeatingStartTime = moment(startTime, "hh:mm").format(
        "LT"
      );

      props.addSchedule(staffSchedule, (success: any, data: any) => {
        if (success && timeError) {
          setFormChanged(false);          
          history.push("/staff-schedule");
        } else {
          notify(data);
        }
      });
    }
  };

  const notify = (data: any) => {
    toast.error(
      <div>
        <strong> Status: Error </strong>{" "}
        <p>Something went wrong. Please come back later</p>
      </div>,
      {
        theme: "colored",
        icon: () => <GppMaybeRoundedIcon fontSize="large" />,
      }
    );
    toast.error(<div>{data}</div>, {
      theme: "colored",
      icon: () => <GppMaybeRoundedIcon fontSize="large" />,
    });
  };

  //To Find The Occurence
  const findOccurence = (e: any) => {
    setRepeat(e);
    if (e == "monthly") {
      monthDates();
      setFrequency([]);
      setOccuranceValues({ montly: true, weekly: false, daily: false });
    } else if (e == "weekly") {
      setFrequency([]);
      setOccuranceValues({ montly: false, weekly: true, daily: false });
    } else if (e == "daily") {
      setFrequency([]);
      setOccuranceValues({ montly: false, weekly: false, daily: true });
    }
  };

  const [formChanged, setFormChanged] = useState(false);

  const myForm = document.getElementById("StaffSchedule");

  const onChangeHandler = () => {
    if (myForm) {
      myForm.addEventListener("change", () => setFormChanged(true));
    }
    window.addEventListener("beforeunload", (event) => {
      if (formChanged) {
        event.returnValue = "You have unfinished changes!";
      }
    });
  };

  //Number of Dates 1 to 31
  const monthDates = () => {
    let tempArr: any[] = [];
    for (let i = 1; i <= 31; i++) {
      tempArr.push(i);
    }
    setMontlyDates(tempArr);
  };

  //weekly repeat
  const weeklyRepeat = (e: any) => {
    if (e.target.checked) {
      setFrequency([...frequency, Number(e.target.value)]);
    } else if (e.target.checked == false) {
      let indexVal = frequency.indexOf(Number(e.target.value));
      frequency.splice(indexVal, 1);
    }
  };

  //Monthly repeat
  const monthlyRepeat = (e: any) => {
    if (e.target.checked) {
      setFrequency([...frequency, Number(e.target.value)]);
    } else if (e.target.checked == false) {
      let indexVal = frequency.indexOf(Number(e.target.value));
      frequency.splice(indexVal, 1);
    }
  };

  //Daily Repeat
  const dailyRepeat = (e: any) => {
    setFrequency([Number(e.target.value)]);
  };
  const [timeError, setTimeError] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  useEffect(() => {
    if (endTime > startTime) {
      setTimeError(true);
    } else {
      setTimeError(false);
    }
  }, [endTime, startTime]);

  return (
    <React.Fragment>
      <Prompt
        when={formChanged}
        message="Are you sure you want to leave the page?"
      />
      {user.authenticated && !UI.loading ? (
        <React.Fragment>
          <PageHeader {...Title} />
          {UI.errors && (
            <div className="row">
              <div className="col-sm-12">
                <div className="alert alert-danger" role="alert">
                  {"Can not save your data."} {UI.errors.message}
                </div>
              </div>
            </div>
          )}
          {timeError === false && onSubmit && (
            <div className="row">
              <div className="col-sm-12">
                <div className="alert alert-danger" role="alert">
                  {"Please check data you input."}
                </div>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <div className="ibox float-e-margins">
                  <div className="ibox-content">
                    <Formik
                      initialValues={{ ...staffSchedule }}
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
                        isSubmitting,
                      }) => {
                        return (
                          <Form
                            name="Staff"
                            className="form-horizontal"
                            id="StaffSchedule"
                            onChange={onChangeHandler}
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                          >
                            <React.Fragment>
                              <FormGroup>
                                <Col sm="6">
                                  <FormLabel className="control-label">
                                    Staff
                                  </FormLabel>
                                  <FormControl
                                    as="select"
                                    name="resourceId"
                                    value={values.resourceId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={
                                      values.resourceId &&
                                      values.resourceId.length
                                        ? {}
                                        : { border: "1px solid #ed5565" }
                                    }
                                  >                                    
                                    <option value="">-- Select Staff --</option>
                                    <optgroup label="Staff">
                                      {_.orderBy(
                                        staff,
                                        [(user) => user.lastName.toUpperCase()],
                                        ["asc"]
                                      ).map((staff: any) => {
                                        return (
                                          <React.Fragment>
                                            {staff.roles.includes(
                                              "stylist"
                                            ) && (
                                              <option
                                                value={staff.id}
                                                className="text-capitalize"
                                              >
                                                {staff.name}
                                              </option>
                                            )}
                                          </React.Fragment>
                                        );
                                      })}
                                    </optgroup>
                                    <optgroup label="Admin/Support">
                                      {_.orderBy(
                                        staff,
                                        [(user) => user.lastName.toUpperCase()],
                                        ["asc"]
                                      ).map((staff: any) => {
                                        return (
                                          <React.Fragment>
                                            {!staff.roles.includes(
                                              "stylist"
                                            ) && (
                                              <option
                                                value={staff.id}
                                                className="text-capitalize"
                                              >
                                                {staff.name}
                                              </option>
                                            )}
                                          </React.Fragment>
                                        );
                                      })}
                                    </optgroup>
                                  </FormControl>
                                </Col>
                              </FormGroup>
                              <FormGroup>
                                <Col sm="6">
                                  <FormLabel className="control-label">
                                    Occurence{" "}
                                    <Tippy
                                      theme={"success"}
                                      placement="right"
                                      content={
                                        <div>
                                          <p>
                                            If you want this schedule to repeat
                                            weekly, choose “weekly” and select
                                            which days it will be on. If Daily
                                            then you want it to repeat a certain
                                            number of days.
                                          </p>
                                          <p>
                                            <b>1</b> if every day.
                                          </p>
                                          <p>
                                            <b>2</b> if every other day and so
                                            on.
                                          </p>
                                        </div>
                                      }
                                    >
                                      <i className="fa fa-question-circle"></i>
                                    </Tippy>
                                  </FormLabel>
                                  <FormControl
                                    as="select"
                                    name="period"
                                    value={repeat}
                                    onChange={(e) =>
                                      findOccurence(e.target.value)
                                    }
                                    onBlur={handleBlur}
                                  >
                                    <option value="monthly">Monthly</option>
                                    <option value="weekly" selected>
                                      Weekly
                                    </option>
                                    <option value="daily">Daily</option>
                                  </FormControl>
                                </Col>
                              </FormGroup>
                              {occuranceValues.montly && (
                                <FormGroup>
                                  <Col lg="12">
                                    <FormLabel className="control-label">
                                      Repeats on:
                                    </FormLabel>
                                    <br />
                                    {monthlyDates &&
                                      monthlyDates.length &&
                                      monthlyDates.map((date: any) => {
                                        return (
                                          <React.Fragment>
                                            <span
                                              style={{
                                                display: "inline-block",
                                                width: "50px",
                                                padding: "10px 5px 5px 0px",
                                              }}
                                            >
                                              <input
                                                type="checkbox"
                                                name="repeats"
                                                value={date}
                                                style={{
                                                  marginTop: "0",
                                                  verticalAlign: " middle",
                                                }}
                                                onClick={(e) => {
                                                  monthlyRepeat(e);
                                                }}
                                              />{" "}
                                              <strong>{date}</strong>
                                            </span>
                                            {date % 7 == 0 && <br />}
                                          </React.Fragment>
                                        );
                                      })}
                                  </Col>
                                </FormGroup>
                              )}
                              {occuranceValues.weekly && (
                                <FormGroup>
                                  <Col sm="6">
                                    <FormLabel className="control-label">
                                      Repeats on:&emsp;
                                    </FormLabel>
                                    <br />
                                    <span>
                                      <input
                                        type="checkbox"
                                        name="repeats"
                                        value="1"
                                        onClick={(e) => {
                                          weeklyRepeat(e);
                                        }}
                                      />
                                      &nbsp;<strong>Sun</strong>
                                    </span>
                                    &emsp;
                                    <span>
                                      <input
                                        type="checkbox"
                                        name="repeats"
                                        value="2"
                                        onClick={(e) => {
                                          weeklyRepeat(e);
                                        }}
                                      />
                                      &nbsp;<strong>Mon</strong>
                                    </span>
                                    &emsp;
                                    <span>
                                      <input
                                        type="checkbox"
                                        name="repeats"
                                        value="3"
                                        onClick={(e) => {
                                          weeklyRepeat(e);
                                        }}
                                      />
                                      &nbsp;<strong>Tue</strong>
                                    </span>
                                    &emsp;
                                    <span>
                                      <input
                                        type="checkbox"
                                        name="repeats"
                                        value="4"
                                        onClick={(e) => {
                                          weeklyRepeat(e);
                                        }}
                                      />
                                      &nbsp;<strong>Wed</strong>
                                    </span>
                                    &emsp;
                                    <span>
                                      <input
                                        type="checkbox"
                                        name="repeats"
                                        value="5"
                                        onClick={(e) => {
                                          weeklyRepeat(e);
                                        }}
                                      />
                                      &nbsp;<strong>Thu</strong>
                                    </span>
                                    &emsp;
                                    <span>
                                      <input
                                        type="checkbox"
                                        name="repeats"
                                        value="6"
                                        onClick={(e) => {
                                          weeklyRepeat(e);
                                        }}
                                      />
                                      &nbsp;<strong>Fri</strong>
                                    </span>
                                    &emsp;
                                    <span>
                                      <input
                                        type="checkbox"
                                        name="repeats"
                                        value="7"
                                        onClick={(e) => {
                                          weeklyRepeat(e);
                                        }}
                                      />
                                      &nbsp;<strong>Sat</strong>
                                    </span>
                                    &emsp;
                                  </Col>
                                </FormGroup>
                              )}
                              {occuranceValues.daily && (
                                <FormGroup>
                                  <Col sm="3">
                                    <FormLabel className="control-label">
                                      Repeats every:&emsp;
                                    </FormLabel>
                                    <FormControl
                                      as="select"
                                      name="occurancedate"
                                      onChange={(e) => {
                                        dailyRepeat(e);
                                      }}
                                    >
                                      {monthlyDates &&
                                        monthlyDates.length &&
                                        monthlyDates.map((date: any) => {
                                          return (
                                            <option value={date}>{date}</option>
                                          );
                                        })}
                                    </FormControl>
                                  </Col>
                                </FormGroup>
                              )}
                              <FormGroup>
                                <Col sm="3">
                                  <FormLabel className="control-label">
                                    Start Date
                                  </FormLabel>
                                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                      className="form-control"
                                      value={startDate}
                                      onChange={(e: any) => {
                                        setStartDate(e);
                                      }}
                                      style={{
                                        border: "1px solid #e5e6e7",
                                      }}
                                      format="EEEE, MMMM d, yyyy"
                                      minDate={todaysDate}
                                      showTodayButton={true}
                                      keyboardIcon={
                                        <i className="glyphicon glyphicon-calendar"></i>
                                      }
                                    />
                                  </MuiPickersUtilsProvider>
                                </Col>
                                <Col sm="3">
                                  <FormLabel className="control-label">
                                    End Date
                                  </FormLabel>
                                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                      className="form-control"
                                      value={endDate}
                                      onChange={(e: any, date: any) => {
                                        setEndDate(date);
                                      }}
                                      style={{
                                        border: "1px solid #e5e6e7",
                                      }}
                                      helperText={null}
                                      format="EEEE, MMMM d, yyyy"
                                      showTodayButton={true}
                                      keyboardIcon={
                                        <i className="glyphicon glyphicon-calendar"></i>
                                      }
                                    />
                                  </MuiPickersUtilsProvider>
                                </Col>
                              </FormGroup>
                              <FormGroup>
                                <div className="col-lg-2">
                                  <label className="control-label">
                                    Start Time{" "}
                                    <Tippy
                                      theme={"success"}
                                      placement="top"
                                      maxWidth="225px"
                                      content={
                                        <div>
                                          <p>
                                            Remember it is in Military Time and
                                            start with the end date.
                                          </p>
                                        </div>
                                      }
                                    >
                                      <i className="fa fa-question-circle"></i>
                                    </Tippy>
                                  </label>
                                  <TimePicker
                                    eachInputDropdown
                                    onChange={(newValue: any) =>
                                      setStartTime(newValue)
                                    }
                                    value={startTime}
                                  />
                                </div>
                                <div className="col-lg-2">
                                  <label className="control-label">
                                    End Time{" "}
                                    <Tippy
                                      theme={"success"}
                                      placement="top"
                                      maxWidth="225px"
                                      content={
                                        <div>
                                          <p>
                                            Remember it is in Military Time and
                                            start with the end date.
                                          </p>
                                        </div>
                                      }
                                    >
                                      <i className="fa fa-question-circle"></i>
                                    </Tippy>
                                  </label>
                                  <div
                                    hour-step="1"
                                    minute-step="10"
                                    show-meridian="ismeridian"
                                  >
                                    <TimePicker
                                      eachInputDropdown
                                      onChange={(newValue: any) =>
                                        setEndTime(newValue)
                                      }
                                      value={endTime}
                                    />
                                  </div>
                                </div>
                              </FormGroup>                              
                              <div className="hr-line-dashed" />
                              <Row>
                                <Col md="8">
                                  <FormGroup>
                                    <Col sm="8">
                                      <Button
                                        variant="white"
                                        type="button"
                                        onClick={() => {
                                          history.push("/staff-schedule");
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      &nbsp;
                                      <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={
                                          values.resourceId.length == 0 ||
                                          !verifyDateTime
                                        }
                                      >
                                        Save Changes
                                        {UI.buttonLoading && (
                                          <i className="fa fa-spinner fa-spin"></i>
                                        )}
                                      </Button>
                                      <ToastContainer
                                        position="bottom-right"
                                        autoClose={5000}
                                        hideProgressBar={true}
                                        newestOnTop={true}
                                        closeOnClick
                                        rtl={false}
                                        toastStyle={{
                                          backgroundColor: "#ED5565",
                                          color: "#fff",
                                          fontSize: "13px",
                                        }}
                                        closeButton={false}
                                        pauseOnFocusLoss
                                        draggable
                                        pauseOnHover
                                      />
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>
                            </React.Fragment>
                          </Form>
                        );
                      }}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapActionsToProps = {
  getAllStaff,
  addSchedule,
};

export default connect(null, mapActionsToProps)(StaffSchedule);