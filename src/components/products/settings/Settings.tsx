import React, { useState, useEffect } from "react";
import PageHeader from "../../core/PageHeader";
import {
  getProductSettingData,
  updateProductSetting,
} from "../../../redux/actions/productAction";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, connect } from "react-redux";
import {
  Form,
  Button,
  Row,
  Col,
  FormControl,
  FormLabel,
} from "react-bootstrap";
import "../../../scss/style.scss";

const Settings = (props: any) => {
  const [title] = useState("Product Settings");
  const [errors, setErrors] = useState({} as Error);
  const [values, setValues] = useState({
    isPrimary: true,
    productLowLimit: 0,
    businessId: "",
    createdAt: "",
    updatedAt: "",
    id: "",
  });

  // From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const product = useSelector((state: any) => state.product);
  const getSettings = product.getSettings;
  const getSettingsLength = getSettings.length;

  //useEffect
  useEffect(() => {
    setValues(getSettingsLength === 0 ? "" : getSettings[0]);
  }, [getSettings]);

  useEffect(() => {
    getProductSettingData();
    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  //Function to get businessId and to get productLowLimit
  const getProductSettingData = () => {
    const params = {
      businessId: localStorage.businessId,
    };
    props.getProductSettingData(params);
  };
  const handleChange = (event: any) => {
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    props.updateProductSetting(values);
    toast("Updated Successfully", {
      className: "toastify-success",
    });
  };

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
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col sm="4">
                          <FormLabel>Product Limit</FormLabel>
                          <FormControl
                            type="number"
                            name="productLowLimit"
                            value={values.productLowLimit}
                            onChange={handleChange}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="12" className="text-left">
                          <div className="form-group">
                            <div>
                              <label>&nbsp;</label>
                            </div>
                            <Button type="submit">Save</Button>
                            <ToastContainer
                              position="bottom-right"
                              autoClose={2000}
                              toastStyle={{
                                backgroundColor: "#5abb9e",
                                color: "#fff",
                              }}
                              closeButton={false}
                              hideProgressBar={true}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Form>
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
  getProductSettingData,
  updateProductSetting,
};

export default connect(null, mapActionsToProps)(Settings);
