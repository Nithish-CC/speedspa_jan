import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import PageHeader from "../../core/PageHeader";
import { useHistory, useParams } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import {
  addProductProduct,
  getProductProductView,
  getProductProductUpdate,
  getAllProductCategories,
} from "../../../redux/actions/productAction";
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
import TreeView from "deni-react-treeview";
import { uploadImage, getImageFile } from "../../../redux/actions/staffActions";
import { ToastContainer, toast } from "react-toastify";
import { Prompt } from "react-router";
import GppMaybeRoundedIcon from "@mui/icons-material/GppMaybeRounded";

const Product = (props: any) => {
  //useState

  const [avatarImg, setAvatarImg] = useState("");
  const [imgValKeys, setImgValKeys] = useState("");
  const [title, setTitle] = useState("New Product");
  const Title = {
    title: title,
  };
  const [stopLoading, setStopLoading] = useState("loading");
  const [buttonSubmit, setButtonSubmit] = useState("tosubmit");
  const [imageButtonHandle, setImageButtonHandle] = useState("Click Add");
  let checkData: any[] = [];
  const [imageToUpload, setImageToUpload] = useState([]);
  const [imageSortUrl, setImageSortUrl] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any>([]);
  const [validationShape, setValidationShape] = useState({
    name: yup.string().required("Name is required"),
    description: yup.string().required("description is required"),
    caption: yup.string().required("caption is required"),
    price: yup.number().min(0.2).required("price is required"),
  });
  const productValues = {
    active: true,
    businessId: "",
    caption: "",
    categoriesIds: [],
    description: "",
    images: [],
    location: "",
    metaTagDescription: "",
    metaTagKeywords: "",
    metaTagTitle: "",
    minQuantity: 1,
    opinion: "",
    model: "",
    name: "",
    price: 0.2,
    quantity: 0,
    sortOrder: 0,
    taxClass: "",
    excludeInvCalc: false,
  };
  const [active, setActive] = useState(true);
  const [excludeInvCalc, SetExcludeInvCalc] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [params, setParams] = useState({ ...productValues });
  const [initialValidationShape] = useState({ ...validationShape });
  const basicFormSchema = yup.object().shape(validationShape);

  //form tag element for onbeforeunload

  const myForm = document.getElementById("product");

  //useparams and useHistory

  const history = useHistory();
  const urlParams = useParams();
  const id = urlParams.id;

  //Form Localstorage

  const bussinessId = localStorage.getItem("businessId");

  //Location

  const view = window.location.href.includes("view");

  //useSelector

  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const product = useSelector((state: any) => state.product);
  const productCategories = product.productCategories;
  const getProductProductView = product.getProductProductView;
  const getAllCategories = product.getAllCategories;

  //final sorted image

  let checkDataUrl: any[] = [];
  const [checkurl, setCheckUrl] = useState<any[]>([]);

  //uploaded image

  let imageBySortUrl: any[] = [];
  let imageButtonHandleClick = "Click Add";

  //User uploading image

  let imageToUploadUrl: any[] = [];
  let stopLoadingUi = "loading";

  //useEffect

  useEffect(() => {
    if (getProductProductView && view == true) {
      let priceVal = getProductProductView.price / 100;
      getProductProductView.price = priceVal;
      setActive(getProductProductView.active);
      SetExcludeInvCalc(getProductProductView.excludeInvCalc);
      setCheckUrl(getProductProductView.images);
      setParams(getProductProductView);
      if (
        getProductProductView.images &&
        getProductProductView.images.length &&
        view == true
      ) {
        getProductProductView.images.forEach((url: any, index: any) => {
          imgPass(url);
        });
      }
    }
  }, [getProductProductView]);

  useEffect(() => {
    let params = {
      businessId: bussinessId,
    };
    if (view) {
      setTitle("Product View/Edit");
      props.getProductProductView(id, params);
    } else {
      setParams(productValues);
    }
    props.getAllProductCategories(params);
    checkDataUrl = [];
    setImageSortUrl([]);
  }, [view]);

  useEffect(() => {
    setCategoriesData(categoriesToData(getAllCategories, 0));
  }, [getAllCategories]);

  //function call

  //Form Onbefore loading

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

  //splittng Id for the categories

  const categoriesIdFunc = (data: any) => {
    let temp: any[] = [];
    data.forEach((element: any) => {
      temp.push(element.id);
    });
    return temp;
  };

  //When form is submitted

  const handleSubmit = (values: any) => {
    values.businessId = bussinessId;
    values.active = active;
    values.categoriesIds = categoriesIdFunc(checkData);
    values.excludeInvCalc = excludeInvCalc;
    values.price = values.price * 100;
    values.images = checkDataUrl;
    if (view) {
      props.getProductProductUpdate(
        values,
        history,
        (success: any, data: any) => {
          if (success) {
            setFormChanged(false);
            history.push("/products");
          } else {
            notify(data);
          }
        }
      );
    } else {
      props.addProductProduct(values, history, (success: any, data: any) => {
        if (success) {
          setFormChanged(false);
          history.push("/products");
        } else {
          notify(data);
        }
      });
    }
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

  // Tree Selection Start

  const categoriesToData = (categories: any, level: any) => {
    var data = _.chain(categories)
      .map(function (value, key) {
        value.text = value.name;
        value.expanded = true;
        if (params.categoriesIds && params.categoriesIds.length > 0) {
          if (
            _.find(params.categoriesIds, function (id) {
              return id == value.id;
            })
          ) {
            value.selected = true;
            value.isLeaf = true;
            value.state = 1;
            checkData.push(value);
          } else {
            value.selected = false;
          }
        } else {
          value.selected = false;
        }
        if (!value.subcategories) value.children = [];
        return _.transform(value, function (result: any, value: any, key: any) {
          if (key === "subcategories") {
            var nLevel = level + 1;
            if (value) {
              value.forEach((element: any) => {
                result["text"] = element.name;
              });
            }
            result["children"] = categoriesToData(value, nLevel);
            result["isLeaf"] = true;
            result["Ordata"] = value;
          } else if (key === "name") {
            result["value"] = value;
            result["label"] = value;
          } else {
            result[key] = value;
          }
        });
      })
      .value();

    return data;
  };

  //When tree checked

  const onChangeTreeSelect = async (currentNode: any) => {
    parentHasChild(currentNode, checkData);
  };

  const parentHasChild = async (parentValue: any, checkData: any) => {
    removeDuplicates(parentValue);
    if (parentValue.state == 1) {
      checkData.push(parentValue);
    }

    if (parentValue.children && parentValue.children.length > 0) {
      childrenHasChild(parentValue, checkData);
    }
  };

  const childrenHasChild = (parentValue: any, checkData: any) => {
    parentValue.children.forEach((children: any) => {
      removeDuplicates(children);
      if (children.state == 1) {
        checkData.push(children);
      }
      if (children.children && children.children.length > 0) {
        childrenHasChild(children, checkData);
      }
    });
  };

  const removeDuplicates = (parentValue: any) => {
    let isExist = checkData.findIndex(
      (element: any) => element.id == parentValue.id
    );
    if (isExist >= 0) checkData.splice(isExist, 1);
  };

  // Image Tab

  const imgSortView = (e: any, key: any) => {
    const productData = [...imageSortUrl];
    productData[key].index = Number(e.target.value);
    setImageSortUrl(productData);
  };

  const imgPass = (image: any) => {
    imageSortUrl.push({ image: image, index: imageSortUrl.length + 1 });
  };

  const _arrayBufferToBase64 = (buffer: any) => {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const uploadFileImage = (files: any) => {
    const imageToSave = new FormData();
    imageToSave.append("input", files[0]);
    props.uploadImage(imageToSave, (success: any, key: any, url: any) => {
      if (success) {
        getImageFileData(key);
        imgPass(url);
        setStopLoading("no loading");
      }
    });
  };

  const getImageFileData = (imageName: any) => {
    setImgValKeys(imageName);
    let values = {
      imageName: imageName,
    };
    let bussinesId = {
      bussinessId: bussinessId,
    };
    props.getImageFile(values, bussinesId, (success: any, valres: any) => {
      if (success) {
        let imageURL = getImageURL(valres);
        let avatar_image =
          "data:image/png;base64," + _arrayBufferToBase64(imageURL);
        setAvatarImg(avatar_image);
      }
    });
  };

  const getImageURL = (res: any) => {
    return res.data.Body.data;
  };

  const Sortable = (imageSortUrl: any) => {
    const sortedValues = imageSortUrl.sort(function (a: any, b: any) {
      return a.index - b.index;
    });
    const tempArr: any[] = [];
    sortedValues.forEach((element: any) => {
      tempArr.push(element.image);
    });
    setCheckUrl(tempArr);
    setImageSortUrl(imageSortUrl);
  };

  const handleRemoveImage = (index: any) => {
    imageSortUrl.splice(index, 1);
    Sortable(imageSortUrl);
  };

  return (
    <React.Fragment>
      <Prompt
        when={formChanged}
        message="Are you sure you want to leave the page?"
      />
      {user.authenticated && !UI.loading && (
        <React.Fragment>
          <PageHeader {...Title} />
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight bg-light">
                <div className="ibox float-e-margins">
                  <div className="ibox-content">
                    <ul
                      className="nav nav-tabs"
                      style={{ backgroundColor: "#fff" }}
                      id="myTab"
                      role="tablist"
                    >
                      <li className="nav-item active ">
                        <a
                          className="nav-link"
                          id="client-tab"
                          data-toggle="tab"
                          href="#client"
                          role="tab"
                          aria-controls="client"
                          aria-selected="true"
                        >
                          Product Info
                        </a>
                      </li>
                      <li className="nav-item bg-white">
                        <a
                          className="nav-link"
                          id="Staff-tab"
                          data-toggle="tab"
                          href="#Staff"
                          role="tab"
                          aria-controls="Staff"
                          aria-selected="false"
                        >
                          Data
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          id="image-tab"
                          data-toggle="tab"
                          href="#image"
                          role="tab"
                          aria-controls="image"
                          aria-selected="false"
                        >
                          Images
                        </a>
                      </li>
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
                                  id="product"
                                  onChange={onChangeHandler}
                                  className="form-horizontal"
                                  noValidate
                                  autoComplete="off"
                                  onSubmit={handleSubmit}
                                >
                                  <div className="no-border">
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
                                                isInvalid={
                                                  errors.name && touched.name
                                                }
                                                style={
                                                  values.name &&
                                                  values.name.length
                                                    ? {}
                                                    : {
                                                        border:
                                                          "1px solid #ed5565",
                                                      }
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
                                                name="caption"
                                                value={values.caption}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                  errors.caption &&
                                                  touched.caption
                                                }
                                                style={
                                                  values.caption &&
                                                  values.caption.length
                                                    ? {}
                                                    : {
                                                        border:
                                                          "1px solid #ed5565",
                                                      }
                                                }
                                              />
                                            </Col>
                                          </FormGroup>
                                          {console.log(checkData)}
                                          <FormGroup>
                                            <FormLabel className="col-sm-4 control-label">
                                              Categories (at least 1):
                                            </FormLabel>
                                            <Col sm="8">
                                              <TreeView
                                                showCheckbox={true}
                                                showIcon={false}
                                                onCheckItem={onChangeTreeSelect}
                                                theme="classic"
                                                selectRow={false}
                                                items={categoriesData}
                                              />
                                            </Col>
                                          </FormGroup>
                                          <FormGroup>
                                            <FormLabel className="col-sm-4 control-label">
                                              Price (min 0.2)
                                            </FormLabel>
                                            <Col sm="8">
                                              <FormControl
                                                type="number"
                                                name="price"
                                                value={values.price}
                                                onChange={handleChange}
                                                placeholder="Price"
                                                onBlur={handleBlur}
                                                isInvalid={
                                                  errors.price && touched.price
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
                                                name="opinion"
                                                value={values.opinion}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
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
                                                name="description"
                                                value={values.description}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                  errors.description &&
                                                  touched.description
                                                }
                                                style={
                                                  values.description &&
                                                  values.description.length
                                                    ? {}
                                                    : {
                                                        border:
                                                          "1px solid #ed5565",
                                                      }
                                                }
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
                                                name="metaTagTitle"
                                                value={values.metaTagTitle}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
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
                                                name="metaTagDescription"
                                                value={
                                                  values.metaTagDescription
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
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
                                                name="metaTagKeywords"
                                                value={values.metaTagKeywords}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                            </Col>
                                          </FormGroup>
                                          <FormGroup>
                                            <FormLabel className="col-sm-4 control-label">
                                              Should we EXCLUDE this product
                                              from the inventory dollar count?
                                            </FormLabel>
                                            <Col sm="8">
                                              <input
                                                type="checkbox"
                                                name="excludeInvCalc"
                                                //checked={true}
                                                checked={values.excludeInvCalc}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                              />
                                            </Col>
                                          </FormGroup>
                                        </Col>
                                      </Row>
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
                                              <Button
                                                variant="white"
                                                type="button"
                                                onClick={() =>
                                                  props.history.push(
                                                    "/products"
                                                  )
                                                }
                                              >
                                                Cancel
                                              </Button>
                                              &nbsp;
                                              <button
                                                className="btn btn-primary"
                                                type="submit"
                                                disabled={
                                                  !(
                                                    values.name &&
                                                    values.name.length &&
                                                    checkData &&
                                                    checkData.length &&
                                                    values.caption &&
                                                    values.caption.length &&
                                                    values.price >= 0.2 &&
                                                    values.description &&
                                                    values.description.length
                                                  )
                                                }
                                              >
                                                Save Changes
                                                {UI.buttonLoading && (
                                                  <i className="fa fa-spinner fa-spin"></i>
                                                )}
                                              </button>
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
                                <Form
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
                                            {view && (
                                              <FormGroup>
                                                <FormLabel className="col-sm-4 control-label">
                                                  ID
                                                </FormLabel>
                                                <Col sm="8">
                                                  <FormControl
                                                    type="text"
                                                    name="id"
                                                    value={values.id}
                                                    disabled
                                                  />
                                                </Col>
                                              </FormGroup>
                                            )}
                                            <FormGroup>
                                              <FormLabel className="col-sm-4 control-label">
                                                Model
                                              </FormLabel>
                                              <Col sm="8">
                                                <FormControl
                                                  type="text"
                                                  name="model"
                                                  value={values.model}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
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
                                                  name="location"
                                                  value={values.location}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                              </Col>
                                            </FormGroup>
                                            <FormGroup>
                                              <FormLabel className="col-sm-4 control-label">
                                                Tax Class
                                              </FormLabel>
                                              <Col sm="8">
                                                <FormControl
                                                  type="text"
                                                  name="taxClass"
                                                  value={values.taxClass}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
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
                                                  name="quantity"
                                                  value={values.quantity}
                                                  onChange={handleChange}
                                                  placeholder="quantity"
                                                  onBlur={handleBlur}
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
                                                  name="minQuantity"
                                                  value={values.minQuantity}
                                                  onChange={handleChange}
                                                  placeholder="minQuantity"
                                                  onBlur={handleBlur}
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
                                                  name="sortOrder"
                                                  value={values.sortOrder}
                                                  onChange={handleChange}
                                                  placeholder="sortOrder"
                                                  onBlur={handleBlur}
                                                />
                                              </Col>
                                            </FormGroup>
                                            <FormGroup>
                                              <FormLabel className="col-sm-4 control-label">
                                                Status (active if checked)
                                              </FormLabel>
                                              <Col sm="8">
                                                <input
                                                  type="checkbox"
                                                  name="active"
                                                  checked={active}
                                                  onChange={() =>
                                                    setActive(!active)
                                                  }
                                                  onBlur={handleBlur}
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
                                              <Button
                                                variant="white"
                                                type="button"
                                                onClick={() =>
                                                  props.history.push(
                                                    "/products"
                                                  )
                                                }
                                              >
                                                Cancel
                                              </Button>
                                              &nbsp;
                                              <button
                                                className="btn btn-primary"
                                                type="submit"
                                                disabled={
                                                  !(
                                                    values.name &&
                                                    values.name.length &&
                                                    checkData &&
                                                    checkData.length &&
                                                    values.caption &&
                                                    values.caption.length &&
                                                    values.price >= 0.2 &&
                                                    values.description &&
                                                    values.description.length
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
                              </div>

                              <div
                                className="tab-pane"
                                id="image"
                                role="tabpanel"
                                aria-labelledby="image-tab"
                              >
                                <Form
                                  className="form-horizontal"
                                  noValidate
                                  autoComplete="off"
                                  onSubmit={handleSubmit}
                                >
                                  <div className="ibox float-e-margins m-b-none">
                                    <div className="ibox-content no-border">
                                      <div className="m-t-md">
                                        <Row>
                                          <Col sm="12">
                                            <div className="row">
                                              <div className="col-md-6">
                                                <table className="table table-striped table-bordered table-hover dataTables-example">
                                                  <thead>
                                                    <tr>
                                                      <th
                                                        style={{
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        Image preview
                                                      </th>
                                                      <th
                                                        style={{
                                                          display: "none",
                                                        }}
                                                      >
                                                        Image url
                                                      </th>
                                                      <th
                                                        style={{
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        Sort order
                                                      </th>
                                                      <th
                                                        style={{
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        Actions
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {imageSortUrl &&
                                                    imageSortUrl.length ? (
                                                      imageSortUrl.map(
                                                        (
                                                          url: any,
                                                          key: any
                                                        ) => {
                                                          return (
                                                            <tr>
                                                              <td
                                                                style={{
                                                                  textAlign:
                                                                    "center",
                                                                }}
                                                              >
                                                                <img
                                                                  id={`image_${key}`}
                                                                  border="0"
                                                                  align=""
                                                                  width="200"
                                                                  height="200"
                                                                  style={{
                                                                    width:
                                                                      "100px",
                                                                    height:
                                                                      "auto",
                                                                  }}
                                                                  src={
                                                                    url.image
                                                                  }
                                                                />
                                                              </td>
                                                              <td
                                                                style={{
                                                                  display:
                                                                    "none",
                                                                }}
                                                              >
                                                                <input
                                                                  type="text"
                                                                  className="form-control"
                                                                  disabled
                                                                />
                                                              </td>
                                                              <td
                                                                style={{
                                                                  width:
                                                                    "100px",
                                                                  textAlign:
                                                                    "center",
                                                                }}
                                                              >
                                                                <input
                                                                  type="number"
                                                                  className="form-control"
                                                                  name={`image_${key}`}
                                                                  value={
                                                                    url.index
                                                                  }
                                                                  onChange={(
                                                                    e: any
                                                                  ) =>
                                                                    imgSortView(
                                                                      e,
                                                                      key
                                                                    )
                                                                  }
                                                                />
                                                              </td>
                                                              <td
                                                                style={{
                                                                  width:
                                                                    "100px",
                                                                  textAlign:
                                                                    "center",
                                                                }}
                                                              >
                                                                <button
                                                                  className="btn btn-white"
                                                                  type="button"
                                                                  onClick={(
                                                                    e
                                                                  ) =>
                                                                    handleRemoveImage(
                                                                      key
                                                                    )
                                                                  }
                                                                >
                                                                  <i className="fa fa-trash" />
                                                                </button>
                                                              </td>
                                                            </tr>
                                                          );
                                                        }
                                                      )
                                                    ) : (
                                                      <React.Fragment></React.Fragment>
                                                    )}
                                                  </tbody>
                                                </table>

                                                {imageButtonHandle ==
                                                  "image upload" && (
                                                  <div className="form-group">
                                                    <div className="col-sm-6">
                                                      <input
                                                        type="file"
                                                        className="form-control"
                                                        id="fileToUpload"
                                                        onChange={(event) => {
                                                          //setImageToUpload(event.target.files);
                                                          imageToUploadUrl =
                                                            event.target.files;
                                                        }}
                                                      />
                                                    </div>
                                                    <div className="col-sm-6 text-right">
                                                      <button
                                                        className="btn btn-white"
                                                        type="button"
                                                        onClick={(event) =>
                                                          uploadFileImage(
                                                            imageToUploadUrl
                                                          )
                                                        }
                                                      >
                                                        Upload image
                                                        {UI.buttonLoading && (
                                                          <React.Fragment>
                                                            <i className="fa fa-spinner fa-spin"></i>
                                                          </React.Fragment>
                                                        )}
                                                        {!UI.buttonLoading &&
                                                          stopLoading ==
                                                            "no loading" &&
                                                          setImageButtonHandle(
                                                            "Click Add"
                                                          )}
                                                      </button>
                                                      &nbsp;
                                                      <button
                                                        className="btn btn-white"
                                                        type="button"
                                                        onClick={(e: any) => {
                                                          setImageButtonHandle(
                                                            "Click Add"
                                                          );
                                                        }}
                                                      >
                                                        Cancel
                                                      </button>
                                                    </div>
                                                  </div>
                                                )}
                                                {imageButtonHandle ==
                                                  "Click Add" && (
                                                  <div className="form-group">
                                                    <div className="col-sm-12 text-right">
                                                      <button
                                                        className="btn btn-white"
                                                        type="button"
                                                        onClick={() => {
                                                          setImageButtonHandle(
                                                            "image upload"
                                                          );
                                                          setStopLoading(
                                                            "loading"
                                                          );
                                                        }}
                                                      >
                                                        Add image
                                                      </button>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
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
                                                onClick={(e) => {
                                                  Sortable(imageSortUrl);
                                                  setButtonSubmit("submit");
                                                }}
                                                disabled={
                                                  !(
                                                    values.name &&
                                                    values.name.length &&
                                                    values.caption &&
                                                    values.caption.length &&
                                                    values.price >= 0.2 &&
                                                    values.description &&
                                                    values.description.length
                                                  )
                                                }
                                              >
                                                Save Changes
                                                {UI.buttonLoading &&
                                                  buttonSubmit == "submit" && (
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
                              </div>
                            </div>
                          </React.Fragment>
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
  addProductProduct,
  uploadImage,
  getImageFile,
  getProductProductView,
  getProductProductUpdate,
  getAllProductCategories,
};

export default connect(null, mapActionsToProps)(Product);
