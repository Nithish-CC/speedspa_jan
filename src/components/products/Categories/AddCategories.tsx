import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import PageHeader from "../../core/PageHeader";
import * as yup from "yup";
import { Formik } from "formik";
import {
  Form,
  Col,
  Row,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import {
  addProductCategory,
  getProductCategory,
  updateProductCategory,
} from "../../../redux/actions/productAction";

const Addcategories = (props: any) => {
  const [title, setTitle] = useState("New Category");
  const history = useHistory();
  const [productCatergory, setproductCatergory] = useState({
    name: "",
    parentId: "",
  });

  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const product = useSelector((state: any) => state.product);
  const productCategory = product.productCategory;

  /* Get urlparams values */
  const view = window.location.href.includes("view");
  const urlParams = useParams();
  const id = urlParams.id;
  const bussinessId = localStorage.getItem("businessId");

  useEffect(() => {
    if (view) {
      setTitle("Category View/Edit");
      let params = {
        businessId: bussinessId,
      };
      props.getProductCategory(id, params);
    }
  }, [view]);

  useEffect(() => {
    if (view && Object.keys(productCategory).length !== 0) {
      setproductCatergory(productCategory);
    }
  }, [productCategory]);
  
  const handleSubmit = (values: any) => {
    values.businessId = bussinessId;
    if (!values.parentId) {
      delete values.parentId;
    }
    if (view) {
      props.updateProductCategory(values, history);
    } else {
      props.addProductCategory(values, history);
    }
  };

  const handleCancel = (e: any) => {
    props.history.push("/products/categories/");
  };

  const basicFormSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
  });

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading && (
        <React.Fragment>
          <PageHeader title={title} />
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <div className="ibox float-e-margins">
                  <div className="ibox-content">
                    <Formik
                      initialValues={{ ...productCatergory }}
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
                            name="productCategory"
                            className="form-horizontal"
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                          >
                            <Row>
                              <Col md="8">
                                {UI.errors && UI.errors.message && (
                                  <div className="text-danger m-t-md m-b-md">
                                    Can not save your data. {UI.errors.message}
                                  </div>
                                )}
                              </Col>
                            </Row>
                            <Row>
                              <Col md="8">
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Name
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="name"
                                      value={values.name}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={errors.name && touched.name}
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Choose Parent Category:
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      as="select"
                                      name="parentId"
                                      value={values.parentId}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      style={{
                                        textTransform: "capitalize",
                                        width: "100%",
                                        float: "left",
                                      }}
                                    >
                                      <option value="">--</option>
                                      {product.productCategories &&
                                        product.productCategories.length &&
                                        product.productCategories.map(
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
  addProductCategory,
  getProductCategory,
  updateProductCategory,
};

export default connect(null, mapActionsToProps)(Addcategories);
