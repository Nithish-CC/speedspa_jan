import { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { FormControl, Form } from "react-bootstrap";
import MenuItem from "@material-ui/core/MenuItem";
import { sendMessage, createURL } from "../../redux/actions/messageAction";
import { uploadImage, getImageFile } from "../../redux/actions/staffActions";
import * as yup from "yup";
import { Formik } from "formik";
import SelectSearch from "react-select-search";
const Messages = (props: any) => {
  const [messages, setMessages] = useState({
    type: "",
    title: "",
    message: "",
  });
  const [image, setImage] = useState<File>();
  const [showErrorResponse, setShowErrorResponse] = useState(false);
  const [showSuccessResponse, setShowSuccessResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const businessId = localStorage.getItem("businessId");
  const resourceId = localStorage.getItem("userId");
  const [imageFile, setImageFile] = useState("");
  const [stopLoading, setStopLoading] = useState("loading");
  const [checkurl, setCheckUrl] = useState("");
  const [avatarImg, setAvatarImg] = useState("");
  const [imgValKeys, setImgValKeys] = useState("");
  const option = [
    { name: "Select", value: "" },
    { name: "Notification", value: "PUSH" },
    { name: "Text", value: "SMS" },
  ];
  //reducer
  const UI = useSelector((state: any) => state.UI);
  const getUrl = UI.getUrl.data;

  const basicFormSchema = yup.object().shape({
    title: yup.string().required("title is required"),
    message: yup.string().required("message is required"),
  });

  const onChangePicture = (event: any) => {
    setImageFile(event.target.files);
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
      if (key !== null) {
        props.createURL(key);
      }
      if (success) {
        getImageFileData(key);
        setCheckUrl(url);
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

  const handleSubmit = (values: any) => {
    setLoading(true);
    if (values.type == "PUSH") {
      props.sendMessage(
        {
          businessId,
          clientId: "",
          createdAt: new Date(),
          message: values.message,
          resourceId,
          title: values.title,
          type: "PUSH",
        },
        (success: boolean) => {
          if (success) {
            setShowSuccessResponse(true);
          } else {
            setShowErrorResponse(true);
          }
          setLoading(false);
        }
      );
    } else if (values.type == "SMS") {
      uploadFileImage(imageFile);
      props.sendMessage(
        {
          businessId,
          clientId: "",
          createdAt: new Date(),
          message: values.message + " " + getUrl.url,
          resourceId,
          title: values.title,
          type: "SMS",
        },
        (success: boolean) => {
          if (success) {
            setShowSuccessResponse(true);
          } else {
            setShowErrorResponse(true);
          }
          setLoading(false);
        }
      );
    }
  };

  return (
    <div>
      <div
        className="row wrapper border-bottom white-bg page-heading"
        style={{ padding: "10px" }}
      >
        <div className="col-sm-12">
          <div className="col-sm-9">
            <h2 style={{ margin: "10px 0" }}>Messages</h2>
          </div>
          {false && (
            <div
              className="col-sm-3 title-action"
              // data-ng-if="$root.userRole=='sadmin' || $root.userRole=='admin' || vm.$state.includes('index.clients') || vm.$state.includes('index.staffschedule') || vm.$state.includes('index.schedule')"
              style={{ padding: "10px 0" }}
            >
              <a
                className="btn btn-sm btn-primary"
                href="#/"
                style={{ marginRight: "5px" }}
              >
                button
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="wrapper wrapper-content animated fadeInRight">
            <div className="ibox float-e-margins">
              <div className="ibox-content">
                <Formik
                  initialValues={{ ...messages }}
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
                    dirty,
                    isValid,
                  }) => {
                    return (
                      <Form
                        name="Message"
                        className="form-horizontal"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                      >
                        {showSuccessResponse && (
                          <div className="row" data-ng-show="vm.success.length">
                            <div className="col-md-8">
                              <div className="text-success m-t-md m-b-md">
                                Thank you! Message was sent!
                              </div>
                            </div>
                          </div>
                        )}
                        {showErrorResponse && (
                          <div className="row" data-ng-show="vm.errors.length">
                            <div className="col-md-8">
                              <div className="text-danger m-t-md m-b-md">
                                Error sending message. Try again!
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="form-group">
                          <label className="col-md-2 col-sm-3 col-xs-4 control-label">
                            Type
                          </label>
                          <div className="col-md-4 col-sm-5 col-xs-8">
                            <SelectSearch
                              options={option}
                              value={values.type}
                              name="type"
                              placeholder="Select"
                              search
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        {/* <div className='form-group' ng-if='false'>
										<label className='col-md-2 col-sm-3 col-xs-4 control-label'>Client</label>
										<div className='col-md-4 col-sm-5 col-xs-8'>
											<select
												ui-select2
												data-placeholder='Client'
												data-ng-model='vm.message.clientId'
												id='clientSelect'
												name='client'
												style={{ width: '100%' }}
											>
												<option value=''>Select</option>
												<option value='ALL' selected>
													All
												</option>
												<option data-ng-value='client.id' data-ng-repeat='client in vm.clients'>
													{client.firstName + ' ' + client.lastName}
												</option>
											</select>
										</div>
									</div> */}
                        <div className="form-group">
                          <label className="col-md-2 col-sm-3 col-xs-4 control-label">
                            Title
                          </label>
                          <div className="col-md-4 col-sm-5 col-xs-8">
                            <FormControl
                              type="text"
                              name="title"
                              placeholder="Title Here"
                              value={values.title}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={errors.title && touched.title}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group m-t-sm">
                          <label className="col-md-2 col-sm-3 col-xs-4 control-label">
                            Message
                          </label>
                          <div className="col-md-6 col-sm-7 col-xs-8">
                            <textarea
                              className="form-control txtbig"
                              placeholder="Write message here"
                              name="message"
                              value={values.message}
                              placeholder="Write Message Here"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={errors.message && touched.message}
                              required
                            ></textarea>
                            <p ng-if="vm.message.clientId == 'ALL' || vm.message.clientId == '' || vm.message.clientId == null">
                              Your message will be sent to all customers.
                            </p>
                          </div>
                        </div>
                        {values.type === "SMS" && (
                          <div className="form-group">
                            <label className="col-md-2 col-sm-3 col-xs-4 control-label">
                              Image
                            </label>
                            <div className="col-md-4 col-sm-5 col-xs-8">
                              <input
                                type="file"
                                className="form-control"
                                id="fileToUpload"
                                onChange={(e) => onChangePicture(e)}
                              />
                            </div>
                          </div>
                        )}
                        <div className="hr-line-dashed"></div>
                        <div className="form-group m-t-lg">
                          <div className="col-sm-10 col-sm-offset-2">
                            <button
                              className="btn btn-white"
                              type="button"
                              onClick={() => {
                                setType("");
                                setTitle("");
                                setMessage("");
                                setImage();
                              }}
                            >
                              Clear
                            </button>
                            <button
                              className="btn btn-primary m-l-sm"
                              type="submit"
                            >
                              Send Message
                            </button>
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
    </div>
  );
};

const mapStateToProps = (state: any) => ({});

const mapActionsToProps = {
  sendMessage,
  uploadImage,
  getImageFile,
  createURL,
};

export default connect(mapStateToProps, mapActionsToProps)(Messages);
