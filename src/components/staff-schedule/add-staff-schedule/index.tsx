import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Calendar } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import PageHeader from "../../core/PageHeader";
import DeleteModal from "../../core/DeleteModal";
import { sorting, buildFilter } from "../../../utils/common";
import { getAllStaff } from "../../../redux/actions/staffActions";
import {
  schedule,
  updateSchedule,
  deleteSchedule,
} from "../../../redux/actions/scheduleActions";
import { getRootServiceCategory } from "../../../redux/actions/serviceActions";
import { AnyObject } from "yup/lib/types";
import Tooltips from "../../core/Tooltips";
import TimePicker from "react-time-picker-input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Form,
  Col,
  Row,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  Accordion,
  Card,
  Button,
} from "react-bootstrap";

const ScheduleStaff = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [loading, setLoading] = useState(false);
  const UI = useSelector((state: any) => state.UI);
  const businessId = localStorage.getItem("businessId");
  const resourceId = localStorage.getItem("userId");
  const hostName = localStorage.getItem("businessUrl");
  const user = useSelector((state: any) => state.user);
  const [title, setTitle] = useState("Staff Schedule");
  const [calenderData, setCalenderData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    show: false,
  });
  const [toggle, setToggle] = useState({
    stylist: false,
    support: true,
  });
  const [initialTooltip] = useState({ ...calenderData });
  const [modalPopup, setModalPopup] = useState({
    deleteModal: false,
    id: 1,
    name: "",
    startDate: "",
    endDate: "",
  });
  const [initialModalPopup] = useState({ ...modalPopup });
  const allCategories = useSelector(
    (state: any) => state.service.categoryDetails
  );
  const allStaff = user.allStaff;
  const [date, setDate] = useState("");
  const schedule = useSelector((state: any) => state.schedule);
  const scheduleData = schedule.schedules;
  const [updateLoader, setUpdateLoader] = useState(false);
  const [reSchedule, setReSchedule] = useState(false);
  const [resourseDataVal, setResourseDataVal] = useState<any[]>([]);
  const [params, setParams] = useState({
    text: "",
    status: "",
    role: "all",
  });
  const [startValue, setStartValue] = useState("10:00");
  const [endValue, setEndValue] = useState("10:00");
  const [staff, setStaff] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [appointmentId, setAppointmentId] = useState("");
  const [deleteData, setDeleteData] = useState({});
  const [calenderDates, setCalenderDates] = useState<any[]>([]);
  const [staffSelected, setStaffSelected] = useState("all");
  const [buttons] = useState([
    {
      title: "Add New Staff Schedule",
      url: "/staff-schedule/add-staff-schedule",
    },
  ]);

  //To fetch date on load
  let dates = {
    loaded: {
      start: new Date(moment().startOf("month").subtract(1, "milliseconds")),
      end: new Date(moment().endOf("month").add(1, "milliseconds")),
    },
    toload: {
      start: new Date(moment().startOf("month").subtract(1, "milliseconds")),
      end: new Date(moment().endOf("month").add(1, "milliseconds")),
    },
  };

  useEffect(() => {
    let paramsPass = {
      businessId: businessId,
    };
    getAllStaff(params);
    if (UI.errors) {
      setErrors(UI.errors);
    }
    props.getRootServiceCategory(paramsPass);
    // 	eventsLoad();
    // 	businessDetails();
    // 	props.getAllService(paramsPass);
    // 	props.getAllCategory(paramsPass);
  }, []);

  useEffect(() => {
    schedules();
  }, [date]);

  const schedules = () => {
    let start = date;
    let end = moment(date).endOf("month").toISOString();
    var data: any = {
      timeStart: {
        $lte: end,
        $gt: start,
      },
    };
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.schedule(query);
  };

  const businessDetails = () => {
    let params = {
      name: hostName,
      businessId: businessId,
    };
    props.getUserBusinessDetails(params);
  };

  const getAllStaff = (params: any) => {
    var requestRoles = ["admin", "support", "stylist"];
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

  useEffect(() => {
    allStaffDetail();
  }, [allStaff]);

  const allStaffDetail = () => {
    if (allStaff && allStaff.length) {
      allStaff.forEach((value: any, index: any) => {
        getRole(value, index);
      });
    }
  };

  const getRole = (value: any, index: any) => {
    var roleName = [];
    if (value.roles) {
      if (
        _.findIndex(value.roles, function (role) {
          return role != "stylist";
        }) + 1
      ) {
        roleName.push("admin");
        value.building = "admin";
        if (value.displayName) 
        value.title = value.displayName;
        else
        value.title = value.firstName[0]+" "+value.lastName[0];
        value.eventColor = value.color;
      }
      if (
        _.findIndex(value.roles, function (role) {
          return role == "stylist";
        }) + 1
      ) {
        if (value.profileCategoryId) {
          if (
            _.isArray(value.profileCategoryId) &&
            value.profileCategoryId.length
          ) {
            _.each(value.profileCategoryId, function (profCatId) {
              var cate = _.find(allCategories, {
                id: profCatId,
              });
              if (cate)
                cate.description
                  ? roleName.push(cate.description)
                  : roleName.push(cate.name + " Stylist");
              value.building = "Stylist";
              value.title = value.displayName;
              value.eventColor = value.color;
            });
          } else {
            var cat = _.find(allCategories, {
              id: value.profileCategoryId,
            });
            if (cat.id)
              cat.description
                ? roleName.push(cat.description)
                : roleName.push(cat.name + " Stylist");
            value.building = "Stylist";
            value.title = value.displayName;
            value.eventColor = value.color;
          }
        }
      }
    }
    let uniques = Array.from(new Set(roleName));
    if (uniques.length) {
      value.uniques = uniques.join(", ");
    } else {
      value.uniques = "No Roles";
    }
    setResourseDataVal((resourseDataVal: any) => [...resourseDataVal, value]);
  };

  const eventsLoad = () => {
    var intervalEnd = new Date();
    intervalEnd.setTime(
      intervalEnd.getTime() + intervalEnd.getTimezoneOffset() * 60 * 1000
    );
    intervalEnd = new Date(
      moment(intervalEnd).startOf("day").subtract(1, "milliseconds")
    );
    var intervalStart = new Date();
    intervalStart.setTime(
      intervalStart.getTime() + intervalStart.getTimezoneOffset() * 60 * 1000
    );

    if (dates.loaded.end >= intervalStart) {
      dates.toload.start = new Date(
        moment(intervalEnd).startOf("month").subtract(1, "milliseconds")
      );
      dates.toload.end = new Date(
        moment(intervalEnd).endOf("month").add(1, "milliseconds")
      );
      dates.loaded.end = new Date(
        moment(intervalEnd).endOf("month").add(1, "milliseconds")
      );
      timeSlots(dates.toload.start, dates.toload.end);
    }
    if (intervalStart <= dates.loaded.start) {
      dates.toload.start = new Date(
        moment(dates.loaded.start).startOf("month").subtract(1, "milliseconds")
      );
      dates.toload.end = new Date(
        moment(dates.loaded.start).endOf("month").add(1, "milliseconds")
      );
      dates.loaded.start = new Date(
        moment(dates.loaded.start).startOf("month").subtract(1, "milliseconds")
      );
      timeSlots(dates.toload.start, dates.toload.end);
    }
  };

  useEffect(() => {
    if (scheduleData && scheduleData.length) {
      calendarData();
    }
  }, [scheduleData]);

  const deletePopup = (appointment: any) => {
    setModalPopup({
      deleteModal: !modalPopup.deleteModal,
      id: appointment.id,
      name: appointment.title,
      startDate: moment
        .parseZone(appointment.startStr)
        .utc()
        .format("MMMM Do YYYY, h:mm:ss a"),
      endDate: moment
        .parseZone(appointment.endStr)
        .utc()
        .format("MMMM Do YYYY, h:mm:ss a"),
    });
  };

  const closeModal = () => {
    setModalPopup(initialModalPopup);
  };

  const handleDelete = () => {
    let params = {
      businessId: localStorage.getItem("businessId"),
    };
    props.deleteSchedule(modalPopup.id, params);
    closeModal();
    schedules();
    setReSchedule(false);
  };

  useEffect(() => {
    if (scheduleData && scheduleData.length) {
      calendarData();
    }
  }, [staffSelected]);

  const calendarData = () => {
    setReSchedule(false);
    const tempArr: any[] = [];
    const selectedStaff = _.filter(
      scheduleData,
      (scheduleData) => scheduleData.resourceId === staffSelected
    );

    let calenderSort: any[] = [];
    if (staffSelected == "all") {
      calenderSort = scheduleData;
    } else {
      calenderSort = selectedStaff;
    }
    calenderSort.forEach((values: any, key: any) => {
      if (resourseDataVal && resourseDataVal.length) {
        const title = _.filter(
          resourseDataVal,
          (resourseDataVal) => resourseDataVal.id === values.resourceId
        );
        values.title = title[0].name;
        values.backgroundColor = title[0].eventColor;
        values.eventColor = title[0].eventColor;
        values.description = "description" + key;
        values.start = values.timeStart;
        values.end = values.timeEnd;
        values.startDate = values.timeStart;
        values.startTime = values.timeStart;
        values.endTime = values.timeEnd;
        values.allDay = false;
        tempArr.push(values);
      }
      //     resourceId: timeslot.resourceId,
      //     resource: resource ? (resource.firstName + ' ' + resource.lastName) : 'Deleted Staff',
      //     startDate: setDateTimeToShow(timeslot.timeStart),
      //     startDate: setDateTimeToShow(timeslot.timeStart),
      //     endTime: setDateTimeToShow(timeslot.timeEnd),
    });
    setCalenderDates(tempArr);
  };

  const updateTooltip = (info: any) => {
    setCalenderData({
      title: info.event.title,
      startTime: moment(info.event.startStr.substr(11, 5), "hh:mm").format(
        "hh:mm a"
      ),
      endTime: moment(info.event.endStr.substr(11, 5), "hh:mm").format(
        "hh:mm a"
      ),
      show: true,
    });
  };

  const handleMouseEnter = (info: AnyObject) => {
    updateTooltip(info);
  };

  const handleMouseClick = (info: AnyObject) => {
    setReSchedule(true);
    setStartValue(info.event.startStr.substr(11, 5));
    setEndValue(info.event.endStr.substr(11, 5));
    const mainService = _.filter(
      allStaff,
      (serviceDetails: any) => serviceDetails.name === info.event.title
    );
    setStaff(mainService[0].id);
    setStartDate(info.event.start);
    setAppointmentId(info.event.id);
    setDeleteData(info.event);
  };

  const handleMouseLeave = (info: AnyObject) => {
    setCalenderData(initialTooltip);
  };

  const loaderr = () => {
    setUpdateLoader(true);
  };
  const handleUpdate = () => {
    loaderr();
    let setDate = startDate.toISOString().split("T")[0];
    let mStartDate = moment(`${setDate} ${startValue}`, "YYYY-MM-DD HH:mm");
    let setStartDateTime = moment.parseZone(mStartDate).utc().format();
    let mEndDate = moment(`${setDate} ${endValue}`, "YYYY-MM-DD HH:mm");
    let setEndDateTime = moment.parseZone(mEndDate).utc().format();
    let params = {
      businessId: localStorage.businessId,
      id: appointmentId,
      resourceId: staff,
      timeEnd: setEndDateTime,
      timeStart: setStartDateTime,
    };
    props.updateSchedule(appointmentId, params);
    schedules();
  };

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading ? (
        <div>
          <PageHeader title={title} buttons={buttons} />
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight">
                {reSchedule && (
                  <div className="row">
                    <div className="col-md-12 col-md-push-0">
                      <div className="ibox float-e-margins">
                        <div id="edit-event"></div>
                        <div className="ibox-title">
                          <h5>Event Details</h5>
                          <div className="ibox-tools">
                            <a className="collapse-link">
                              <i className="fa fa-chevron-up"></i>
                            </a>
                          </div>
                        </div>
                        <div className="ibox-content m-b-sm border-bottom">
                          <Form className="form-horizontal">
                            <FormGroup>
                              <Col lg="12">
                                <FormLabel className="control-label">
                                  Staff Members
                                </FormLabel>
                                <FormControl
                                  as="select"
                                  name="eventStaff"
                                  value={staff}
                                  onChange={(e: any) =>
                                    setStaff(e.target.value)
                                  }
                                >
                                  {allStaff &&
                                    allStaff.length &&
                                    allStaff.map((category: any) => {
                                      return (
                                        <option value={category.id}>
                                          {category.name}
                                        </option>
                                      );
                                    })}
                                </FormControl>
                              </Col>
                            </FormGroup>
                            <div className="form-group">
                              <div className="col-lg-12">
                                <label className="control-label">Day</label>
                                <DatePicker
                                  selected={startDate}
                                  showPopperArrow={false}
                                  style={{
                                    width: "100%",
                                    border: "1px solid white",
                                  }}
                                  onChange={(date: any) => setStartDate(date)}
                                  dateFormat="EEE MMMM d, yyyy"
                                />
                              </div>
                            </div>
                            <FormGroup>
                              <div className="col-lg-2">
                                <FormLabel className="control-label">
                                  Start Time
                                </FormLabel>
                                <FormGroup>
                                  <div className="col-lg-5">
                                    <TimePicker
                                      onChange={(newValue: any) =>
                                        setStartValue(newValue)
                                      }
                                      value={startValue}
                                    />
                                  </div>
                                </FormGroup>
                              </div>
                              <div className="col-lg-2">
                                <FormLabel className="control-label">
                                  End Time
                                </FormLabel>
                                <FormGroup>
                                  <div className="col-lg-5">
                                    <div className="input-group">
                                      <TimePicker
                                        eachInputDropdown
                                        onChange={(newValue: any) =>
                                          setEndValue(newValue)
                                        }
                                        value={endValue}
                                      />
                                    </div>
                                  </div>
                                </FormGroup>
                              </div>
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
                                  onClick={() => setReSchedule(false)}
                                >
                                  Cancel
                                </Button>
                                &nbsp;
                                <Button
                                  className="btn btn-danger"
                                  type="button"
                                  onClick={() => {
                                    deletePopup(deleteData);
                                  }}
                                >
                                  Delete
                                </Button>
                                &nbsp;
                                <Button
                                  className="btn btn-primary"
                                  type="button"
                                  onClick={() => {
                                    setUpdateLoader(true);
                                    handleUpdate();
                                  }}
                                >
                                  Save Changes
                                  {updateLoader && (
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
                )}
                <div className="row">
                  <div className="col-md-9 col-md-push-3">
                    <div className="ibox-content m-b-sm border-bottom">
                      <div
                        className="text-center p-lg"
                        id="ScheduleCalendarWrapper"
                        style={{ padding: "10px" }}
                      >
                        <FullCalendar
                          plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            resourceTimeGridPlugin,
                            listPlugin,
                            interactionPlugin,
                            resourceTimelinePlugin,
                          ]}
                          datesSet={(paypload) => {
                            setDate(
                              moment(paypload.view.currentStart)
                                .startOf("month")
                                .toISOString()
                            );
                          }}
                          timeZone="UTC"
                          initialView="listDay"
                          schedulerLicenseKey="0116820732-fcs-1622120977"
                          resourceGroupField="building"
                          resources={resourseDataVal}
                          height={500}
                          editable={false}
                          scrollTime="08:00:00"
                          buttonText={{
                            today: "Today",
                            month: "Month",
                            week: "Week",
                            day: "Day",
                            list: "List",
                          }}
                          headerToolbar={{
                            left: "today,prev,next",
                            center: "title",
                            right:
                              "dayGridMonth,timeGridWeek,resourceTimeGridDay,listDay",
                          }}
                          views={{
                            resourceTimeGridDay: {
                              titleFormat: {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                weekday: "short",
                              },
                            },
                            listDay: {
                              titleFormat: {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                weekday: "short",
                              },
                            },
                          }}
                          eventDisplay="block"
                          eventMouseEnter={handleMouseEnter}
                          eventMouseLeave={handleMouseLeave}
                          eventClick={handleMouseClick}
                          events={
                            calenderDates && calenderDates.length
                              ? calenderDates
                              : []
                          }
                        />
                        <Tooltips
                          title={calenderData.title}
                          startTime={calenderData.startTime}
                          endTime={calenderData.endTime}
                          show={calenderData.show}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-3 col-md-pull-9"
                    ng-if="vm.staff.length > 1"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        <Button
                          className="btn btn-white m-t-xs m-b-xs"
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            width: "100%",
                            maxWidth: "400px",
                          }}
                          onClick={(e: any) => setStaffSelected("all")}
                        >
                          Show ALL{" "}
                          {loading && <i className="fa fa-spinner fa-spin"></i>}
                        </Button>
                      </div>
                    </div>
                    <Accordion defaultActiveKey="0">
                      <div className="ibox float-e-margins">
                        <div className="ibox-title">
                          <h5>Staff Members</h5>
                          <div className="ibox-tools">
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle
                                  onClick={() => {
                                    if (toggle.stylist == false)
                                      setToggle({
                                        stylist: true,
                                        support: toggle.support,
                                      });
                                    else
                                      setToggle({
                                        stylist: false,
                                        support: toggle.support,
                                      });
                                  }}
                                  style={{
                                    background: "transparent",
                                    color: "#c4c4c4",
                                    border: "#c4c4c4",
                                  }}
                                  eventKey="0"
                                >
                                  {toggle.stylist ? (
                                    <i className="fa fa-chevron-down" />
                                  ) : (
                                    <i className="fa fa-chevron-up" />
                                  )}
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="0">
                                <div
                                  className="ibox-content m-b-sm border-bottom"
                                  style={{
                                    maxHeight: "525px",
                                    overflow: "scroll",
                                  }}
                                >
                                  {allStaff &&
                                    allStaff.length &&
                                    allStaff.map((values: any, index: any) => {
                                      return (
                                        values.roles.includes("stylist") && (
                                          <Button
                                            className="btn m-t-xs m-b-xs "
                                            style={{
                                              width: "100%",
                                              maxWidth: "400px",
                                              backgroundColor: `${values.color}`,
                                              borderColor: `${values.color}`,
                                            }}
                                            onClick={(e: any) =>
                                              setStaffSelected(e.target.value)
                                            }
                                            value={values.id}
                                          >
                                            {/* {getRole(values,index)} */}
                                            {values.name}
                                          </Button>
                                        )
                                      );
                                    })}
                                </div>
                              </Accordion.Collapse>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </Accordion>

                    <Accordion>
                      <div className="ibox float-e-margins">
                        <div className="ibox-title">
                          <h5>Admin/Support Members</h5>
                          <div className="ibox-tools">
                            <Card>
                              <Card.Header>
                                <Accordion.Toggle
                                  onClick={() => {
                                    if (toggle.support == false)
                                      setToggle({
                                        stylist: toggle.stylist,
                                        support: true,
                                      });
                                    else
                                      setToggle({
                                        stylist: toggle.stylist,
                                        support: false,
                                      });
                                  }}
                                  style={{
                                    background: "transparent",
                                    color: "#c4c4c4",
                                    border: "#c4c4c4",
                                  }}
                                  eventKey="1"
                                >
                                  {toggle.support ? (
                                    <i className="fa fa-chevron-down" />
                                  ) : (
                                    <i className="fa fa-chevron-up" />
                                  )}
                                </Accordion.Toggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey="1">
                                <div
                                  className="ibox-content m-b-sm border-bottom"
                                  style={{
                                    maxHeight: "525px",
                                    overflow: "scroll",
                                  }}
                                >
                                  <div className="row">
                                    <div className="col-md-12 text-truncate">
                                      {allStaff &&
                                        allStaff.length &&
                                        allStaff.map((values: any) => {
                                          return (
                                            !values.roles.includes(
                                              "stylist"
                                            ) && (
                                              <Button
                                                className="btn m-t-xs m-b-xs text-truncate"
                                                style={{
                                                  width: "100%",
                                                  maxWidth: "400px",
                                                  backgroundColor: `${values.color}`,
                                                  borderColor: `${values.color}`,
                                                }}
                                                onClick={(e: any) =>
                                                  setStaffSelected(
                                                    e.target.value
                                                  )
                                                }
                                                value={values.id}
                                              >
                                                {values.name}
                                              </Button>
                                            )
                                          );
                                        })}
                                    </div>
                                  </div>
                                </div>
                              </Accordion.Collapse>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>
            <DeleteModal
              title="Delete Schedule Item"
              modalPopup={modalPopup}
              closeModal={closeModal}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state: any) => ({});

const mapActionsToProps = {
  getAllStaff,
  schedule,
  getRootServiceCategory,
  updateSchedule,
  deleteSchedule,
};

export default connect(mapStateToProps, mapActionsToProps)(ScheduleStaff);
