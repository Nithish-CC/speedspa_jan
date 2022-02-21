import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getTerminalId } from "../../redux/actions/productAction";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GppMaybeRoundedIcon from "@mui/icons-material/GppMaybeRounded";

const Terminals = (props: any) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({} as Error);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const bussinessId = localStorage.getItem("businessId");
  const businessDetails = JSON.parse(localStorage.businessDetails);
  const mxMerchantId = businessDetails.mxMerchantId;
  const hostname = "demo-sofabnails.savantsaloncrm.com";

  useEffect(() => {
    getTerminalId();
  }, []);
  //toast notification
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

  const getTerminalId = () => {
    let params = {
      mxMerchantId: mxMerchantId,
      businessId: bussinessId,
    };
    props.getTerminalId(params, (success: any, data: any) => {
      if (success) {
        history.push("");
      } else {
        notify(data);
      }
    });
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="ibox float-e-margins">
            <div className="ibox-content">
              <div className="table-responsive">
                <table className="table table-striped table-hover dataTables-example">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Device Type</th>
                      <th>Device Type Name</th>
                      <th>Merchant Id</th>
                      {/* <!-- <th>Action</th> --> */}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="gradeX" ng-repeat="terminal in vm.terminals">
                      {/* <td>{terminal.name}</td>
                                    <td>{terminal.description}</td>
                                    <td>{terminal.deviceType}</td>
                                    <td>{terminal.deviceTypeName}</td>
                                    <td>{terminal.merchantId}</td> */}
                      {/* <!-- <td>
                                        <div style="position: relative">
                                            <a delete-item-button item="terminal" items="vm.terminals"
                                                item-type="terminal" item-name="(terminal.name)"
                                                item-callback="vm.delete">Delete</a>
                                        </div>
                                    </td> --> */}
                    </tr>
                    <tr
                      className="text-center"
                      ng-if="vm.terminals.length <= 0"
                    >
                      <td colSpan={5}>{"No Terminals"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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
  );
};

const mapStateToProps = (state: any) => ({});

const mapActionsToProps = { getTerminalId };

export default connect(mapStateToProps, mapActionsToProps)(Terminals);
