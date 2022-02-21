import PageHeader from "./core/PageHeader";
import React, { useState } from "react";
import { StateList } from "../utils/StateList";
import {
  Form,
  Col,
  Row,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { Prompt } from "react-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import NumberFormat from "react-number-format";
import { classList } from "../utils/common";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GppMaybeRoundedIcon from "@mui/icons-material/GppMaybeRounded";

const Profile = () => {
  
  //useState
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    countryCode: "",
    phoneNumber: "",
    email: "",
    gender: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
    },
  });

  const [password, setPassword] = useState({
    password: "",
    passwordRep: "",
  });

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwdSuccess, setPasswdSuccess] = useState(false);
  const history = useHistory();
  const userData = useSelector((state: any) => state.user.credentials);

  //useEffect
  useEffect(() => {
    setProfile(userData);
    setPassword({
      password: "",
      passwordRep: "",
    });
  }, [userData]);

  //Input feild change in Edit your Info Tab
  const handleChange = (e: any) => {
    e.persist();
    setProfile((values) => ({
      ...values,
      [e.target.name]: e.target.value,
    }));
  };

  //Input feild change in Change Password Tab
  const handlePasswordChange = (e: any) => {
    e.persist();
    setPassword((values) => ({
      ...values,
      [e.target.name]: e.target.value,
    }));
  };

  //Form Submit Edit your Info Tab
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const userId = localStorage.getItem("userId");
    axios
      .patch(`/users/${userId}`, profile)
      .then((res) => {
        setProfileSuccess(!profileSuccess);
      })
      .catch((err) => {
        notify(err.response.data.message);
      });
  };

  //Error Toastification
  const notify = (data: any) => {
    toast.error(<div>{data}</div>, {
      theme: "colored",
      icon: () => <GppMaybeRoundedIcon fontSize="large" />,
    });
  };

  const [formChanged, setFormChanged] = useState(false);

  const myForm = document.getElementById("profile");
  const myForm2 = document.getElementById("changePassword");

  const onChangeHandler = () => {
    if (myForm) {
      myForm.addEventListener("change", () => setFormChanged(true));
    }
    if(myForm2){
      myForm2.addEventListener("change", () => setFormChanged(true));
    }
    window.addEventListener("beforeunload", (event) => {
      if (formChanged) {
        event.returnValue = "You have unfinished changes!";
      }
    });
  };

  //Form Submit Change Password Tab
  const onPasswordSubmit = (event: any) => {
    event.preventDefault();
    const userId = localStorage.getItem("userId");
    const businessId = localStorage.getItem("businessId");
    const data = {
      businessId: businessId,
      id: userId,
      password: password.passwordRep,
    };
    axios
      .patch(`/users/${userId}`, data)
      .then((res) => {
        setPasswdSuccess(!passwdSuccess);
      })
      .catch((err) => {
        notify(err.response.data.message);
      });
    setPassword({
      password: "",
      passwordRep: "",
    });
  };

  return (
    <React.Fragment>
      <Prompt
        when={formChanged}
        message="Are you sure you want to leave the page?"
      />
      <PageHeader title="Profile" />
      <Row>
        <Col lg={12}>
          <div className="wrapper wrapper-content animated fadeInRight">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item active">
                <a
                  className="nav-link active show"
                  id="profile-tab"
                  data-toggle="tab"
                  href="#profile"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="false"
                >
                  Edit Your Info
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  id="passwd-tab"
                  data-toggle="tab"
                  href="#passwd"
                  role="tab"
                  aria-controls="passwd"
                  aria-selected="true"
                >
                  Change Password
                </a>
              </li>
            </ul>
            {/* Edit Your Info Tab */}
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane active"
                id="profile"
                role="tabpanel"
                aria-labelledby="profile-tab"
              >
                <div className="ibox float-e-margins">
                  <div className="ibox-content no-border">
                    <Row
                      className={classList({
                        hide: !profileSuccess,
                        show: profileSuccess,
                      })}
                    >
                      <Col md="8">
                        <div className="text-success m-t-md m-b-md ng-binding">
                          Thank you! Your data was saved!
                        </div>
                      </Col>
                    </Row>
                    <Form
                      name="profileEdit"
                      id="profile"
                      onChange={onChangeHandler}
                      className="form-horizontal"
                      noValidate
                      autoComplete="off"
                      onSubmit={handleSubmit}
                    >
                      <Row>
                        <Col md="8">
                          <FormGroup>
                            <FormLabel className="col-sm-3">
                              First Name
                            </FormLabel>
                            <Col sm="9">
                              <FormControl
                                type="text"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                style={
                                  profile.firstName && profile.firstName.length
                                    ? {}
                                    : { border: "1px solid #ed5565" }
                                }
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup>
                            <FormLabel className="col-sm-3">
                              Last Name
                            </FormLabel>
                            <Col sm="9">
                              <FormControl
                                type="text"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                style={
                                  profile.lastName && profile.lastName.length
                                    ? {}
                                    : { border: "1px solid #ed5565" }
                                }
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup>
                            <FormLabel className="col-sm-3">
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
                                value={profile.phoneNumber}
                                onValueChange={(e: any) => {
                                  if (e.value.length === 10)
                                    profile.phoneNumber = e.formattedValue;
                                  else profile.phoneNumber = "";
                                }}
                                style={
                                  profile.phoneNumber &&
                                  profile.phoneNumber.length
                                    ? {}
                                    : { border: "1px solid #ed5565" }
                                }
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup>
                            <FormLabel className="col-sm-3">Email</FormLabel>
                            <Col sm="9">
                              <FormControl
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                style={
                                  profile.email && profile.email.length
                                    ? {}
                                    : { border: "1px solid #ed5565" }
                                }
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup>
                            <FormLabel className="col-sm-3">Gender</FormLabel>
                            <Col sm="9">
                              <FormControl
                                as="select"
                                name="gender"
                                value={profile.gender}
                                onChange={handleChange}
                              >
                                <option value="">Gender</option>
                                <option
                                  selected={
                                    profile.gender === "male" ? "selected" : ""
                                  }
                                  value="male"
                                >
                                  Male
                                </option>
                                <option
                                  selected={
                                    profile.gender === "female"
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
                        </Col>
                      </Row>
                      <div className="hr-line-dashed"></div>
                      <Row>
                        <Col md="8">
                          <FormGroup>
                            <FormLabel className="col-sm-3">
                              Street Adress 1
                            </FormLabel>
                            <Col sm="9">
                              <FormControl
                                type="text"
                                name="address.line1"
                                value={profile.address.line1}
                                onChange={(e: any) => {
                                  setProfile({
                                    ...profile,
                                    address: {
                                      ...profile.address,
                                      line1: e.target.value,
                                    },
                                  });
                                }}
                                style={
                                  profile.address.line1 &&
                                  profile.address.line1.length
                                    ? {}
                                    : { border: "1px solid #ed5565" }
                                }
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup>
                            <FormLabel className="col-sm-3">
                              Street Adress 2
                            </FormLabel>
                            <Col sm="9">
                              <FormControl
                                type="text"
                                name="address.line2"
                                value={profile.address.line2}
                                onChange={(e: any) => {
                                  setProfile({
                                    ...profile,
                                    address: {
                                      ...profile.address,
                                      line2: e.target.value,
                                    },
                                  });
                                }}
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup>
                            <FormLabel className="col-sm-3">City</FormLabel>
                            <Col sm="9">
                              <FormControl
                                type="text"
                                name="address.city"
                                value={profile.address.city}
                                onChange={(e: any) => {
                                  setProfile({
                                    ...profile,
                                    address: {
                                      ...profile.address,
                                      city: e.target.value,
                                    },
                                  });
                                }}
                                style={
                                  profile.address.city &&
                                  profile.address.city.length
                                    ? {}
                                    : { border: "1px solid #ed5565" }
                                }
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup>
                            <FormLabel className="col-sm-3">State</FormLabel>
                            <Col sm="9">
                              <FormControl
                                as="select"
                                name="address.state"
                                value={profile.address.state}
                                onChange={(e: any) => {
                                  setProfile({
                                    ...profile,
                                    address: {
                                      ...profile.address,
                                      state: e.target.value,
                                    },
                                  });
                                }}
                              >
                                <option value="">State</option>
                                {StateList.map((e, index) => (
                                  <option
                                    key={index}
                                    aria-selected={
                                      profile.address &&
                                      profile.address.state &&
                                      profile.address.state == e.full
                                        ? true
                                        : false
                                    }
                                    selected={
                                      profile.address &&
                                      profile.address.state &&
                                      profile.address.state == e.full
                                        ? true
                                        : false
                                    }
                                    value={e.full}
                                  >
                                    {e.full}
                                  </option>
                                ))}
                              </FormControl>
                            </Col>
                          </FormGroup>
                          <FormGroup>
                            <FormLabel className="col-sm-3">Zip</FormLabel>
                            <Col sm="9">
                              <FormControl
                                type="text"
                                name="address.postal_code"
                                value={profile.address.postal_code}
                                onChange={(e: any) => {
                                  setProfile({
                                    ...profile,
                                    address: {
                                      ...profile.address,
                                      postal_code: e.target.value,
                                    },
                                  });
                                }}
                                style={
                                  profile.address.postal_code &&
                                  profile.address.postal_code.toString()
                                    .length >= 5
                                    ? {}
                                    : { border: "1px solid #ed5565" }
                                }
                              />
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="hr-line-dashed"></div>
                      <Row>
                        <div className="col-md-8">
                          <div className="form-group">
                            <div className="col-sm-9 col-sm-offset-3">
                              <button
                                className="btn btn-white"
                                type="button"
                                onClick={() => history.push("/schedule")}
                              >
                                Cancel
                              </button>
                              &nbsp;
                              <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={
                                  !(
                                    password.password &&
                                    password.password.length &&
                                    password.passwordRep &&
                                    password.passwordRep.length
                                  )
                                }
                              >
                                Save Changes
                                {/* <i className='fa fa-spinner fa-spin'></i> */}
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
                      </Row>
                    </Form>
                  </div>
                </div>
              </div>
              {/* Change Password Tab */}
              <div
                className="tab-pane fade"
                id="passwd"
                role="tabpanel"
                aria-labelledby="passwd-tab"
              >
                <div className="ibox float-e-margins">
                  <div className="ibox-content no-border">
                    <Form
                      name="staffEdit"
                      id="changePassword"
                      className="form-horizontal"
                      onChange={onChangeHandler}
                      noValidate
                      autoComplete="off"
                      onSubmit={onPasswordSubmit}
                    >
                      <Row
                        className={classList({
                          hide: !passwdSuccess,
                          show: passwdSuccess,
                        })}
                      >
                        <Col md="8">
                          <div className="text-success m-t-md m-b-md ng-binding">
                            Thank you! Your new password was saved!
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="8">
                          <FormGroup>
                            <FormLabel className="col-sm-3">
                              Type New Password
                            </FormLabel>
                            <Col sm="9">
                              <FormControl
                                type="password"
                                name="password"
                                value={password.password}
                                onChange={handlePasswordChange}
                              />
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col md="8">
                          <FormGroup>
                            <FormLabel className="col-sm-3">
                              Please Repeat
                            </FormLabel>
                            <Col sm="9">
                              <FormControl
                                type="password"
                                name="passwordRep"
                                value={password.passwordRep}
                                onChange={handlePasswordChange}
                              />
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="hr-line-dashed" />
                      <Row>
                        <Col md={8}>
                          <div className="form-group">
                            <Col sm={9} sm-offset={3}>
                              <button className="btn btn-white" type="button">
                                Cancel
                              </button>
                              &nbsp;
                              <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={
                                  !(
                                    password.password &&
                                    password.password.length &&
                                    password.passwordRep &&
                                    password.passwordRep.length &&
                                    password.password == password.passwordRep
                                  )
                                }
                              >
                                Save Changes
                                {/* <i className='fa fa-spinner fa-spin' data-ng-show='vm.savingPass' /> */}
                              </button>
                            </Col>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Profile;
