import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import PageHeader from "../../core/PageHeader";
import { useHistory, useParams } from "react-router-dom";
import { sorting, buildFilter, commafy } from "../../../utils/common";
import { Formik } from "formik";
import * as yup from "yup";
import Tippy from "@tippyjs/react";
import DeleteModal from "../../core/DeleteModal";
import {
  getAllService,
  getAllCategory,
  addServiceOfService,
  searchServiceService,
  deleteAddCost,
  serviceAddCost,
  serviceUpdateAddCost,
  serviceUpdateService,
} from "../../../redux/actions/serviceActions";
import { getAllStaff } from "../../../redux/actions/staffActions";
import {
  Form,
  Col,
  Row,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
} from "react-bootstrap";

const Service = (props: any) => {
  const [title, setTitle] = useState("Add New Service");
  const [checkedTopLevel, setCheckedTopLevel] = useState(true);
  const [checkedAddonsRequired, setCheckedAddonsRequired] = useState(false);
  const [orderBy, setOrderBy] = useState(true);
  const [field, setField] = useState("displayName");
  const [activeTime, setActiveTime] = useState({});
  const [processingTime, setProcessingTime] = useState({});
  const [secondActiveTime, setSecondActiveTime] = useState({});
  const [duration, setDuration] = useState<any[]>([]);
  const [addCostChangeVal, setAddCostChangeVal] = useState({});
  const [modalPopup, setModalPopup] = useState({
    deleteModal: false,
    resourceId: "",
    serviceId: "",
    variation: { duration: [], price: 0, resourceId: "", resourceName: "" },
    index: 0,
  });
  const [params, setParams] = useState({
    categoryId: "",
    description: "",
    displayPrice: "",
    duration: [],
    name: "",
    order: 0,
    price: 0.2,
    priority: "",
    requiredAddOns: false,
    topLevel: true,
    resourceName: "",
    prices: 0,
  });

  const [initialModalPopup] = useState({ ...modalPopup });
  const [submitButton, setSubmitButton] = useState("sub");
  const [staffData, setStaffData] = useState<any[]>([]);
  const [staffRole, setStaffRole] = useState({
    text: "",
    status: "",
    role: "all",
  });

  const history = useHistory();
  const bussinessId = localStorage.getItem("businessId");

  /* Get urlparams values */
  const view = window.location.href.includes("view");
  const urlParams = useParams();
  const id = urlParams.id;

  // From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const service = useSelector((state: any) => state.service);
  const allStaff = user.allStaff;
  const categoryDetails = service.categoryDetails;
  const allServices = service.serviceDetails;
  let serviceData = service.getServiceServiceData;

  // Form Validation
  const [validationShape] = useState({
    name: yup.string().required("Name is required"),
    priority: yup.number().min(1).required("Priority is required"),
    categoryId: yup.string().required("Category id is required"),
  });

  const basicFormSchema = yup.object().shape(validationShape);

  // For Addons
  const linkedService: any = {
    type: "addOns",
    addonServiceId: "",
    addonServiceIds: [
      {
        id: null,
      },
    ],
  };

  const [linkedServices, setLinkedServices] = useState<any[]>([linkedService]);

  //set active time , processing time , second active time , combine all
  const [activeAddTime, setActiveAddTime] = useState({});
  const [processingAddTime, setProcessingAddTime] = useState({});
  const [secondActiveAddTime, setSecondActiveAddTime] = useState({});

  const [addCostData, setAddCostData] = useState({
    duration: [{ type: "active" }, { type: "processing" }, { type: "active" }],
  });

  const [editingData, setEditingData] = useState({});

  const [addUpdate, setAddUpdate] = useState<any>("add");

  useEffect(() => {
    setAddCostData({
      duration: [
        { type: "active", ...activeAddTime },
        { type: "processing", ...processingAddTime },
        { type: "active", ...secondActiveAddTime },
      ],
    });
  }, [activeAddTime, secondActiveAddTime, processingAddTime]);

  useEffect(() => {
    let params = {
      businessId: bussinessId,
    };
    props.getAllService(params);
    props.getAllCategory(params);
    if (view) {
      setTitle("View/Edit Service");
      props.searchServiceService(id, params);
      getAllStaff(staffRole);
    } else {
      serviceData = {
        categoryId: "",
        description: "",
        displayPrice: "",
        duration: [],
        links: {},
        name: "",
        order: 0,
        price: 0,
        priority: "",
        requiredAddOns: false,
        topLevel: true,
      };
    }
  }, [view]);

  useEffect(() => {
    if (view == true) {
      const tempStaffArr: any[] = [];
      allStaff.forEach((element: any) => {
        if (element.profileCategoryId.includes(serviceData.categoryId)) {
          tempStaffArr.push(element);
        }
      });
      setStaffData(tempStaffArr);

      if (serviceData.links) {
        const linkService: any = [];
        if (serviceData.links.during && serviceData.links.during.length > 0) {
          serviceData.links.during.forEach((value: any) => {
            linkService.push({
              type: "during",
              addonServiceId: value,
              addonServiceIds: [],
            });
          });
        }
        serviceData.links.addOns.map((value: any) => {
          if (value.servicesIds.length === 0) {
            value.servicesIds.push({
              serviceId: null,
            });
          }
        });
        if (serviceData.links.addOns && serviceData.links.addOns.length > 0) {
          serviceData.links.addOns.forEach((value: any) => {
            var servicesIds = value.servicesIds.map((servicesId: any) => {
              return {
                id: servicesId,
              };
            });
            linkService.push({
              type: "addOns",
              addonServiceId: value.serviceId,
              addonServiceIds: servicesIds,
            });
          });
        } else {
          if (
            serviceData.links.additional &&
            serviceData.links.additional.length > 0
          ) {
            serviceData.links.additional.forEach((value: any) => {
              linkService.push({
                type: "addOns",
                addonServiceId: value,
                addonServiceIds: [],
              });
            });
          }

          if (
            serviceData.links.onOption &&
            serviceData.links.onOption.length > 0
          ) {
            serviceData.links.onOption.forEach((value: any) => {
              linkService.forEach((linkedService: any) => {
                if (value.type == "addOns")
                  linkedService.addonServiceIds.push({
                    id: value,
                  });
              });
            });
          }
        }

        setLinkedServices(linkService);
      }
    }
  }, [allStaff, serviceData]);

  useEffect(() => {
    setParams(serviceData);
    setCheckedTopLevel(serviceData.topLevel);
    setCheckedAddonsRequired(serviceData.requiredAddOns);
  }, [serviceData]);

  useEffect(() => {
    if (serviceData.duration) {
      setActiveTime(serviceData.duration[0]);
      setProcessingTime(serviceData.duration[1]);
      setSecondActiveTime(serviceData.duration[2]);
    }
  }, [serviceData]);

  useEffect(() => {
    setDuration([activeTime, processingTime, secondActiveTime]);
  }, [activeTime, processingTime, secondActiveTime]);

  useEffect(() => {
    if (editingData.variations) {
      handleAddActiveTime(editingData.variations.duration[0].time);
      handleAddProcessingTime(editingData.variations.duration[1].time);
      handleAddSecondActiveTime(editingData.variations.duration[2].time);
      params.prices = editingData.variations.prices;
      params.resourceName = editingData.variations.resourceName;
    }
  }, [editingData]);

  const getAllStaff = (params: any) => {
    var requestRoles = ["stylist"];
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
        $not: {
          $eq: "inactive",
        },
      };
    }
    var query = buildFilter(data);

    query.text = params.text;

    query.businessId = localStorage.businessId;

    props.getAllStaff(query);
  };

  const linkedServicesFunction = (event: any, parentIndex: any) => {
    const filteredLinkedServices = [...linkedServices];
    filteredLinkedServices[parentIndex].type = event.target.value;
    setLinkedServices(filteredLinkedServices);
  };

  /*Parent Plus Button*/
  const addLinkedParentService = (parentIndex: any) => {
    setLinkedServices([...linkedServices, linkedService]);
  };

  const removeLinkedParentService = (parentIndex: any) => {
    const filteredLinkedServices = [...linkedServices];
    filteredLinkedServices.splice(parentIndex, 1);
    setLinkedServices(filteredLinkedServices);
  };

  const handleParentService = (e: any, parentIndex: any) => {
    const filteredLinkedServices = [...linkedServices];
    filteredLinkedServices[parentIndex].addonServiceId = e.target.value;
    setLinkedServices(filteredLinkedServices);
  };

  /* Child plus Button */
  const addAddOnService = (parentIndex: any, addonIndex: any) => {
    const filteredLinkedServices = [...linkedServices];
    filteredLinkedServices[parentIndex].addonServiceIds.splice(
      addonIndex + 1,
      0,
      {
        id: null,
      }
    );
    setLinkedServices(filteredLinkedServices);
  };

  const removeAddOnService = (parentIndex: any, addonIndex: any) => {
    const filteredLinkedServices = [...linkedServices];
    filteredLinkedServices[parentIndex].addonServiceIds.splice(addonIndex, 1);
    setLinkedServices(filteredLinkedServices);
  };

  const handleAddOnChange = (e: any, parentIndex: any, addOnIndex: any) => {
    const filteredLinkedServices = [...linkedServices];
    filteredLinkedServices[parentIndex].addonServiceIds[addOnIndex].id =
      e.target.value;
    setLinkedServices(filteredLinkedServices);
  };

  const handleCancel = (e: any) => {
    props.history.push("/services");
  };

  const getServiceDetails = () => {
    let params = {
      businessId: bussinessId,
    };
    props.searchServiceService(id, params);
  };

  const handleSubmit = (values: any) => {
    let addOns: any[] = [];
    let during: any[] = [];
    if (linkedServices.length) {
      linkedServices.forEach((value) => {
        if (value.addonServiceId && value.addonServiceId.length) {
          if (value.type == "addOns") {
            var onOptions = value.addonServiceIds
              .map((serviceId: any) => {
                return serviceId.id;
              })
              .filter((servicesId: any) => {
                return servicesId && servicesId.length;
              });
            addOns.push({
              serviceId: value.addonServiceId,
              servicesIds: onOptions,
            });
          }
          if (value.type == "during") {
            during.push(value.addonServiceId);
          }
        }
      });
    }
    let links = {
      addOns: addOns,
      during: during,
    };
    values.links = links;
    if (view == true && submitButton == "updateService") {
      let categoryName = values.categoryName;
      categoryDetails.forEach((element: any) => {
        if (element.id == values.categoryId) {
          categoryName = element.name;
        }
      });
      delete values.prices;
      delete values.resourceName;
      values.duration = duration;
      values.topLevel = checkedTopLevel;
      values.requiredAddOns = checkedAddonsRequired;
      values.categoryName = categoryName;
      props.serviceUpdateService(values, history);
    } else if (view == true && submitButton == "add") {
      let addCost = {
        action: "create",
        businessId: localStorage.getItem("businessId"),
        serviceId: serviceData.id,
        variation: {
          ...addCostChangeVal,
          price: Number(values.prices),
          ...addCostData,
        },
      };
      props.serviceAddCost(addCost);
      getServiceDetails();
    } else if (view == true && submitButton == "update") {
      let addCost = {
        action: "update",
        businessId: localStorage.getItem("businessId"),
        serviceId: serviceData.id,
        variation: {
          resourceId: editingData.variations.resourceId,
          resourceName: editingData.variations.resourceName,
          price: Number(values.prices),
          ...addCostData,
        },
      };
      props.serviceUpdateAddCost(addCost);
      getServiceDetails();
    } else if (view == false) {
      values.duration = duration;
      values.topLevel = checkedTopLevel;
      values.requiredAddOns = checkedAddonsRequired;
      values.businessId = bussinessId;
      props.addServiceOfService(values, history);
    }
  };

  const handleActiveTime = (event: any) => {
    setActiveTime({
      [event.target.name]: event.target.status,
      [event.target.eventName]: event.target.value,
    });
  };

  const handleProcessingTime = (event: any) => {
    setProcessingTime({
      [event.target.name]: event.target.status,
      [event.target.eventName]: event.target.value,
    });
  };

  const handleSecondActiveTime = (event: any) => {
    setSecondActiveTime({
      [event.target.name]: event.target.status,
      [event.target.eventName]: event.target.value,
    });
  };

  const handleAddCostChange = (event: any) => {
    if (event == "reset") {
      const { options, selectedIndex } = event.target;
      const text = options[0].text;
      setAddCostChangeVal({
        resourceId: event.target.value,
        resourceName: text,
      });
    } else {
      const { options, selectedIndex } = event.target;
      const text = options[selectedIndex].text;
      setAddCostChangeVal({
        resourceId: event.target.value,
        resourceName: text,
      });
    }
  };

  const handleSortChange = (key: any) => {
    if (field === key) {
      setOrderBy(!orderBy);
    } else {
      setOrderBy(true);
      setField(key);
    }
    sorting(serviceData.variations, key, orderBy);
  };

  const closeModal = () => {
    setModalPopup(initialModalPopup);
  };

  const deletePopup = (value: any, index: any) => {
    setModalPopup({
      deleteModal: !modalPopup.deleteModal,
      resourceId: value.resourceId,
      serviceId: value.serviceId,
      variation: {
        duration: value.duration,
        price: value.prices,
        resourceId: value.resourceId,
        resourceName: value.resourceName,
      },
      index: index,
    });
  };

  const handleDelete = () => {
    let params = {
      action: "remove",
      businessId: localStorage.getItem("businessId"),
      ...modalPopup,
    };
    const tempVal: any = params;
    if (params) {
      delete tempVal.deleteModal;
    }
    props.deleteAddCost(tempVal);
    closeModal();
    serviceData.variations.splice(modalPopup.index, 1);
  };

  //add active time
  const handleAddActiveTime = (event: any) => {
    if (event == "") {
      setActiveAddTime({ time: "" });
    } else {
      setActiveAddTime({
        time: Number(event),
      });
    }
  };

  //add processsing time
  const handleAddProcessingTime = (event: any) => {
    if (event == "") {
      setProcessingAddTime({ time: "" });
    } else {
      setProcessingAddTime({
        time: Number(event),
      });
    }
  };

  //add second active time
  const handleAddSecondActiveTime = (event: any) => {
    if (event == "") {
      setSecondActiveAddTime({ time: "" });
    } else {
      setSecondActiveAddTime({
        time: Number(event),
      });
    }
  };

  const editAddCostData = (value: any, index: any) => {
    setEditingData({
      resourceId: value.resourceId,
      serviceId: value.serviceId,
      variations: {
        duration: value.duration,
        prices: value.price,
        resourceId: value.resourceId,
        resourceName: value.resourceName,
      },
      index: index,
    });
  };

  //Reset
  const updateAddEdit = (values: any) => {
    setAddCostChangeVal({});
    handleAddActiveTime("");
    handleAddProcessingTime("");
    handleAddSecondActiveTime("");
    setEditingData({});
    values.prices = 50;
  };

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
                      Service Info
                    </a>
                  </li>
                  {view && (
                    <React.Fragment>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          id="Staff-tab"
                          data-toggle="tab"
                          href="#Staff"
                          role="tab"
                          aria-controls="Staff"
                          aria-selected="false"
                        >
                          Staff Based Cost &#38; Duration
                        </a>
                      </li>
                    </React.Fragment>
                  )}
                </ul>
                <Formik
                  initialValues={{ ...params }}
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
                  }) => {
                    return (
                      <React.Fragment>
                        <div className="tab-content" id="myTabContent">
                          <div
                            className="tab-pane active"
                            id="client"
                            role="tabpanel"
                            aria-labelledby="client-tab"
                          >
                            <Form
                              name="clientEdit"
                              className="form-horizontal"
                              noValidate
                              autoComplete="off"
                              onSubmit={handleSubmit}
                            >
                              <div className="ibox float-e-margins m-b-none">
                                <div className="ibox-content no-border">
                                  <div className="m-t-md">
                                    <Row>
                                      <Col md="8">
                                        {UI.errors && UI.errors.message && (
                                          <div className="text-danger m-t-md m-b-md">
                                            Can not save your data.{" "}
                                            {UI.errors.message}
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col md="8">
                                        <FormGroup>
                                          <FormLabel className="col-sm-3 control-label">
                                            Name{" "}
                                            <Tippy
                                              theme="success"
                                              maxWidth="225px"
                                              content={
                                                <p>
                                                  How do you want the service to
                                                  appear in the app and on the
                                                  schedule?
                                                </p>
                                              }
                                            >
                                              <i className="fa fa-question-circle"></i>
                                            </Tippy>
                                          </FormLabel>
                                          <Col sm="9">
                                            <FormControl
                                              type="text"
                                              name="name"
                                              value={values.name}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              isInvalid={
                                                errors.name && touched.name
                                              }
                                            />
                                          </Col>
                                        </FormGroup>
                                        <FormGroup>
                                          <FormLabel className="col-sm-3 control-label">
                                            <span
                                              style={{
                                                textTransform: "capitalize",
                                              }}
                                            ></span>
                                            Active Time{" "}
                                            <Tippy
                                              theme="success"
                                              maxWidth="225px"
                                              content={
                                                <div>
                                                  <p>
                                                    How long does it take to do
                                                    the service
                                                  </p>
                                                </div>
                                              }
                                            >
                                              <i className="fa fa-question-circle"></i>
                                            </Tippy>
                                          </FormLabel>
                                          <Col sm="9">
                                            <FormControl
                                              type="number"
                                              name="durationactive"
                                              value={
                                                activeTime ? activeTime.time : 0
                                              }
                                              onBlur={handleBlur}
                                              onChange={(e: any) => {
                                                let event = {
                                                  target: {
                                                    name: "type",
                                                    status: "active",
                                                    eventName: "time",
                                                    value: e.target.value,
                                                  },
                                                };
                                                handleActiveTime(event);
                                              }}
                                            />
                                            <span className="help-block m-b-none">
                                              All time are in minutes.
                                            </span>
                                          </Col>
                                        </FormGroup>
                                        <FormGroup>
                                          <FormLabel className="col-sm-3 control-label">
                                            <span
                                              style={{
                                                textTransform: "capitalize",
                                              }}
                                            ></span>
                                            Processing Time{" "}
                                            <Tippy
                                              theme="success"
                                              maxWidth="225px"
                                              content={
                                                <div>
                                                  <p>
                                                    This is only for processing
                                                    of hair color
                                                  </p>
                                                </div>
                                              }
                                            >
                                              <i className="fa fa-question-circle"></i>
                                            </Tippy>
                                          </FormLabel>
                                          <Col sm="9">
                                            <FormControl
                                              type="number"
                                              name="processing"
                                              value={
                                                processingTime
                                                  ? processingTime.time
                                                  : 0
                                              }
                                              onChange={(e: any) => {
                                                let event = {
                                                  target: {
                                                    name: "type",
                                                    status: "processing",
                                                    eventName: "time",
                                                    value: e.target.value,
                                                  },
                                                };
                                                handleProcessingTime(event);
                                              }}
                                              onBlur={handleBlur}
                                            />
                                            <span className="help-block m-b-none">
                                              Not required. All time are in
                                              minutes.
                                            </span>
                                          </Col>
                                        </FormGroup>
                                        <FormGroup>
                                          <FormLabel className="col-sm-3 control-label">
                                            <span
                                              style={{
                                                textTransform: "capitalize",
                                              }}
                                            ></span>
                                            Active Time{" "}
                                            <Tippy
                                              theme="success"
                                              maxWidth="225px"
                                              content={
                                                <div>
                                                  <p>
                                                    This is for Hair
                                                    appointments that involve
                                                    color. This time would be
                                                    the amount of time it takes
                                                    to do the service after
                                                    color has processed.
                                                  </p>
                                                </div>
                                              }
                                            >
                                              <i className="fa fa-question-circle"></i>
                                            </Tippy>
                                          </FormLabel>
                                          <Col sm="9">
                                            <FormControl
                                              type="number"
                                              name="activetime"
                                              value={
                                                secondActiveTime
                                                  ? secondActiveTime.time
                                                  : 0
                                              }
                                              onChange={(e: any) => {
                                                let event = {
                                                  target: {
                                                    name: "type",
                                                    status: "active",
                                                    eventName: "time",
                                                    value: e.target.value,
                                                  },
                                                };
                                                handleSecondActiveTime(event);
                                              }}
                                              onBlur={handleBlur}
                                            />
                                            <span className="help-block m-b-none">
                                              After processing time. Not
                                              required. All time are in minutes.
                                            </span>
                                          </Col>
                                        </FormGroup>
                                        <FormGroup>
                                          <FormLabel className="col-sm-3 control-label">
                                            <span
                                              style={{
                                                textTransform: "capitalize",
                                              }}
                                            ></span>
                                            Price (min 0.2)
                                          </FormLabel>
                                          <Col sm="9">
                                            <FormControl
                                              type="number"
                                              name="price"
                                              value={values.price}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                            />
                                          </Col>
                                        </FormGroup>
                                        <FormGroup>
                                          <FormLabel className="col-sm-3 control-label">
                                            Display Price{" "}
                                            <Tippy
                                              theme="success"
                                              maxWidth="225px"
                                              content={
                                                <div>
                                                  <p>
                                                    You can show a range of
                                                    prices or a dollar price and
                                                    a plus sign; e.g, $45 - $55
                                                    or $45+
                                                  </p>
                                                </div>
                                              }
                                            >
                                              <i className="fa fa-question-circle"></i>
                                            </Tippy>
                                          </FormLabel>
                                          <Col sm="9">
                                            <FormControl
                                              type="input"
                                              name="displayPrice"
                                              value={values.displayPrice}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                            />
                                          </Col>
                                        </FormGroup>
                                        <FormGroup>
                                          <FormLabel className="col-sm-3 control-label">
                                            Priority (1 is the lowest){" "}
                                            <Tippy
                                              theme="success"
                                              maxWidth="225px"
                                              content={
                                                <p>
                                                  If this service is a stand
                                                  alone service, it can be a “1”
                                                  as in first in the order of
                                                  completion. If it is an
                                                  add-on, it would be at least
                                                  second (“2”). This is only
                                                  important for Hair and color
                                                  when there is processing and
                                                  it is so you can book another
                                                  appointment during processing.
                                                </p>
                                              }
                                            >
                                              <i className="fa fa-question-circle"></i>
                                            </Tippy>
                                          </FormLabel>
                                          <Col sm="9">
                                            <FormControl
                                              type="number"
                                              name="priority"
                                              value={values.priority}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              isInvalid={
                                                errors.priority &&
                                                touched.priority
                                              }
                                            />
                                          </Col>
                                        </FormGroup>
                                        <FormGroup>
                                          <FormLabel className="col-sm-3 control-label">
                                            Sort order (min 0){" "}
                                            <Tippy
                                              theme="success"
                                              maxWidth="225px"
                                              content={
                                                <p>
                                                  This is the order you would
                                                  like this service to appear in
                                                  a list on the app for the
                                                  client to book. You can choose
                                                  to put it in alphabetical
                                                  order or maybe put the most
                                                  popular services first.
                                                </p>
                                              }
                                            >
                                              <i className="fa fa-question-circle"></i>
                                            </Tippy>
                                          </FormLabel>
                                          <Col sm="9">
                                            <FormControl
                                              type="number"
                                              name="order"
                                              value={values.order}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                            />
                                          </Col>
                                        </FormGroup>
                                        <FormGroup>
                                          <FormLabel className="col-sm-3 control-label">
                                            Top level service{" "}
                                            <Tippy
                                              theme="success"
                                              maxWidth="225px"
                                              content={
                                                <p>
                                                  Check “Top level service” if
                                                  this service can stand alone
                                                  and is not an add-on.
                                                </p>
                                              }
                                            >
                                              <i className="fa fa-question-circle"></i>
                                            </Tippy>
                                          </FormLabel>
                                          <Col sm="9">
                                            <input
                                              type="checkbox"
                                              name="topLevel"
                                              checked={checkedTopLevel}
                                              onBlur={handleBlur}
                                              onChange={(e) => {
                                                setCheckedTopLevel(
                                                  !checkedTopLevel
                                                );
                                              }}
                                            />
                                          </Col>
                                        </FormGroup>
                                        <FormGroup>
                                          <FormLabel className="col-sm-3 control-label">
                                            AddOns are required{" "}
                                            <Tippy
                                              maxWidth="225px"
                                              theme="success"
                                              content={
                                                <p>
                                                  Check this if a service
                                                  requires an additional
                                                  service. For example, if you
                                                  apply color to hair, you must
                                                  wash the hair so one of the
                                                  hair washing selections must
                                                  be chosen.
                                                </p>
                                              }
                                            >
                                              <i className="fa fa-question-circle"></i>
                                            </Tippy>
                                          </FormLabel>
                                          <Col sm="9">
                                            <input
                                              type="checkbox"
                                              name="requiredAddOns"
                                              checked={checkedAddonsRequired}
                                              onBlur={handleBlur}
                                              onChange={() => {
                                                setCheckedAddonsRequired(
                                                  !checkedAddonsRequired
                                                );
                                              }}
                                            />
                                          </Col>
                                        </FormGroup>
                                        <FormGroup>
                                          <FormLabel className="col-sm-3 control-label">
                                            Description{" "}
                                            <Tippy
                                              theme="success"
                                              maxWidth="225px"
                                              content={
                                                <p>
                                                  Whatever you write shows up in
                                                  the app so if you must
                                                  describe, be succinct.{" "}
                                                </p>
                                              }
                                            >
                                              <i className="fa fa-question-circle"></i>
                                            </Tippy>
                                          </FormLabel>
                                          <Col sm="9">
                                            <FormControl
                                              as="textarea"
                                              name="description"
                                              placeholder="Write description here"
                                              value={values.description}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              style={{ height: "112px" }}
                                            />
                                          </Col>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                    <div class="hr-line-dashed"></div>
                                    <Row>
                                      <Col md="8">
                                        <FormGroup>
                                          <FormLabel className="col-sm-3 control-label">
                                            Category
                                          </FormLabel>
                                          <Col sm="9">
                                            <FormControl
                                              as="select"
                                              name="categoryId"
                                              value={values.categoryId}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              isInvalid={
                                                errors.categoryId &&
                                                touched.categoryId
                                              }
                                            >
                                              <option value="">Category</option>
                                              {categoryDetails &&
                                                categoryDetails.length &&
                                                categoryDetails.map(
                                                  (category: any) => {
                                                    return (
                                                      <option
                                                        value={category.id}
                                                      >
                                                        {category.name}
                                                      </option>
                                                    );
                                                  }
                                                )}
                                            </FormControl>
                                          </Col>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col md="12">
                                        <FormGroup>
                                          <FormLabel className="col-sm-2 control-label">
                                            Linked Services{" "}
                                            <Tippy
                                              maxWidth="225px"
                                              theme="success"
                                              content={
                                                <p>
                                                  Here is your chance to upsell!
                                                  Think about what services
                                                  naturally go with the service
                                                  you are selling and the client
                                                  has selected. A pedicure and a
                                                  paraffin could be suggested
                                                  when a manicure is booked.
                                                  lConnect all of the services
                                                  you want! Once you create it,
                                                  look at the effect in the app
                                                  and make sure you like it!
                                                </p>
                                              }
                                            >
                                              <i className="fa fa-question-circle"></i>
                                            </Tippy>
                                          </FormLabel>
                                          <Col sm="10">
                                            {linkedServices.map(
                                              (
                                                value: any,
                                                parentIndex: any
                                              ) => {
                                                return (
                                                  <React.Fragment>
                                                    <div className="m-t-sm">
                                                      <Row>
                                                        <Col sm="5" xs="4">
                                                          <FormControl
                                                            as="select"
                                                            name="addOns"
                                                            defaultValue={
                                                              value.type
                                                            }
                                                            onChange={(
                                                              e: any
                                                            ) =>
                                                              linkedServicesFunction(
                                                                e,
                                                                parentIndex
                                                              )
                                                            }
                                                            onBlur={handleBlur}
                                                          >
                                                            <option value="addOns">
                                                              Select Add On
                                                              Option
                                                            </option>
                                                            <option value="during">
                                                              Select Processing
                                                              Time Option
                                                            </option>
                                                          </FormControl>
                                                        </Col>
                                                        <Col sm="5" xs="4">
                                                          <FormControl
                                                            as="select"
                                                            name="serviceId"
                                                            value={
                                                              value.addonServiceId
                                                            }
                                                            key={parentIndex}
                                                            onChange={(
                                                              e: any
                                                            ) => {
                                                              let event = {
                                                                target: {
                                                                  name: "serviceId",
                                                                  value: e,
                                                                },
                                                              };
                                                              handleParentService(
                                                                e,
                                                                parentIndex
                                                              );
                                                            }}
                                                            onBlur={handleBlur}
                                                          >
                                                            <option value="">
                                                              -- Select Service
                                                              --
                                                            </option>
                                                            {allServices &&
                                                              allServices.length &&
                                                              allServices.map(
                                                                (
                                                                  services: any
                                                                ) => {
                                                                  return (
                                                                    <option
                                                                      value={
                                                                        services.id
                                                                      }
                                                                    >
                                                                      {
                                                                        services.name
                                                                      }
                                                                    </option>
                                                                  );
                                                                }
                                                              )}
                                                          </FormControl>
                                                        </Col>
                                                        <Col sm="2" xs="3">
                                                          {parentIndex !==
                                                            0 && (
                                                            <button
                                                              className="btn btn-sm btn-danger"
                                                              type="button"
                                                              onClick={() =>
                                                                removeLinkedParentService(
                                                                  parentIndex
                                                                )
                                                              }
                                                            >
                                                              <i
                                                                className="fa fa-minus"
                                                                aria-hidden="true"
                                                              />
                                                            </button>
                                                          )}
                                                          &nbsp;
                                                          <button
                                                            className="btn btn-sm btn-primary"
                                                            type="button"
                                                            onClick={() =>
                                                              addLinkedParentService(
                                                                parentIndex
                                                              )
                                                            }
                                                          >
                                                            <i
                                                              className="fa fa-plus"
                                                              aria-hidden="true"
                                                            />
                                                          </button>
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                    {/*Start of Second Plus Sign Addon*/}
                                                    {value.type ===
                                                      "addOns" && (
                                                      <div className="row m-t-sm">
                                                        {value.addonServiceIds.map(
                                                          (
                                                            addonsVal: any,
                                                            addOnIndex: any
                                                          ) => {
                                                            return (
                                                              <React.Fragment>
                                                                <label className="col-sm-4 col-xs-3 col-xs-push-1 control-label">
                                                                  <span>
                                                                    Add On:
                                                                  </span>
                                                                </label>
                                                                <div
                                                                  className="col-sm-5 col-xs-5 col-xs-push-1"
                                                                  style={{
                                                                    paddingBottom:
                                                                      "7px",
                                                                  }}
                                                                >
                                                                  <FormControl
                                                                    as="select"
                                                                    name="servicesIds"
                                                                    value={
                                                                      addonsVal.id
                                                                    }
                                                                    onChange={(
                                                                      e: any
                                                                    ) => {
                                                                      var event =
                                                                        {
                                                                          target:
                                                                            {
                                                                              name: "servicesIds",
                                                                              value:
                                                                                e,
                                                                            },
                                                                        };
                                                                      handleAddOnChange(
                                                                        e,
                                                                        parentIndex,
                                                                        addOnIndex
                                                                      );
                                                                    }}
                                                                    onBlur={
                                                                      handleBlur
                                                                    }
                                                                  >
                                                                    <option value="">
                                                                      -- Select
                                                                      Service --
                                                                    </option>
                                                                    {allServices &&
                                                                      allServices.length &&
                                                                      allServices.map(
                                                                        (
                                                                          services: any,
                                                                          index: any
                                                                        ) => {
                                                                          return (
                                                                            <option
                                                                              value={
                                                                                services.id
                                                                              }
                                                                              key={
                                                                                index
                                                                              }
                                                                            >
                                                                              {
                                                                                services.name
                                                                              }
                                                                            </option>
                                                                          );
                                                                        }
                                                                      )}
                                                                  </FormControl>
                                                                </div>
                                                                <div className="col-sm-2 col-xs-3 col-xs-push-1">
                                                                  {addOnIndex !==
                                                                    0 && (
                                                                    <button
                                                                      className="btn btn-xs btn-danger"
                                                                      type="button"
                                                                      onClick={() =>
                                                                        removeAddOnService(
                                                                          parentIndex,
                                                                          addOnIndex
                                                                        )
                                                                      }
                                                                    >
                                                                      <i
                                                                        className="fa fa-minus"
                                                                        aria-hidden="true"
                                                                      />
                                                                    </button>
                                                                  )}
                                                                  &nbsp;
                                                                  <button
                                                                    className="btn btn-xs btn-primary"
                                                                    type="button"
                                                                    onClick={() =>
                                                                      addAddOnService(
                                                                        parentIndex,
                                                                        addOnIndex
                                                                      )
                                                                    }
                                                                  >
                                                                    <i
                                                                      className="fa fa-plus"
                                                                      aria-hidden="true"
                                                                    />
                                                                  </button>
                                                                </div>
                                                              </React.Fragment>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    )}
                                                  </React.Fragment>
                                                );
                                              }
                                            )}
                                          </Col>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                    <div className="hr-line-dashed"></div>
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
                                                  values.name &&
                                                  values.name.length &&
                                                  values.price > 0.2 &&
                                                  values.priority > 0 &&
                                                  values.categoryId &&
                                                  values.categoryId.length
                                                )
                                              }
                                              onClick={(e) =>
                                                setSubmitButton("updateService")
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
                              </div>
                            </Form>
                          </div>

                          <div
                            className="tab-pane"
                            id="Staff"
                            role="tabpanel"
                            aria-labelledby="Staff-tab"
                          >
                            <div className="ibox float-e-margins m-b-none">
                              <div className="ibox-content no-border">
                                <div className="m-t-md"></div>
                                <Form
                                  name="clientEdit"
                                  className="form-horizontal"
                                  noValidate
                                  autoComplete="off"
                                  onSubmit={handleSubmit}
                                >
                                  <div className="row">
                                    <div className="col-sm-12">
                                      <h4>Add Cost & Durations</h4>
                                      <br />
                                      <FormGroup>
                                        <Col sm="4">
                                          <FormLabel>Staff</FormLabel>
                                          {addUpdate == "edit" ? (
                                            <FormControl
                                              as="select"
                                              name="staff"
                                              disabled
                                            >
                                              <option>
                                                {
                                                  editingData.variations
                                                    .resourceName
                                                }
                                              </option>
                                            </FormControl>
                                          ) : (
                                            <FormControl
                                              as="select"
                                              name="staff"
                                              onChange={(e: any) => {
                                                handleAddCostChange(e);
                                              }}
                                              onBlur={handleBlur}
                                            >
                                              {categoryDetails &&
                                                categoryDetails.length &&
                                                categoryDetails.map(
                                                  (category: any) => {
                                                    if (
                                                      category.id ==
                                                      params.categoryId
                                                    ) {
                                                      return (
                                                        <option value="addOns">
                                                          Select{" "}
                                                          {category.description}
                                                        </option>
                                                      );
                                                    }
                                                  }
                                                )}
                                              {staffData.map((val: any) => {
                                                return (
                                                  <option value={val.id}>
                                                    {val.name}
                                                  </option>
                                                );
                                              })}
                                            </FormControl>
                                          )}
                                        </Col>
                                        <Col sm="2">
                                          <FormLabel>Price (min 0.2)</FormLabel>
                                          <FormControl
                                            type="number"
                                            name="prices"
                                            value={values.prices}
                                            onChange={handleChange}
                                            placeholder="Price"
                                            onBlur={handleBlur}
                                          />
                                        </Col>
                                        <Col sm="2">
                                          <FormLabel>Active Time</FormLabel>
                                          <FormControl
                                            type="number"
                                            name="activetime"
                                            value={
                                              activeAddTime.time
                                                ? activeAddTime.time
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleAddActiveTime(
                                                e.target.value
                                              )
                                            }
                                            placeholder="Time"
                                            /* onChange={(e: any) => {
                                                                                        setLastName(e.target.value);
                                                                                          }} */
                                            onBlur={handleBlur}
                                          />
                                        </Col>
                                        <Col sm="2">
                                          <FormLabel>Processing Time</FormLabel>
                                          <FormControl
                                            type="text"
                                            name="processingAddTime"
                                            value={
                                              processingAddTime.time
                                                ? processingAddTime.time
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleAddProcessingTime(
                                                e.target.value
                                              )
                                            }
                                            placeholder="Time"
                                            /* onChange={(e: any) => { setLastName(e.target.value); }} */
                                            onBlur={handleBlur}
                                          />
                                        </Col>
                                        <Col sm="2">
                                          <FormLabel>
                                            Post Active Time
                                          </FormLabel>
                                          <FormControl
                                            type="text"
                                            name="secondActiveAddTime"
                                            value={
                                              secondActiveAddTime.time
                                                ? secondActiveAddTime.time
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleAddSecondActiveTime(
                                                e.target.value
                                              )
                                            }
                                            placeholder="Time"
                                            /* onChange={(e: any) => { setLastName(e.target.value); }} */
                                            onBlur={handleBlur}
                                          />
                                        </Col>
                                      </FormGroup>

                                      <div className="col-sm-12 text-right">
                                        {addUpdate == "add" ? (
                                          <div className="form-group">
                                            <div>
                                              <label>&nbsp;</label>
                                            </div>
                                            <button
                                              className="btn btn-info"
                                              type="button"
                                              onClick={() =>
                                                updateAddEdit(values)
                                              }
                                            >
                                              Reset
                                            </button>
                                            &nbsp;
                                            <button
                                              onClick={(e) => {
                                                setAddUpdate("add");
                                                setSubmitButton("add");
                                              }}
                                              className="btn btn-primary"
                                              type="submit"
                                              disabled={
                                                !(
                                                  values.id &&
                                                  values.id.length &&
                                                  values.prices >= 0.2 &&
                                                  activeAddTime.time
                                                )
                                              }
                                            >
                                              Add
                                              {UI.buttonLoading && (
                                                <i className="fa fa-spinner fa-spin"></i>
                                              )}
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="form-group">
                                            <div>
                                              <label>&nbsp;</label>
                                            </div>
                                            <button
                                              className="btn btn-info"
                                              type="button"
                                              onClick={(e) => {
                                                setAddUpdate("add");
                                                updateAddEdit(values);
                                              }}
                                            >
                                              Cancel
                                            </button>{" "}
                                            &nbsp;
                                            <button
                                              className="btn btn-success"
                                              type="submit"
                                              onClick={(e) => {
                                                setSubmitButton("update");
                                              }}
                                            >
                                              Update
                                              {UI.buttonLoading && (
                                                <i className="fa fa-spinner fa-spin"></i>
                                              )}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="hr-line-dashed"></div>
                                  <h4>Staff's Cost &amp; Durations List</h4>
                                  <br />
                                  <div className="table-responsive">
                                    <table className="table table-striped table-bordered table-condensed align-middle dataTables-example">
                                      <thead>
                                        <tr key="header">
                                          <th
                                            className={
                                              field != "displayName"
                                                ? "sorting"
                                                : orderBy
                                                ? "sorting_asc"
                                                : "sorting_desc"
                                            }
                                            onClick={(e) =>
                                              handleSortChange("displayName")
                                            }
                                          >
                                            Staff Name
                                          </th>
                                          <th
                                            className={
                                              field != "serviceName"
                                                ? "sorting"
                                                : orderBy
                                                ? "sorting_asc"
                                                : "sorting_desc"
                                            }
                                            onClick={(e) =>
                                              handleSortChange("serviceName")
                                            }
                                          >
                                            Service Name
                                          </th>
                                          <th
                                            className={
                                              field != "price"
                                                ? "sorting"
                                                : orderBy
                                                ? "sorting_asc"
                                                : "sorting_desc"
                                            }
                                            onClick={(e) =>
                                              handleSortChange("price")
                                            }
                                          >
                                            Price
                                          </th>
                                          <th
                                            className={
                                              field != "duration[0].time"
                                                ? "sorting"
                                                : orderBy
                                                ? "sorting_asc"
                                                : "sorting_desc"
                                            }
                                            onClick={(e) =>
                                              handleSortChange(
                                                "duration[0].time"
                                              )
                                            }
                                          >
                                            Active Time (mins)
                                          </th>
                                          <th
                                            className={
                                              field != "duration[1].time"
                                                ? "sorting"
                                                : orderBy
                                                ? "sorting_asc"
                                                : "sorting_desc"
                                            }
                                            onClick={(e) =>
                                              handleSortChange(
                                                "duration[1].time"
                                              )
                                            }
                                          >
                                            Processing Time (mins)
                                          </th>
                                          <th
                                            className={
                                              field != "duration[2].time"
                                                ? "sorting"
                                                : orderBy
                                                ? "sorting_asc"
                                                : "sorting_desc"
                                            }
                                            onClick={(e) =>
                                              handleSortChange(
                                                "duration[2].time"
                                              )
                                            }
                                          >
                                            Post Active Time (mins)
                                          </th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {!UI.buttonLoading &&
                                        serviceData &&
                                        serviceData.variations &&
                                        serviceData.variations.length ? (
                                          serviceData.variations.map(
                                            (value: any, index: any) => {
                                              return (
                                                <tr className="gradeX">
                                                  <td>{value.displayName}</td>
                                                  <td>{value.serviceName}</td>
                                                  <td className="text-center">
                                                    $
                                                    {commafy(
                                                      (
                                                        Math.round(
                                                          value.price * 100
                                                        ) / 10000
                                                      ).toFixed(2)
                                                    )}
                                                  </td>
                                                  <td className="text-center">
                                                    {value.duration[0].time}
                                                  </td>
                                                  <td className="text-center">
                                                    {value.duration[1].time}
                                                  </td>
                                                  <td className="text-center">
                                                    {value.duration[2].time}
                                                  </td>
                                                  <td className="text-center">
                                                    <a
                                                      style={{
                                                        cursor: "pointer",
                                                        color: "#2a6954",
                                                      }}
                                                      onClick={() => {
                                                        editAddCostData(
                                                          value,
                                                          index
                                                        );
                                                        setAddUpdate("edit");
                                                      }}
                                                    >
                                                      <i
                                                        title="View | Edit"
                                                        className="far fa-edit"
                                                      ></i>
                                                    </a>
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
                                                </tr>
                                              );
                                            }
                                          )
                                        ) : (
                                          <tr>
                                            <td
                                              colSpan={7}
                                              className="text-center"
                                            >
                                              No data
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </Form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  }}
                </Formik>
              </div>
              <DeleteModal
                title="Service"
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
  getAllService,
  getAllCategory,
  addServiceOfService,
  searchServiceService,
  getAllStaff,
  deleteAddCost,
  serviceAddCost,
  serviceUpdateAddCost,
  serviceUpdateService,
};

export default connect(null, mapActionsToProps)(Service);
