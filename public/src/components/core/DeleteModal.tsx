import { connect } from 'react-redux'
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";

const DeleteModal = (props: any) => {
    const { title, modalPopup, closeModal, handleDelete } = props
    return (
        <>
            <Modal show={modalPopup.deleteModal}>
                <ModalHeader>
                    <ModalTitle>Delete {title}</ModalTitle>
                </ModalHeader>
                <ModalBody>Are you sure you want to delete {title} {modalPopup.name}?</ModalBody>
                <ModalFooter>
                    <button className="btn btn-secondary" onClick={() => closeModal()}>Cancel</button>{' '}
                    <button className="btn btn-danger" onClick={() => handleDelete()}>Delete</button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default DeleteModal;
