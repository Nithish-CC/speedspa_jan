import React from "react";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";

const DeleteModal = (props: any) => {
  const { title, modalPopup, closeModal, handleDelete, handleNoShow } = props;
  const UI = useSelector((state: any) => state.UI);
  return (
    <React.Fragment>
      <Modal show={modalPopup.deleteModal} animation={false}>
        <ModalHeader>
          <ModalTitle>Delete {title}</ModalTitle>
        </ModalHeader>
        {modalPopup.startDate && (
          <ModalBody>
            Are you sure you want to delete {title} {modalPopup.name} from{" "}
            {modalPopup.startDate} to {modalPopup.endDate} ?
          </ModalBody>
        )}
        {!modalPopup.startDate && (
          <ModalBody>
            Are you sure you want to delete {title} <b>{modalPopup.name}</b>?
          </ModalBody>
        )}
        <ModalFooter>
          <button className="btn btn-secondary" onClick={() => closeModal()}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={() => handleDelete()}>
            Delete            
          </button>
          <button className="btn btn-warning" onClick={() => handleNoShow()}>
            No Show
          </button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default DeleteModal;
