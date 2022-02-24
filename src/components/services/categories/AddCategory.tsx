import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import PageHeader from "../../core/PageHeader";
import {
  getAllCategory,
  addServiceCategory,
  getServiceCategory,
  updateServiceCategory,
} from "../../../redux/actions/serviceActions";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Form,
  Col,
  Row,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
} from "react-bootstrap";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Prompt } from "react-router";
import GppMaybeRoundedIcon from "@mui/icons-material/GppMaybeRounded";

const ServiceCategory = (props: any) => {
  const [title, setTitle] = useState("New Category");
  const history = useHistory();
  const [checkBoxValue, setCheckBoxValue] = useState(false);
  const [params, setParams] = useState({
    name: "",
    parentId: "",
    description: "",
    limitSeats: checkBoxValue,
    seats: 0,
    order: 0,
  });
  const [validationShape, setValidationShape] = useState({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Specialist Name is required"),
    seats: yup.number().min(1).required("Specialist Name is required"),
  });
  const [initialValidationShape] = useState({ ...validationShape });

  /* Get urlparams values */
  const view = window.location.href.includes("view");
  const urlParams = useParams();
  const id = urlParams.id;

  // From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const service = useSelector((state: any) => state.service);
  const serviceCategory = service.serviceCategory;
  const categoryDetails = service.categoryDetails;
  const bussinessId = localStorage.getItem("businessId");

  useEffect(() => {
    getAllCategory();
    if (view) {
      setTitle("Category View/Edit");
      let params = {
        businessId: bussinessId,
      };
      props.getServiceCategory(id, params);
    }
  }, [view]);

  useEffect(() => {
    if (view && Object.keys(serviceCategory).length !== 0) {
      setParams(serviceCategory);
    }
  }, [serviceCategory]);

  const getAllCategory = () => {
    const params = {
      businessId: localStorage.businessId,
    };
    props.getAllCategory(params);
  };

  //Error Toastification
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

  const handleSubmit = (values: any) => {
    values.businessId = bussinessId;
    if (!values.parentId) {
      delete values.parentId;
    }
    if (view) {
      props.updateServiceCategory(
        values,
        history,
        (success: any, data: any) => {
          if (success) {
            setFormChanged(false);
            history.push("/services/categories/");
          } else {
            notify(data);
          }
        }
      );
    } else {
      props.addServiceCategory(values, history, (success: any, data: any) => {
        if (success) {
          setFormChanged(false);
          history.push("/services/categories/");
        } else {
          notify(data);
        }
      });
    }
  };

  const [formChanged, setFormChanged] = useState(false);

  const myForm = document.getElementById("Categories");

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

  const handleCancel = (e: any) => {
    props.history.push("/services/categories/");
  };

  const handleParentChange = (e: any) => {
    let validation: any = {};
    if (e.target.value) {
      validation = {
        name: yup.string().required("Name is required"),
      };
    } else {
      validation = initialValidationShape;
    }
    setValidationShape(validation);
  };

  const basicFormSchema = yup.object().shape(validationShape);

  return (
    <React.Fragment>
      <Prompt
        when={formChanged}
        message="Are you sure you want to leave the page?"
      />
      {user.authenticated && !UI.loading && (
        <React.Fragment>
          <PageHeader title={title} />
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <div className="ibox float-e-margins">
                  <div className="ibox-content">
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
                      }) => {
                        return (
                          <Form
                            name="serviceCategory"
                            className="form-horizontal"
                            noValidate
                            id="Categories"
                            onChange={onChangeHandler}
                            autoComplete="off"
                            onSubmit={handleSubmit}
                          >
                            <Row>
                              <Col md="8">
                                <FormGroup>
                                  <FormLabel className="col-sm-4 control-label">
                                    Name
                                  </FormLabel>
                                  <Col sm="8">
                                    <FormControl
                                      type="text"
                                      name="name"
                                      value={values.name}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={errors.name && touched.name}
                                      style={
                                        values.name == "" ||
                                        values.name == undefined
                                          ? { border: "1px solid #ed5565" }
                                          : {}
                                      }
                                    />
                                  </Col>
                                </FormGroup>
                                {view == false ||
                                (view == true && values.parentId) ? (
                                  <React.Fragment>
                                    <FormGroup>
                                      <FormLabel className="col-sm-4 control-label text-left">
                                        Choose Parent Category{" "}
                                        <Tippy
                                          theme={"success"}
                                          maxWidth="225px"
                                          content={
                                            <div>
                                              <p>
                                                If it is the Parent, select
                                                nothing. If it is the
                                                sub-category, write in the name
                                                of the category under which it
                                                will appear.
                                              </p>
                                            </div>
                                          }
                                        >
                                          <i className="fa fa-question-circle"></i>
                                        </Tippy>
                                      </FormLabel>
                                      <Col sm="8">
                                        <FormControl
                                          as="select"
                                          name="parentId"
                                          value={values.parentId}
                                          // onChange={handleChange}
                                          onChange={(e: any) => {
                                            let event = {
                                              target: {
                                                name: "parentId",
                                                value: e,
                                              },
                                            };
                                            setParams({
                                              ...params,
                                              [event.target.name]:
                                                e.target.value,
                                            });
                                            handleParentChange(e);
                                          }}
                                          onBlur={handleBlur}
                                          style={{
                                            textTransform: "capitalize",
                                            width: "100%",
                                            float: "left",
                                          }}
                                        >
                                          <option value="">- -</option>
                                          {categoryDetails &&
                                            categoryDetails.length &&
                                            categoryDetails.map(
                                              (category: any) => {
                                                return (
                                                  <option value={category.id}>
                                                    {category.name}
                                                  </option>
                                                );
                                              }
                                            )}
                                        </FormControl>
                                      </Col>
                                    </FormGroup>
                                  </React.Fragment>
                                ) : (
                                  <></>
                                )}
                                {!values.parentId ? (
                                  <FormGroup>
                                    <FormLabel className="col-sm-4 control-label">
                                      Specialist Name{" "}
                                      <Tippy
                                        theme={"success"}
                                        maxWidth="225px"
                                        content={
                                          <div>
                                            <p>
                                              This is what the service provider
                                              is called; e.g., esthetician for
                                              facials and lashes,, nail tech for
                                              nails, hair stylist for hair.
                                            </p>
                                          </div>
                                        }
                                      >
                                        <i className="fa fa-question-circle"></i>
                                      </Tippy>
                                    </FormLabel>
                                    <Col sm="8">
                                      <FormControl
                                        type="text"
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                          errors.description &&
                                          touched.description
                                        }
                                        style={
                                          values.description == "" ||
                                          values.description == undefined
                                            ? { border: "1px solid #ed5565" }
                                            : {}
                                        }
                                      />
                                    </Col>
                                  </FormGroup>
                                ) : (
                                  <FormGroup>
                                    <FormLabel className="col-sm-4 control-label">
                                      Does this sub-category have limited
                                      “seats”?
                                    </FormLabel>
                                    <Col sm="8" style={{ padding: "7px 15px" }}>
                                      <input
                                        type="checkbox"
                                        name="limitSeats"
                                        checked={checkBoxValue}
                                        onChange={(e: any) => {
                                          setCheckBoxValue(!checkBoxValue);
                                        }}
                                        onBlur={handleBlur}
                                        isInvalid={
                                          errors.limitSeats &&
                                          touched.limitSeats
                                        }
                                      />
                                    </Col>
                                  </FormGroup>
                                )}
                                {((values.parentId && checkBoxValue) ||
                                  !values.parentId) && (
                                  <FormGroup>
                                    <FormLabel className="col-sm-4 control-label">
                                      Seats{" "}
                                      <Tippy
                                        theme={"success"}
                                        maxWidth="225px"
                                        content={
                                          <div>
                                            <p>
                                              How many spaces do you have to
                                              provide this category?{" "}
                                            </p>
                                            <p>
                                              If subcategory: does this have a
                                              separate number of seats from the
                                              main category.
                                            </p>
                                            <p>
                                              For example: only having one
                                              HydraFacial machine under the Face
                                              / Facials Parent Category or one
                                              room to do waxing.{" "}
                                            </p>
                                          </div>
                                        }
                                      >
                                        <i className="fa fa-question-circle"></i>
                                      </Tippy>
                                    </FormLabel>
                                    <Col sm="8">
                                      <FormControl
                                        type="number"
                                        name="seats"
                                        value={values.seats}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                          errors.seats && touched.seats
                                        }
                                        style={
                                          values.seats.toString() == "" ||
                                          values.seats == undefined
                                            ? { border: "1px solid #ed5565" }
                                            : {}
                                        }
                                      />
                                    </Col>
                                  </FormGroup>
                                )}
                                {values.parentId && (
                                  <FormGroup>
                                    <FormLabel className="col-sm-4 control-label">
                                      Sort order (min 0)
                                    </FormLabel>
                                    <Col sm="8">
                                      <FormControl
                                        type="number"
                                        name="order"
                                        value={values.order}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                          errors.order && touched.order
                                        }
                                      />
                                    </Col>
                                  </FormGroup>
                                )}
                              </Col>
                            </Row>
                            <div className="hr-line-dashed" />
                            <Row>
                              <Col md="8">
                                <FormGroup>
                                  <Col sm="8" className="col-sm-offset-4">
                                    <Button
                                      variant="white"
                                      type="button"
                                      onClick={(e) => handleCancel(e)}
                                    >
                                      Cancel
                                    </Button>
                                    &nbsp;
                                    <Button
                                      variant="primary"
                                      type="submit"
                                      disabled={
                                        !(
                                          values.name &&
                                          values.name.length &&
                                          values.description &&
                                          values.description.length &&
                                          values.seats > 0 &&
                                          values.seats.toString().length
                                        )
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
      )}
    </React.Fragment>
  );
};

const mapActionsToProps = {
  getAllCategory,
  getServiceCategory,
  addServiceCategory,
  updateServiceCategory,
};

export default connect(null, mapActionsToProps)(ServiceCategory);
