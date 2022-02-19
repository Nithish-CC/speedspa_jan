import React, { useEffect, useState, useRef } from "react";
import { connect, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import listPlugin from "@fullcalendar/list";
import { getUserBusinessDetails } from "../../redux/actions/businessActions";
import { timeSlots, schedule } from "../../redux/actions/scheduleActions";
import { getAllStaff } from "../../redux/actions/staffActions";
import {
  getAllCategory,
  getAllService,
} from "../../redux/actions/serviceActions";
import "../../scss/style.scss";
import { buildFilter } from "../../utils/common";
import moment from "moment";
import Tooltips from "../core/Tooltips";
import PageHeader from "../core/PageHeader";
import _ from "lodash";
import { Button } from "react-bootstrap";

const Schedule = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [loading, setLoading] = useState(false);
  const UI = useSelector((state: any) => state.UI);
  const [title] = useState("Schedule");
  const businessId = localStorage.getItem("businessId");
  //const resourceId = localStorage.getItem("userId");
  const hostName = localStorage.getItem("businessUrl");
  let history = useHistory();
  const user = useSelector((state: any) => state.user);
  const allCategories = useSelector(
    (state: any) => state.service.categoryDetails
  );
  const [date, setDate] = useState("");
  const schedule = useSelector((state: any) => state.schedule);
  // const scheduleData = schedule.schedules;
  const totalSlots = schedule.totalSlots;
  const allStaff = user.allStaffDropdown;
  const [calenderData, setCalenderData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    show: false,
  });
  const [initialTooltip] = useState({ ...calenderData });
  const [resourseDataVal, setResourseDataVal] = useState<any[]>([]);
  const [params] = useState({
    text: "",
    status: "",
    role: "all",
  });

  const [buttons] = useState([
    {
      title: "Add Appointment",
      url: "schedule/add-appointment",
    },
  ]);
  const [toggle, setToggle] = useState({
    stylist: true,
    support: true,
  });

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

  //useEffect
  useEffect(() => {
    let paramsPass = {
      businessId: businessId,
    };
    getAllStaff(params);
    if (UI.errors) {
      setErrors(UI.errors);
    }
    eventsLoad();
    businessDetails();
    props.getAllService(paramsPass);
    props.getAllCategory(paramsPass);
  }, []);

  useEffect(() => {
    schedules();
  }, [date]);

  useEffect(() => {
    allStaffDetail();
  }, [allStaff]);

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
    props.timeSlots(query);
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

  const allStaffDetail = () => {
    if (allStaff && allStaff.length) {
      allStaff.forEach((value: any, index: any) => {
        if (value.status == "active") getRole(value, index);
      });
    }
  };
  const getRole = (value: any, index: any) => {
    var roleName = [];
    var roleValues = [];
    if (value.roles) {
      if (value.roles.includes("admin") || value.roles.includes("support")) {
        roleName.push("Admin/Support");
        value.building = "Admin/Support";
        value.title = value.displayName
          ? value.displayName
          : value.firstName + " " + value.lastName[0];
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
      //timeSlots(dates.toload.start, dates.toload.end);
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
      //timeSlots(dates.toload.start, dates.toload.end);
    }
  };

  function setDateTimeToShow(datetime: any) {
    var datetimeVal = new Date(datetime);
    var dt = new Date(
      datetimeVal.getFullYear(),
      datetimeVal.getMonth(),
      datetimeVal.getDate(),
      datetimeVal.getHours(),
      datetimeVal.getMinutes(),
      datetimeVal.getSeconds()
    );
    dt.setTime(dt.getTime() + dt.getTimezoneOffset() * 60 * 1000);
    return dt;
  }

  const [calenderDates, setCalenderDates] = useState<any[]>([]);
  useEffect(() => {
    if (totalSlots && totalSlots.length) {
      calendarData();
    }
  }, [totalSlots]);

  const handleMouseEnter = (info: any) => {
    updateTooltip(info);
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

  const handleMouseLeave = () => {
    setCalenderData(initialTooltip);
  };

  const handleMouseClick = (info: any) => {
    history.push(
      `/schedule/edit-appointment/view/${info.event._def.extendedProps.appointmentId}`
    );
  };

  const handleClick = (args: any) => {};

  const [staffSelected, setStaffSelected] = useState("all");
  useEffect(() => {
    if (totalSlots && totalSlots.length) {
      calendarData();
    }
  }, [staffSelected]);

  const calendarData = () => {
    const tempArr: any[] = [];

    const selectedStaff = _.filter(
      totalSlots,
      (totalSlots) => totalSlots.resourceId === staffSelected
    );
    let calenderSort: any[] = [];
    if (staffSelected == "all") {
      calenderSort = totalSlots;
    } else {
      calenderSort = selectedStaff;
    }

    calenderSort.forEach((values: any, key: any) => {
      if (resourseDataVal && resourseDataVal.length) {
        const title = _.filter(
          resourseDataVal,
          (resourseDataVal) => resourseDataVal.id === values.resourceId
        );
        values.title = values.serviceName + " [" + values.clientName + "]";
        values.description = "description" + key;
        values.backgroundColor = title[0].eventColor;
        values.eventColor = title[0].eventColor;
        values.start = values.timeStart;
        values.end = values.timeEnd;
        values.startDate = values.timeStart;
        values.startTime = values.timeStart;
        values.endTime = values.timeEnd;
        values.allDay = false;
        tempArr.push(values);
      }
    });
    setCalenderDates(tempArr);
  };

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading ? (
        <div>
          <PageHeader title={title} buttons={buttons} />
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <div className="row">
                  <div className="col-md-12 col-md-push-0"></div>
                </div>
                <div className="row">
                  <div className="col-md-9 col-md-push-3">
                    <div className="ibox-content m-b-sm border-bottom">
                      <div
                        className="text-center p-lg"
                        id="ScheduleCalendarWrapper"
                        style={{ padding: "10px" }}
                      >
                        <Tooltips
                          title={calenderData.title}
                          startTime={calenderData.startTime}
                          endTime={calenderData.endTime}
                          show={calenderData.show}
                        />
                        <FullCalendar
                          plugins={[
                            dayGridPlugin,
                            resourceTimeGridPlugin,
                            listPlugin,
                            resourceTimelinePlugin,
                          ]}
                          datesSet={(paypload) => {
                            setDate(
                              moment(paypload.view.currentStart)
                                .startOf("month")
                                .utc()
                                .format()
                            );
                          }}
                          contentHeight={600}
                          height={500}
                          timeZone="UTC"
                          schedulerLicenseKey="0116820732-fcs-1622120977"
                          initialView="resourceTimeline"
                          resourceGroupField="building"
                          resources={_.orderBy(
                            resourseDataVal,
                            ["building"],
                            ["desc"]
                          )}
                          buttonText={{
                            today: "Today",
                            month: "Month",
                            week: "Week",
                            day: "Day",
                            listDay: "List",
                            resourceTimeline: "Group",
                          }}
                          headerToolbar={{
                            left: "today,prev,next",
                            center: "title",
                            right:
                              "dayGridMonth,timeGridWeek,resourceTimeGridDay,listDay,resourceTimeline",
                          }}
                          views={{
                            dayGridMonth: {
                              titleFormat: {
                                year: "numeric",
                                month: "long",
                              },
                            },
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
                            resourceTimeline: {
                              titleFormat: {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                weekday: "short",
                              },
                            },
                          }}
                          resourceAreaColumns={[
                            {
                              field: "name",
                              headerContent: "Name",
                            },
                          ]}
                          eventMouseEnter={handleMouseEnter}
                          eventMouseLeave={handleMouseLeave}
                          eventClick={handleMouseClick}
                          eventDisplay="block"
                          events={
                            calenderDates && calenderDates.length
                              ? calenderDates
                              : []
                          }
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
                            color: "#676a6c",
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
                    <div className="ibox float-e-margins">
                      <div className="ibox-title">
                        <h5>Staff Members</h5>
                        <div className="ibox-tools">
                          <a className="collapse-link" href="#/">
                            <i
                              className={
                                toggle.stylist
                                  ? "fa fa-chevron-up"
                                  : "fa fa-chevron-down"
                              }
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
                            ></i>
                          </a>
                        </div>
                      </div>
                      {toggle.stylist && (
                        <div
                          className="ibox-content m-b-sm border-bottom"
                          style={{ maxHeight: "525px", overflow: "scroll" }}
                        >
                          <div className="row">
                            <div className="col-md-12 text-truncate">
                              {allStaff &&
                                allStaff.length &&
                                allStaff.map((values: any, index: any) => {
                                  return (
                                    values.roles.includes("stylist") && (
                                      <Button
                                        className="btn btn-primary m-t-xs m-b-xs text-truncate"
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
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ibox float-e-margins">
                      <div className="ibox-title">
                        <h5>Admin/Support Members</h5>
                        <div className="ibox-tools">
                          <a className="collapse-link" href="#/">
                            <i
                              className={
                                toggle.support
                                  ? "fa fa-chevron-up"
                                  : "fa fa-chevron-down"
                              }
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
                            ></i>
                          </a>
                        </div>
                      </div>
                      {toggle.support && (
                        <div
                          className="ibox-content m-b-sm border-bottom"
                          style={{ maxHeight: "525px", overflow: "scroll" }}
                        >
                          <div className="row">
                            <div className="col-md-12 text-truncate">
                              {allStaff &&
                                allStaff.length &&
                                _.orderBy(
                                  allStaff,
                                  ["displayName"],
                                  ["desc"]
                                ).map((values: any, index: any) => {
                                  return (
                                    <>
                                      {values.roles.includes("admin") &&
                                        !values.roles.includes("support") &&
                                        !values.roles.includes("stylist") && (
                                          <Button
                                            className="btn btn-primary m-t-xs m-b-xs text-truncate"
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
                                        )}
                                    </>
                                  );
                                })}
                              {allStaff &&
                                allStaff.length &&
                                _.orderBy(allStaff, ["displayName"]).map(
                                  (values: any, index: any) => {
                                    return (
                                      <>
                                        {values.roles.includes("support") && (
                                          <Button
                                            className="btn btn-primary m-t-xs m-b-xs text-truncate"
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
                                        )}
                                      </>
                                    );
                                  }
                                )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
  getAllCategory,
  timeSlots,
  getUserBusinessDetails,
  getAllService,
  schedule,
};

export default connect(mapStateToProps, mapActionsToProps)(Schedule);
