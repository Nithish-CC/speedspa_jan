import { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageHeader from "../../core/PageHeader";
import { StateList } from "../../../utils/StateList";
import * as yup from "yup";
import { Formik } from "formik";
import {
  Form,
  Col,
  Row,
  FormControl,
  FormGroup,
  FormLabel,Table
} from "react-bootstrap";
import {
  addClient,
  updateClient,
  getClientDetails,
} from "../../../redux/actions/clientActions";

const AddProductCategories = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title, setTitle] = useState("New Client");
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

  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const clientInfo = user.clientInfo;

  /* Get urlparams values */
  const view = window.location.href.includes("view");
  const urlParams = useParams();
  const id = urlParams.id;

  useEffect(() => {
    if (view) {
      setTitle("Client Details");
      let params = {
        businessId: localStorage.getItem("businessId"),
      };
      props.getClientDetails(id, params);
    }
  }, [view]);

  useEffect(() => {
    if (view && Object.keys(clientInfo).length !== 0) {
      setClient(clientInfo);
    }
  }, [clientInfo]);

  const handleSubmit = (values: any) => {
    values.dob = new Date(
      values.dob.month + "/" + values.dob.day + "/" + "2000"
    );
    if (view) {
      props.updateClient(values);
    } else {
      props.addClient(values);
    }
  };

  const handleCancel = (e: any) => {
    props.history.push("/clients");
  };

  const basicFormSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    phoneNumber: yup.string().required("Phone Number is required"),
  });

  return (
    <>
      {user.authenticated && !UI.loading ? (
        <>
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
                      href="#product"
                      role="tab"
                      aria-controls="client"
                      aria-selected="true"
                    >
                      Product Info
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      id="booking-tab"
                      data-toggle="tab"
                      href="#data"
                      role="tab"
                      aria-controls="booking"
                      aria-selected="false"
                    >
                      Data
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      id="product-tab"
                      data-toggle="tab"
                      href="#images"
                      role="tab"
                      aria-controls="product"
                      aria-selected="false"
                    >
                      Images
                    </a>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                  <div
                    className="tab-pane active"
                    id="product"
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
                      }) => {
                        return (
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
                                    <Col md="6">
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Name
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            name="Name"
                                            placeholder="Name"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                              errors.firstName &&
                                              touched.firstName
                                            }
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Caption
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            name="Caption"
                                            placeholder="Caption"
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
                                          Categories (at least 1):
                                        </FormLabel>
                                        <Col sm="8"></Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Price (min 0.2)
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="number"
                                            name="price"
                                            placeholder="Price (min 0.2)"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                              errors.firstName &&
                                              touched.firstName
                                            }
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          In Our Opinion
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            as="textarea"
                                            name="Opinion"
                                            placeholder="In Our Opinion"
                                            value={values.notes}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            style={{ height: "112px" }}
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Description (not more that 1000
                                          characters)
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            as="textarea"
                                            name="Description (not more that 1000 characters)"
                                            placeholder="Description (not more that 1000 characters)"
                                            value={values.notes}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            style={{ height: "112px" }}
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Meta Tag Title
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            name="Meta Tag Title"
                                            placeholder="Meta Tag Title"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                              errors.firstName &&
                                              touched.firstName
                                            }
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Meta Tag Description
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            name="Meta Tag Description"
                                            placeholder="Meta Tag Description"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                              errors.firstName &&
                                              touched.firstName
                                            }
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Meta Tag Keywords
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            name="Meta Tag Keywords"
                                            placeholder="Meta Tag Keywords"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                              errors.firstName &&
                                              touched.firstName
                                            }
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
                                        >
                                          Save Changes
                                          {/* <i className="fa fa-spinner fa-spin"></i> */}
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
                  <div
                    className="tab-pane"
                    id="data"
                    role="tabpanel"
                    aria-labelledby="booking-tab"
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
                      }) => {
                        return (
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
                                    <Col md="6">
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Modal
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            name="Model"
                                            placeholder=""
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                              errors.firstName &&
                                              touched.firstName
                                            }
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Location
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            name="Location"
                                            placeholder="Caption"
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
                                          Tac Class
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="text"
                                            name="Tac Class"
                                            placeholder="Caption"
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
                                          Quantity
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="number"
                                            name="Quantity"
                                            placeholder=""
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                              errors.firstName &&
                                              touched.firstName
                                            }
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Minimum Quantity
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="number"
                                            name="Minimum Quantity"
                                            placeholder=""
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                              errors.firstName &&
                                              touched.firstName
                                            }
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Sort Order
                                        </FormLabel>
                                        <Col sm="8">
                                          <FormControl
                                            type="number"
                                            name="Sort Order"
                                            placeholder=""
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={
                                              errors.firstName &&
                                              touched.firstName
                                            }
                                          />
                                        </Col>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel className="col-sm-4 control-label">
                                          Status (active if checked)
                                        </FormLabel>
                                        <Col sm="8">
                                          <div
                                            style={{
                                              padding: "15px 0px 0px 0px",
                                            }}
                                          >
                                            <Form.Check aria-label="option 1" />
                                          </div>
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
                                        >
                                          Save Changes
                                          {/* <i className="fa fa-spinner fa-spin"></i> */}
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
                  <div
                    className="tab-pane"
                    id="images"
                    role="tabpanel"
                    aria-labelledby="product-tab"
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
                      }) => {
                        return (
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
                                    <Col md="6">
                                      <Table striped bordered hover size="sm">
                                        <thead>
                                          <tr>
											  <th>Image preview</th>
                                              <th style={{display:'none'}}>Image url</th>
                                              <th>Sort order</th>
                                              <th>Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td>1</td>
                                            <td style={{display:'none'}}>Mark</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                          </tr>
                                        </tbody>
                                      </Table>
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
                                          className="btn btn-primary"
                                          type="submit"
                                        >
                                          Save Changes
                                          {/* <i className="fa fa-spinner fa-spin"></i> */}
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

const mapActionsToProps = {
  addClient,
  updateClient,
  getClientDetails,
};

export default connect(null, mapActionsToProps)(AddProductCategories);
