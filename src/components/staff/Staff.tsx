import React, { useEffect, useState } from "react";
import { StateList } from "./../../utils/StateList";
import { Formik } from "formik";
import { ColorCode } from "./../../utils/ColorCodeList";
import { connect, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
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
  addStaff,
  getStaffDetails,
  updateClient,
  addResourceServices,
  updateResourceServices,
  uploadImage,
  getImageFile,
} from "../../redux/actions/staffActions";
import {
  getRootServiceCategory,
  getAllService,
  updateStaffServiceResource,
  addServiceCategory,
  getAllStaffResources,
  addStaffCategory,
} from "../../redux/actions/serviceActions";
import "../../scss/style.scss";
import _ from "lodash";
import * as yup from "yup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import PageHeader from "../core/PageHeader";
import NumberFormat from "react-number-format";

const Staff = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title, setTitle] = useState("New Staff");
  const history = useHistory();
  const [resultFilterCategory, setResultFilterCategory] = useState<any[]>([]);
  const [selectedMultiOptions, setSelectedMultiOptions] = useState([]);
  const [selectedMultiParent, setSelectedMultiParent] = useState<any[]>([]);
  const [previousMulitParent, setPreviousMultiParent] = useState([]);
  const [serviceParentPercentage, setServiceParentPercentage] = useState<any[]>(
    []
  );
  const [editedMultiParent, setEditedMultiParent] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any>([]);
  const [submitProfileCategoryId, setSubmitProfileCategoryId] = useState<any[]>(
    []
  );
  const [serviceTemp, setServiceTemp] = useState({});
  const [avatarImg, setAvatarImg] = useState("");
  const [imgValKeys, setImgValKeys] = useState("");
  const [validationShape, setValidationShape] = useState({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    phoneNumber: yup.string().required("Phone Number is required"),
    countryCode: yup.string().required("required"),
    displayName: yup.string().required("Display Name is required"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    pctOfPayoutCheck: yup
      .number()
      .required("Is required")
      .positive()
      .integer()
      .min(0, "Min is 0")
      .max(100, "max is 100"),
    pctOfTips: yup
      .number()
      .required("Is required")
      .positive()
      .integer()
      .min(0, "Min is 0")
      .max(100, "max is 100"),
    pctOfProductSales: yup
      .number()
      .required("Is required")
      .positive()
      .integer()
      .min(0, "Min is 0")
      .max(100, "max is 100"),
    order: yup
      .number()
      .required("Is required")
      .positive()
      .integer()
      .min(1, "Min is 1"),
    color: yup.string().required("Color is required"),
    address: yup.object().shape({
      postal_code: yup.string().length(5),
    }),
  });
  const [initialValidationShape] = useState({ ...validationShape });
  const [pctService, setPctService] = useState({});
  const [staffRoleType, setStaffRoleType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [passErrorMsg, setPassErrorMsg] = useState("");
  let uniques = Array.from(new Set(selectedRole));
  const [pass, setPass] = useState("");
  const [tempFilter, setTempFilter] = useState<any[]>([]);
  const [staff, setStaff] = useState({
    color: "",
    countryCode: "+1",
    displayName: "",
    email: "",
    firstName: "",
    gender: "male",
    lastName: "",
    order: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
    },
    staffRoleType: "",
    avatar: "",
    payrollAmountPaid: "",
    salariedStaffType: "",
    pctOfPayoutCheck: 0,
    pctOfProductSales: 0,
    pctOfTips: 0,
    phoneNumber: "",
    profileCategoryId: [],
    roles: [],
    serviceIds: [],
    status: "",
    retypePassword: "",
    changePassword: "",
  });

  const UI = useSelector((state: any) => state.UI);
  const service = useSelector((state: any) => state.service);
  const allServices = service.serviceDetails;
  const user = useSelector((state: any) => state.user);
  const staffInfo = user.staffInfo;
  const allServiceData = service.getAllStaffResources;
  const allCategories = service.getRootServiceCategory;
  const view = window.location.href.includes("view");
  const urlParams = useParams();
  const id = urlParams.id;
  const bussinessId = localStorage.getItem("businessId");
  const basicFormSchema = yup.object().shape(validationShape);
  const newObj = serviceTemp || {};

  useEffect(() => {
    handlePctOfSerivce();
  }, [serviceTemp, selectedMultiParent]);

  useEffect(() => {
    const tempArr: any[] = [];
    resultFilterCategory &&
      resultFilterCategory.length &&
      resultFilterCategory[0].forEach((element: any) => {
        tempArr.push(element.id);
      });
    setTempFilter(
      selectedMultiOptions.filter((element) => tempArr.includes(element))
    );
  }, [resultFilterCategory, selectedMultiParent, selectedMultiOptions]);

  //Role and Service Error Message
  useEffect(() => {
    if (selectedMultiParent.length == 0) {
      setSelectedMultiOptions([]);
      setErrorMsg("error");
      setResultFilterCategory([]);
    } else if (
      !selectedMultiParent.includes("admin") &&
      submitProfileCategoryId.length > 0 &&
      tempFilter.length == 0
    ) {
      setErrorMsg("error");
    } else if (
      selectedMultiParent.includes("admin") &&
      selectedMultiOptions.length == 0
    ) {
      setSelectedMultiOptions([]);
      setErrorMsg("");
    }
  }, [selectedMultiParent, submitProfileCategoryId]);

  useEffect(() => {
    let params = {
      businessId: bussinessId,
    };
    props.getAllService(params);
    if (view) {
      setTitle("Category View/Edit");
      setTimeout(() => {
        props.getStaffDetails(id, params);
      }, 800);
    }
    props.getRootServiceCategory(params);
    props.getAllStaffResources(params);
  }, [view]);

  useEffect(() => {
    if (view && Object.keys(staffInfo).length !== 0) {
      if (staffInfo.retypePassword) {
        delete staffInfo.retypePassword;
        delete staffInfo.changePassword;
      }
      if (staffInfo.password) {
        delete staffInfo.password;
      }
      setStaff(staffInfo);
      setSelectedRole(staffInfo.roles);
      setPreviousMultiParent(staffInfo.profileCategoryId);
      setSelectedMultiOptions(staffInfo.serviceIds);
      setPctService(staffInfo.pctOfServiceSales);
      setServiceTemp(staffInfo.pctOfServiceSales);
      if (
        _.findIndex(staffInfo.roles, (role) => {
          return role == "admin";
        }) + 1
      ) {
        staffInfo.profileCategoryId.push("admin");
      }
      setSelectedMultiParent(staffInfo.profileCategoryId);
      if (staffInfo.avatar !== "" && staffInfo.hasOwnProperty("avatar")) {
        getImageFileData(staffInfo.avatar);
      }
    }
  }, [staffInfo]);

  useEffect(() => {
    if (selectedMultiParent.length > 0 && allServices.length > 0) {
      handleFinalDataOptions();
    }
  }, [selectedMultiOptions]);
  useEffect(() => {
    if (selectedMultiParent.length > 0 && allServices.length > 0) {
      filterData();
      handleFinalDataOptions();
    }
    parentPercentage();
  }, [selectedMultiParent]);

  useEffect(() => {
    const tempRoleArr: any[] = [];
    if (selectedMultiParent.length == 0) {
      setSubmitProfileCategoryId([]);
    } else {
      selectedMultiParent.forEach((element: any) => {
        if (element != "admin") {
          tempRoleArr.push(element);
          setSubmitProfileCategoryId(tempRoleArr);
        }
      });
    }
  }, [selectedMultiParent]);

  const handleMultiServices = (selectedItems: any) => {
    const multiOptions: any = [];
    for (let i = 0; i < selectedItems.length; i++) {
      multiOptions.push(selectedItems[i].value);
    }
    setSelectedMultiOptions(multiOptions);
  };

  //Setting other Role names to Stylist
  const handleMultiParent = (selectedItems: any) => {
    const multiOptions: any = [];

    for (let i = 0; i < selectedItems.length; i++) {
      multiOptions.push(selectedItems[i].value);
    }

    setSelectedMultiParent(multiOptions);
  };

  const handleRole = (selectedItems: any, roleChecked: any) => {
    let multiRoleOptions: any = [];
    if (roleChecked == true) {
      if (selectedItems == "admin") {
        multiRoleOptions.push("admin");
      } else if (selectedItems == "stylist") {
        multiRoleOptions.push("stylist");
      } else if (selectedItems == "support") {
        multiRoleOptions.push("support");
      }
      setSelectedRole([...selectedRole, multiRoleOptions[0]]);
    } else {
      const id = selectedRole.filter((items: any) => {
        return items != selectedItems;
      });
      setSelectedRole(id);
    }
  };

  const selectAllItems = () => {
    const serviceIds: any = [];
    resultFilterCategory.forEach((value: any) => {
      value.forEach((val: any) => {
        serviceIds.push(val.id);
      });
    });
    setSelectedMultiOptions(serviceIds);
  };

  const unSelectAllItems = () => {
    const serviceIds: any = [];
    setSelectedMultiOptions(serviceIds);
  };

  //Updating Role and services , Removing the pre roles and services
  const handleFinalDataOptions = () => {
    const tempArr: any = [];
    selectedMultiParent.forEach((value: any) => {
      if (value) {
        const newFliterJob: any = allServices.filter((data: any) => {
          return Object.values(data)
            .join(" ")
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase());
        });
        tempArr.push(...newFliterJob);
        const serviceIdsRes: any[] = [];
        tempArr.forEach((value: any) => {
          selectedMultiOptions.forEach((val: any) => {
            if (value.id == val) {
              serviceIdsRes.push(val);
            }
          });
        });
        setEditedMultiParent(serviceIdsRes);
      }
    });
  };

  const handleSubmit = (values: any) => {
    values.businessId = bussinessId;
    values.serviceIds = editedMultiParent;
    values.staffRoleType = staffRoleType;

    if (submitProfileCategoryId.length > 0 && editedMultiParent.length > 0) {
      values.profileCategoryId = submitProfileCategoryId;
    } else {
      values.profileCategoryId = [];
    }
    values.roles = uniques;

    if (view) {
      if (!values.password) {
        delete values.password;
      }

      if (values.changePassword && !values.retypePassword) {
        alert("Type Retype Password");
      } else if (!values.changePassword && values.retypePassword) {
        alert("Type Change Password");
      } else if (values.changePassword !== values.retypePassword) {
      } else if (
        values.profileCategoryId.length == 0 &&
        values.editedMultiParent.length == 0
      ) {
      } else {
        avatarImg != "" ? (values.avatar = imgValKeys) : (values.avatar = "");
        values.roles = uniques;
        values.pctOfServiceSales = pctService;
        alert(values.roles);

        props.updateClient(values);

        const params: any = {
          businessId: bussinessId,
          resourceId: id,
          servicesIds: values.serviceIds,
          _id: id,
        };

        props.updateResourceServices(params);

        previousMulitParent.forEach((element: any) => {
          const resourcesIds: any[] = [];
          if (element) {
            const newFliterJob: any = allServiceData.filter((data: any) => {
              return Object.values(data)
                .join(" ")
                .toLocaleLowerCase()
                .includes(element.toLocaleLowerCase());
            });
            newFliterJob[0].resourcesIds.forEach((element: any) => {
              if (element != id) {
                resourcesIds.push(element);
              }
            });
          }
          const params: any = {
            businessId: bussinessId,
            id: element,
            resourcesIds: resourcesIds,
          };
          props.updateStaffServiceResource(params, history);
        });

        values.profileCategoryId.forEach((element: any) => {
          const resourcesIds = [];
          if (element) {
            const newFliterJob: any = allServiceData.filter((data: any) => {
              return Object.values(data)
                .join(" ")
                .toLocaleLowerCase()
                .includes(element.toLocaleLowerCase());
            });
            newFliterJob[0].resourcesIds.forEach((element: any) => {
              resourcesIds.push(element);
            });
          }
          resourcesIds.push(id);
          const params: any = {
            businessId: bussinessId,
            id: element,
            resourcesIds: resourcesIds,
          };
          props.updateStaffServiceResource(params, history);
        });
      }
    } else {
      if (uniques.length > 0 && pass != "") {
        values.roles = uniques;
        avatarImg != "" ? (values.avatar = imgValKeys) : (values.avatar = "");
        props.addStaff(values, (success: any, id: any) => {
          if (success) {
            const params: any = {
              businessId: bussinessId,
              resourceId: id,
              servicesIds: values.serviceIds,
              _id: id,
            };
            props.addResourceServices(params);
          }
          if (success) {
            values.profileCategoryId.forEach((element: any) => {
              const resourcesIds = [];
              if (element) {
                const newFliterJob: any = allServiceData.filter((data: any) => {
                  return Object.values(data)
                    .join(" ")
                    .toLocaleLowerCase()
                    .includes(element.toLocaleLowerCase());
                });
                newFliterJob[0].resourcesIds.forEach((element: any) => {
                  resourcesIds.push(element);
                });
              }
              resourcesIds.push(id);
              const params: any = {
                businessId: bussinessId,
                id: element,
                resourcesIds: resourcesIds,
              };

              const profileId = element;
              props.addStaffCategory(profileId, params, history);
            });
          }
        });
      }
    }
  };

  const handleCancel = (e: any) => {
    props.history.push("/staff");
  };

  const filterData = () => {
    const tempArr: any = [];
    selectedMultiParent.forEach((value: any) => {
      if (value) {
        const newFliterJob: any = allServices.filter((data: any) => {
          return Object.values(data)
            .join(" ")
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase());
        });
        tempArr.push(newFliterJob);
        setResultFilterCategory(tempArr);
      }
    });
  };

  const parentPercentage = () => {
    const tempArr: any[] = [];
    selectedMultiParent && selectedMultiParent.length
      ? selectedMultiParent.forEach((element: any) => {
          if (element != "admin") {
            const newFliterJob: any = allCategories.filter((data: any) => {
              return Object.values(data)
                .join(" ")
                .toLocaleLowerCase()
                .includes(element.toLocaleLowerCase());
            });
            tempArr.push(newFliterJob[0]);
            setServiceParentPercentage(tempArr);
          }
        })
      : setServiceParentPercentage(tempArr);
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
    props.uploadImage(imageToSave, (success: any, key: any) => {
      if (success) {
        getImageFileData(key);
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

  const handleParentChange = (e: any) => {
    if (e.target.value) {
      setPass(e.target.value);
    } else if (e.target.value == "") {
      setPass("");
      setPassErrorMsg("error");
    } else {
      setPassErrorMsg("error");
    }
  };

  //Pct of Service Value Change
  const handleServiceChange = (event: any) => {
    if (event.target.value != null) {
      setServiceTemp({
        ...serviceTemp,
        ...{
          [event.target.name]: event.target.value && Number(event.target.value),
        },
      });
    }
  };

  const handlePctOfSerivce = () => {
    const objectTempValue: any = [];
    objectTempValue.push(serviceTemp);
    if (newObj) {
      const filterObject = (serviceTemp: any, submitProfileCategoryId: any) => {
        Object.keys(newObj).forEach((key) => {
          if (!submitProfileCategoryId.includes(key)) {
            delete serviceTemp[key];
          } else if (submitProfileCategoryId.includes(key)) {
            setErrorMsg("error");
          }
        });
      };
      filterObject(serviceTemp, selectedMultiParent);
      setPctService(serviceTemp);
    }
  };

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading ? (
        <React.Fragment>
          <PageHeader title={title} />
          <Row>
            <Col lg="12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <div className="ibox float-e-margins">
                  <div className="ibox-content">                  
                    <Formik
                      initialValues={{ ...staff }}
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
                        dirty,
                        isValid,
                      }) => {
                        return (
                          <Form
                            name="Staff"
                            className="form-horizontal"
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                          >
                            
                            <Row>
                              <Col md="8">
                                <div className="text-danger m-t-md m-b-md"></div>
                              </Col>
                            </Row>
                            <Row>
                              <Col md="8">
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    First Name
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="firstName"
                                      value={values.firstName}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.firstName && touched.firstName
                                      }
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Last Name
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="lastName"
                                      value={values.lastName}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.lastName && touched.lastName
                                      }
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Display Name
                                    <Tippy
                                      theme={"success"}
                                      maxWidth="225px"
                                      content={
                                        <div>
                                          <p>
                                            how do you want the staff member’s
                                            name to show up on the schedule and
                                            in the app?
                                          </p>
                                        </div>
                                      }
                                    >
                                      <i className="fa fa-question-circle"></i>
                                    </Tippy>
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="displayName"
                                      value={values.displayName}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.displayName &&
                                        touched.displayName
                                      }
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Country Code
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      as="select"
                                      name="countryCode"
                                      value={values.countryCode}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
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
                                          Belgium (+32){" "}
                                        </option>
                                        <option value="+501">
                                          Belize (+501)
                                        </option>
                                        <option value="+229">
                                          Benin (+229){" "}
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
                                        <option value="+1">Canada (+1)</option>
                                        <option value="+238">
                                          Cape Verde Islands (+238)
                                        </option>
                                        <option value="+1345">
                                          Cayman Islands (+1345)
                                        </option>
                                        <option value="+236">
                                          Central African Republic (+236)
                                        </option>
                                        <option value="+56">Chile (+56)</option>
                                        <option value="+86">China (+86)</option>
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
                                        <option value="+53">Cuba (+53)</option>
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
                                        <option value="+20">Egypt (+20)</option>
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
                                        <option value="+91">India (+91)</option>
                                        <option value="+62">
                                          Indonesia (+62)
                                        </option>
                                        <option value="+98">Iran (+98)</option>
                                        <option value="+964">
                                          Iraq (+964)
                                        </option>
                                        <option value="+353">
                                          Ireland (+353)
                                        </option>
                                        <option value="+972">
                                          Israel (+972)
                                        </option>
                                        <option value="+39">Italy (+39)</option>
                                        <option value="+1876">
                                          Jamaica (+1876)
                                        </option>
                                        <option value="+81">Japan (+81)</option>
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
                                        <option value="+51">Peru (+51)</option>
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
                                        <option value="+7">Russia (+7)</option>
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
                                        <option value="+34">Spain (+34)</option>
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
                                          Turks &amp; Caicos Islands (+1649)
                                        </option>
                                        <option value="+688">
                                          Tuvalu (+688)
                                        </option>
                                        <option value="+256">
                                          Uganda (+256)
                                        </option>
                                        <option value="+44">UK (+44)</option>
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
                                  <FormLabel className="col-sm-3 control-label">
                                    Phone Number
                                  </FormLabel>
                                  <Col sm="9">
                                    <NumberFormat
                                      type="tel"
                                      name="phoneNumber"
                                      className="form-control"
                                      format="(###) ###-####"
                                      allowEmptyFormatting
                                      mask="_"
                                      value={values.phoneNumber}
                                      onValueChange={(e: any) => {
                                        if (e.value.length === 10)
                                          values.phoneNumber = e.formattedValue;
                                        else values.phoneNumber = "";
                                      }}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.phoneNumber &&
                                        touched.phoneNumber
                                      }
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Email
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="email"
                                      name="email"
                                      value={values.email}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={errors.email && touched.email}
                                    />
                                  </Col>
                                </FormGroup>
                                {!view && (
                                  <FormGroup>
                                    <FormLabel className="col-sm-3 control-label">
                                      Password
                                    </FormLabel>
                                    <Col sm="9">
                                      <FormControl
                                        type="password"
                                        name="password"
                                        onChange={(e: any) => {
                                          let event = {
                                            target: {
                                              name: "password",
                                              value: e,
                                            },
                                          };
                                          handleParentChange(e);
                                        }}
                                        onBlur={handleBlur}
                                      />
                                    </Col>
                                  </FormGroup>
                                )}
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Gender
                                  </FormLabel>
                                  <Col sm="9">
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
                                          values.gender == "male"
                                            ? "selected"
                                            : ""
                                        }
                                        value="male"
                                      >
                                        Male
                                      </option>
                                      <option
                                        selected={
                                          values.gender == "female"
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
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Staff Role
                                  </FormLabel>

                                  <Col sm="9">
                                    <Form.Check
                                      type="checkbox"
                                      name="admin"
                                      label="Admin"
                                      value={selectedRole}
                                      onChange={(e) => {
                                        e.target.checked
                                          ? handleRole(
                                              e.target.name,
                                              e.target.checked
                                            )
                                          : handleRole(
                                              e.target.name,
                                              e.target.checked
                                            );
                                      }}
                                    />
                                    <Form.Check
                                      type="checkbox"
                                      name="support"
                                      label="Support"
                                      value={selectedRole}
                                      onChange={(e) => {
                                        e.target.checked
                                          ? handleRole(
                                              e.target.name,
                                              e.target.checked
                                            )
                                          : handleRole(
                                              e.target.name,
                                              e.target.checked
                                            );
                                      }}
                                    />
                                    <Form.Check
                                      type="checkbox"
                                      name="stylist"
                                      label="Stylist"
                                      value={selectedRole}
                                      onChange={(e) => {
                                        e.target.checked
                                          ? handleRole(
                                              e.target.name,
                                              e.target.checked
                                            )
                                          : handleRole(
                                              e.target.name,
                                              e.target.checked
                                            );
                                      }}
                                    />
                                  </Col>
                                </FormGroup>
                                {selectedRole.includes("stylist") && (
                                  <FormGroup>
                                    <FormLabel className="col-sm-3 control-label">
                                      Stylist Types
                                      <Tippy
                                        theme={"success"}
                                        maxWidth="225px"
                                        content={
                                          <div>
                                            <p>
                                              Which role or roles is the
                                              employee performing?
                                            </p>
                                            <p>
                                              <b>MAC:</b> If more than one, hold
                                              down command and click on each.
                                            </p>
                                            <p>
                                              <b>PC:</b> Hold shift and click to
                                              select more than one role.
                                            </p>
                                          </div>
                                        }
                                      >
                                        <i className="fa fa-question-circle"></i>
                                      </Tippy>
                                    </FormLabel>
                                    <Col sm="9">
                                      <FormControl
                                        as="select"
                                        name="role"
                                        value={selectedMultiParent}
                                        multiple={true}
                                        onChange={(e) => {
                                          handleMultiParent(
                                            e.target.selectedOptions
                                          );
                                          unSelectAllItems();
                                        }}
                                      >
                                        {allCategories &&
                                          allCategories.map((value: any) => {
                                            return (
                                              <option value={value.id}>
                                                {value.description} (
                                                {value.name})
                                              </option>
                                            );
                                          })}
                                      </FormControl>
                                    </Col>
                                  </FormGroup>
                                )}
                                {resultFilterCategory[0] &&
                                  selectedRole.includes("stylist") && (
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        Services
                                        <Tippy
                                          theme={"success"}
                                          maxWidth="225px"
                                          content={
                                            <div>
                                              <p>
                                                Which services is the staff
                                                member able to perform?
                                              </p>
                                              <p>
                                                You can click “<b>Select All</b>
                                                ” if all of them or you can hold
                                                down <b>Command</b> while
                                                selecting each one for a Mac.
                                              </p>
                                              <p>
                                                <b>PC:</b> Hold shift button and
                                                select each service performed.
                                              </p>
                                            </div>
                                          }
                                        >
                                          <i className="fa fa-question-circle"></i>
                                        </Tippy>
                                      </FormLabel>
                                      <Col sm="9">
                                        <FormControl
                                          as="select"
                                          name="role"
                                          className="height"
                                          multiple={true}
                                          value={selectedMultiOptions}
                                          onChange={(e) => {
                                            handleMultiServices(
                                              e.target.selectedOptions
                                            );
                                          }}
                                        >
                                          {resultFilterCategory &&
                                            resultFilterCategory.map(
                                              (value: any) =>
                                                value.map((val: any) => {
                                                  return (
                                                    <option value={val.id}>
                                                      {val.name}
                                                    </option>
                                                  );
                                                })
                                            )}
                                        </FormControl>
                                        <Button
                                          className="btn-primary"
                                          type="button"
                                          style={{ marginTop: "20px" }}
                                          onClick={selectAllItems}
                                        >
                                          Select All
                                        </Button>
                                        &nbsp;
                                        <button
                                          type="button"
                                          className="btn btn-primary"
                                          style={{ marginTop: "20px" }}
                                          onClick={unSelectAllItems}
                                        >
                                          Un Select All
                                        </button>
                                      </Col>
                                    </FormGroup>
                                  )}
                                {values.displayName &&
                                values.lastName &&
                                values.firstName ? (
                                  <FormGroup>
                                    <FormLabel className="col-sm-3 control-label">
                                      Schedule color
                                    </FormLabel>
                                    <Col sm="9">
                                      <FormControl
                                        as="select"
                                        name="color"
                                        value={values.color}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                          errors.color && touched.color
                                        }
                                      >
                                        <option value="white"></option>
                                        {ColorCode &&
                                          ColorCode.length &&
                                          ColorCode.map((value) => {
                                            return (
                                              <option
                                                value={value.hex}
                                                style={{
                                                  background: value.rgb,
                                                }}
                                              >
                                                {value.name}
                                              </option>
                                            );
                                          })}
                                      </FormControl>
                                      <div
                                        style={{
                                          padding: "10px",
                                          marginTop: "10px",
                                          backgroundColor: values.color,
                                          color: "#FFF",
                                        }}
                                      >
                                        {values.firstName} {values.lastName}
                                      </div>
                                    </Col>
                                  </FormGroup>
                                ) : (
                                  <React.Fragment></React.Fragment>
                                )}
                              </Col>
                              <div className="col-md-4">
                                {avatarImg != "" && imgValKeys != "" ? (
                                  <div className="form-group">
                                    <div className="col-sm-12">
                                      <div
                                        className="staffAvatar"
                                        style={{
                                          backgroundImage: `url(${avatarImg})`,
                                        }}
                                      >
                                        <button
                                          className="btn btn-danger btn-remove-staffAvatar"
                                          type="button"
                                          onClick={() => {
                                            setAvatarImg("");
                                          }}
                                        >
                                          X
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="form-group">
                                    <label className="col-md-4">
                                      Add Avatar
                                      <Tippy
                                        theme={"success"}
                                        maxWidth="225px"
                                        content={
                                          <div>
                                            <p>
                                              This is where you upload a photo
                                              of your employee so it shows up on
                                              the app and reminds the clients of
                                              who is who.
                                            </p>
                                          </div>
                                        }
                                      >
                                        <i className="fa fa-question-circle"></i>
                                      </Tippy>
                                    </label>
                                    <div className="col-sm-12">
                                      <input
                                        type="file"
                                        className="form-control"
                                        id="fileToUpload"
                                        onChange={(event) => {
                                          uploadFileImage(event.target.files);
                                        }}
                                      />
                                      {UI.buttonLoading && (
                                        <i className="fa fa-spinner fa-spin spin-on-relative-out" />
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Row>
                            <div className="hr-line-dashed" />
                            <Row>
                              <Col md="8">
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Staff Type
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      as="select"
                                      name="staffRoletype"
                                      value={staffRoleType}
                                      onChange={(e) => {
                                        setStaffRoleType(e.target.value);

                                        if (
                                          e.target.value == "hourly" ||
                                          "salaried"
                                        ) {
                                          values.payrollAmountPaid = "";
                                        }
                                      }}
                                      onBlur={handleBlur}
                                    >
                                      <option />
                                      <option
                                        selected={
                                          staffRoleType == "hourly"
                                            ? "selected"
                                            : ""
                                        }
                                        value="hourly"
                                      >
                                        Hourly Staff
                                      </option>
                                      <option
                                        selected={
                                          staffRoleType == "salaried"
                                            ? "selected"
                                            : ""
                                        }
                                        value="salaried"
                                      >
                                        Salaried Staff
                                      </option>
                                      {selectedRole.includes("stylist") && (
                                        <option
                                          selected={
                                            staffRoleType == "commission"
                                              ? "selected"
                                              : ""
                                          }
                                          value="commission"
                                        >
                                          Commission-based Staff
                                        </option>
                                      )}
                                    </FormControl>
                                  </Col>
                                </FormGroup>
                              </Col>
                              {staffRoleType == "hourly" && (
                                <div className="col-md-8">
                                  <FormGroup>
                                    <FormLabel className="col-sm-3 control-label">
                                      Amount Paid Per Hour (In $)
                                    </FormLabel>
                                    <Col sm="9">
                                      <FormControl
                                        type="number"
                                        name="payrollAmountPaid"
                                        value={values.payrollAmountPaid}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                    </Col>
                                  </FormGroup>
                                </div>
                              )}
                              {staffRoleType == "salaried" && (
                                <div className="col-md-8">
                                  <FormGroup>
                                    <FormLabel className="col-sm-3 control-label">
                                      Salaried Staff Type
                                    </FormLabel>
                                    <Col sm="9">
                                      <FormControl
                                        as="select"
                                        name="salariedStaffType"
                                        value={values.salariedStaffType}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      >
                                        <option />
                                        <option
                                          selected={
                                            values.salariedStaffType ==
                                            "bimonthly"
                                              ? "selected"
                                              : ""
                                          }
                                          value="bimonthly"
                                        >
                                          Bi-Monthly
                                        </option>
                                        <option
                                          selected={
                                            values.salariedStaffType == "weekly"
                                              ? "selected"
                                              : ""
                                          }
                                          value="weekly"
                                        >
                                          Weekly
                                        </option>
                                      </FormControl>
                                    </Col>
                                  </FormGroup>
                                </div>
                              )}
                              {staffRoleType == "salaried" && (
                                <div className="col-md-8">
                                  <FormGroup>
                                    <FormLabel className="col-sm-3 control-label">
                                      Amount Paid Per {values.salariedStaffType}{" "}
                                      (In $)
                                    </FormLabel>

                                    <Col sm="9">
                                      <FormControl
                                        type="number"
                                        name="payrollAmountPaid"
                                        value={values.payrollAmountPaid}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                    </Col>
                                  </FormGroup>
                                </div>
                              )}
                              {serviceParentPercentage &&
                                serviceParentPercentage.length > 0 &&
                                staffRoleType == "commission" &&
                                serviceParentPercentage.map((value: any) => {
                                  return (
                                    <div className="col-md-8">
                                      <FormGroup>
                                        <FormLabel className="col-sm-3 control-label">
                                          % of {value.name} Service Sales
                                        </FormLabel>
                                        <Col sm="9">
                                          <FormControl
                                            type="number"
                                            name={value.id}
                                            style={
                                              errorMsg == "error" &&
                                              newObj[value.id] <= 0
                                                ? {
                                                    border: "1px solid red",
                                                  }
                                                : {
                                                    border: "1px solid #e5e6e7",
                                                  }
                                            }
                                            value={
                                              newObj && newObj[value.id]
                                                ? newObj[value.id]
                                                : ""
                                            }
                                            onChange={handleServiceChange}
                                            onBlur={handleBlur}
                                          />
                                        </Col>
                                      </FormGroup>
                                    </div>
                                  );
                                })}
                              <div className="col-md-8">
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    % of Product Sales
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="number"
                                      name="pctOfProductSales"
                                      value={values.pctOfProductSales}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      min="0"
                                      max="100"
                                      isInvalid={
                                        errors.pctOfProductSales &&
                                        touched.pctOfProductSales
                                      }
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    % of Tips
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="number"
                                      name="pctOfTips"
                                      value={values.pctOfTips}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      min="0"
                                      max="100"
                                      isInvalid={
                                        errors.pctOfTips && touched.pctOfTips
                                      }
                                    />
                                  </Col>
                                </FormGroup>
                              </div>
                            </Row>
                            <div className="hr-line-dashed" />
                            <div className="row">
                              <div className="col-md-8">
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Street Adress 1
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="address.line1"
                                      value={
                                        values.address && values.address.line1
                                          ? values.address.line1
                                          : ""
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Street Adress 2
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="address.line2"
                                      value={
                                        values.address && values.address.line2
                                          ? values.address.line2
                                          : ""
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    City
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="text"
                                      name="address.city"
                                      value={
                                        values.address && values.address.city
                                          ? values.address.city
                                          : ""
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </Col>
                                </FormGroup>
                                <div className="form-group">
                                  <label className="col-sm-3 control-label">
                                    State
                                  </label>
                                  <div className="col-sm-9">
                                    <FormControl
                                      as="select"
                                      name="address.state"
                                      value={
                                        values.address && values.address.state
                                          ? values.address.state
                                          : ""
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      <option value=""></option>
                                      <option value="">-- Choose State</option>
                                      {StateList.map((e, index) => (
                                        <option
                                          key={index}
                                          aria-selected={
                                            values.address &&
                                            values.address.state &&
                                            values.address.state == e.full
                                              ? true
                                              : false
                                          }
                                          selected={
                                            values.address &&
                                            values.address.state &&
                                            values.address.state == e.full
                                              ? true
                                              : false
                                          }
                                          value={e.full}
                                        >
                                          {e.full}
                                        </option>
                                      ))}
                                    </FormControl>
                                  </div>
                                </div>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Zip (postal code)
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      type="string"
                                      name="address.postal_code"
                                      value={values.address.postal_code}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={
                                        errors.address?.postal_code &&
                                        touched.address?.postal_code
                                      }
                                    />
                                  </Col>
                                </FormGroup>
                                {/* {selectedMultiParent &&
                                selectedMultiParent.length ? (
                                  <FormGroup>
                                    <FormLabel className="col-sm-3 control-label">
                                      Schedule color
                                    </FormLabel>
                                    <Col sm="9">
                                      <FormControl
                                        as="select"
                                        name="color"
                                        value={values.color}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={
                                          errors.color && touched.color
                                        }
                                      >
                                        <option value="white">--</option>
                                        {ColorCode &&
                                          ColorCode.length &&
                                          ColorCode.map((value) => {
                                            return (
                                              <option
                                                value={value.hex}
                                                style={{
                                                  background: value.rgb,
                                                }}
                                              >
                                                {value.name}
                                              </option>
                                            );
                                          })}
                                      </FormControl>
                                      <div
                                        style={{
                                          padding: "10px",
                                          marginTop: "10px",
                                          backgroundColor: values.color,
                                          color: "#FFF",
                                        }}
                                      >
                                        {values.firstName} {values.lastName}
                                      </div>
                                    </Col>
                                  </FormGroup>
                                ) : (
                                  <React.Fragment></React.Fragment>
                                )} */}
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Order
                                    <Tippy
                                      theme={"success"}
                                      maxWidth="225px"
                                      content={
                                        <div>
                                          <p>
                                            <b>#1</b> would be shown on the far
                                            left on the Daily Schedule View.
                                          </p>
                                          <p>
                                            <b>#2</b> would be next and so on.
                                            Numbers can go as high as you like.
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
                                      name="order"
                                      value={values.order}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      isInvalid={errors.order && touched.order}
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <FormLabel className="col-sm-3 control-label">
                                    Status
                                  </FormLabel>
                                  <Col sm="9">
                                    <FormControl
                                      as="select"
                                      name="status"
                                      value={values.status}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      <option value=""> </option>
                                      <option
                                        selected={
                                          values.status == "active"
                                            ? "selected"
                                            : ""
                                        }
                                        value="active"
                                      >
                                        Active
                                      </option>
                                      <option
                                        selected={
                                          values.status == "inactive"
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
                              </div>
                            </div>
                            {view && (
                              <React.Fragment>
                                <div className="hr-line-dashed"></div>
                                <div className="row">
                                  {/* <div className="col-md-8">
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        % of Payout - Check
                                      </FormLabel>
                                      <Col sm="9">
                                        <FormControl
                                          type="number"
                                          name="pctOfPayoutCheck"
                                          value={values.pctOfPayoutCheck}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          min="0"
                                          max="100"
                                          isInvalid={
                                            errors.pctOfPayoutCheck &&
                                            touched.pctOfPayoutCheck
                                          }
                                        />
                                      </Col>
                                    </FormGroup>
                                  </div> */}
                                </div>
                                <div className="row">
                                  <div className="col-md-8">
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        Change Password (if needs only)
                                      </FormLabel>
                                      <Col sm="9">
                                        <FormControl
                                          type="text"
                                          name="changePassword"
                                          value={values.changePassword}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                        />
                                      </Col>
                                    </FormGroup>
                                    <FormGroup>
                                      <FormLabel className="col-sm-3 control-label">
                                        Retype password
                                      </FormLabel>
                                      <Col sm="9">
                                        <FormControl
                                          type="text"
                                          name="retypePassword"
                                          value={values.retypePassword}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                        />
                                        <span
                                          id="message"
                                          style={{ color: "red" }}
                                        >
                                          {values.changePassword &&
                                            !values.retypePassword &&
                                            "type retype password"}
                                          {!values.changePassword &&
                                            values.retypePassword &&
                                            "type change password"}
                                          {values.changePassword &&
                                            values.retypePassword &&
                                            values.changePassword !==
                                              values.retypePassword &&
                                            "Change password and Retype password is not matching"}
                                        </span>
                                      </Col>
                                    </FormGroup>
                                  </div>
                                </div>
                              </React.Fragment>
                            )}
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
                                          values.pctOfProductSales.toString()
                                            .length &&
                                          values.pctOfProductSales <= 100 &&
                                          (values.address.postal_code.length ==
                                            5 ||
                                            values.address.postal_code.length ==
                                              0) &&
                                          values.pctOfTips.toString().length &&
                                          values.pctOfTips <= 100 &&
                                          values.firstName.length &&
                                          values.lastName &&
                                          values.lastName.length &&
                                          values.phoneNumber &&
                                          values.phoneNumber.length &&
                                          values.displayName &&
                                          values.displayName.length &&
                                          values.email.length >= 5 &&
                                          values.email.includes(("@", ".")) &&
                                          staffRoleType &&
                                          staffRoleType.length &&
                                          pass.length > 0 &&
                                          values.countryCode &&
                                          values.countryCode.length &&
                                          values.order > 0 &&
                                          values.color &&
                                          values.color.length == 7 &&
                                          ((staffRoleType == "hourly" &&
                                          values.payrollAmountPaid.toString()
                                            .length > 0 &&
                                          values.payrollAmountPaid > 0
                                            ? true
                                            : false) ||
                                            (staffRoleType == "salaried" &&
                                            values.payrollAmountPaid.toString() >
                                              0 &&
                                            values.payrollAmountPaid > 0 &&
                                            values.salariedStaffType.length
                                              ? true
                                              : false))
                                        ) ||
                                        (resultFilterCategory[0] &&
                                          resultFilterCategory[0].length &&
                                          !(
                                            selectedMultiOptions &&
                                            selectedMultiOptions.length
                                          ))
                                      }
                                    >                                      
                                      Save Changes
                                      {UI.buttonLoading && (
                                        <i className="fa fa-spinner fa-spin"></i>
                                      )}
                                    </Button>
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
            </Col>
          </Row>
        </React.Fragment>
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapActionsToProps = {
  addStaff,
  getStaffDetails,
  updateClient,
  getRootServiceCategory,
  getAllService,
  updateStaffServiceResource,
  addResourceServices,
  addServiceCategory,
  getAllStaffResources,
  addStaffCategory,
  updateResourceServices,
  uploadImage,
  getImageFile,
};

export default connect(null, mapActionsToProps)(Staff);
