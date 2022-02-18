import React from "react";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { Button } from "react-bootstrap";

const LeavePageModal = (props: any) => {
  const { modal, closeModal, swapPage } = props;
  return (
    <React.Fragment>
      <Modal show={modal} animation={false}>
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
            onClick={() => closeModal()}
          >
            Stay
          </Button>
          &nbsp;
          <button className="btn btn-danger" onClick={() => swapPage()}>
            Leave
          </button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default LeavePageModal;
