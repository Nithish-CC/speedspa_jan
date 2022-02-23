import ReactDOM from "react-dom";
import React from "react";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { Button } from "react-bootstrap";

const LeavePageModal = (
  message: any,
  callback: any,
  confirmOpen: any,
  setConfirmOpen: any
) => {
  const container = document.createElement("div");

  container.setAttribute("custom-confirm-view", "");

  const handleConfirm = (callbackState: any) => {
    ReactDOM.unmountComponentAtNode(container);
    callback();
    setConfirmOpen(false);
  };

  const handleCancel = (callbackState: any) => {
    ReactDOM.unmountComponentAtNode(container);
    callback(callbackState);
    setConfirmOpen(false);
  };

  document.body.appendChild(container);
  ReactDOM.render(
    <React.Fragment>
      <Modal show={confirmOpen} animation={false}>
        <ModalHeader>
          <ModalTitle className="fontWeight-600" style={{ fontSize: "16px" }}>
            You have usaved changes!
          </ModalTitle>
        </ModalHeader>
        <ModalBody>Are you sure you want to leave the page?</ModalBody>
        <ModalFooter>
          <Button
            style={{
              background: "#fff",
              border: "1px solid #e7eaec",
              color: "#676a6c",
            }}
            onClick={handleConfirm}
          >
            Stay
          </Button>
          &nbsp;
          <button className="btn btn-danger" onClick={handleCancel}>
            Leave
          </button>
        </ModalFooter>
      </Modal>
    </React.Fragment>,
    container
  );
};

export default LeavePageModal;
