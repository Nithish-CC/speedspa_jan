import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../components/core/PageHeader";
import { Modal } from "react-bootstrap";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import "../scss/style.scss";

const Instructions = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title] = useState("Instructional Videos");
  const [videos] = useState([
    {
      title: "Add Client",
      key: "2bvn1lgtkf-2shypzo32g",
      url: "https://embed.fleeq.io/l/2bvn1lgtkf-2shypzo32g",
    },
    {
      title: "Bulk Upload Clients",
      key: "e4sgchtwx2-76s0xt93ub",
      url: "https://embed.fleeq.io/l/e4sgchtwx2-76s0xt93ub",
    },
    {
      title: "Add Appointment",
      key: "eh97q8cquk-3b2ntfz1j1",
      url: "https://embed.fleeq.io/l/eh97q8cquk-3b2ntfz1j1",
    },
    {
      title: "Creating a Category or Subcategory",
      key: "0pygn4g5i8-2i5r85jp0c",
      url: "https://embed.fleeq.io/l/0pygn4g5i8-2i5r85jp0c",
    },
    {
      title: "Add a Service",
      key: "rhyhndx6ig-6r3kxb9490",
      url: "https://embed.fleeq.io/l/rhyhndx6ig-6r3kxb9490",
    },
    {
      title: "How to select an employee's services",
      key: "r37hrx74m5-fzxhlgftix",
      url: "https://embed.fleeq.io/l/r37hrx74m5-fzxhlgftix",
    },
    {
      title: "Add Staff Schedule",
      key: "sh8aeqs16m-bvj5tfplv4",
      url: "https://embed.fleeq.io/l/sh8aeqs16m-bvj5tfplv4",
    },
    {
      title: "Add Product",
      key: "kpjiscdcs7-x8rr28dsai",
      url: "https://embed.fleeq.io/l/kpjiscdcs7-x8rr28dsai",
    },
    {
      title: "Dashboard",
      key: "klmfxbf4sk-gitiuz70p6",
      url: "https://embed.fleeq.io/l/klmfxbf4sk-gitiuz70p6",
    },
    {
      title: "Total Sales Report",
      key: "zgfff2x3a6-sygzlfqvsf",
      url: "https://embed.fleeq.io/l/zgfff2x3a6-sygzlfqvsf",
    },
    {
      title: "Estimated Payroll Report",
      key: "4vzo2bsftw-klcjlu95a4",
      url: "https://embed.fleeq.io/l/4vzo2bsftw-klcjlu95a4",
    },
    {
      title: "Services Completed Report",
      key: "2j8f42a13r-s6pbuu9o3q",
      url: "https://embed.fleeq.io/l/2j8f42a13r-s6pbuu9o3q",
    },
    {
      title: "Product Sales Report",
      key: "5ed7ync8h2-piujyaylln",
      url: "https://embed.fleeq.io/l/5ed7ync8h2-piujyaylln",
    },
    {
      title: "Client Report",
      key: "yl98zbr5u2-hachb670z2",
      url: "https://embed.fleeq.io/l/yl98zbr5u2-hachb670z2",
    },
    {
      title: "Staff Booking Analysis",
      key: "kot9gqizhg-3ait968es2",
      url: "https://embed.fleeq.io/l/kot9gqizhg-3ait968es2",
    },
  ]);
  const [modalPopup, setModalPopup] = useState({
    deleteModal: false,
    name: [],
    index: "",
  });

  const [initialModalPopup] = useState({ ...modalPopup });

  //From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);

  const handleModalPopup = (video: any, index: any) => {
    setModalPopup({
      deleteModal: !modalPopup.deleteModal,
      name: video.url,
      index: index,
    });
  };

  const closeModal = () => {
    setModalPopup(initialModalPopup);
  };

  const ModalWithGrid = (props: any) => {
    const { modalPopup, closeModal } = props;
    return (
      <Modal
        show={modalPopup.deleteModal}
        animation={false}
        dialogClassName="video-popup"
      >
        <ModalHeader>
          <button type="button" className="close" onClick={() => closeModal()}>
            <span aria-hidden="true">×</span>
          </button>
        </ModalHeader>
        <ModalBody>
          <iframe
            width="540"
            height="500"
            src={modalPopup.name}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </ModalBody>
      </Modal>
    );
  };

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading && (
        <React.Fragment>
          <PageHeader title={title} />
          <ModalWithGrid modalPopup={modalPopup} closeModal={closeModal} />
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <div className="ibox float-e-margins">
                  <div className="ibox-content">
                    <div className="instruction table-responsive">
                      <table className="table table-bordered table-striped dataTables-example tutorial videos">
                        <thead>
                          <tr>
                            <th className="text-center">S.No</th>
                            <th className="text-center">
                              Instructional Videos
                            </th>
                            <th className="text-center">Watch</th>
                          </tr>
                        </thead>
                        <tbody>
                          {videos &&
                            videos.length &&
                            videos.map((video: any, index: any) => {
                              return (
                                <tr className="gradeX" key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td>{video.title}</td>
                                  <td className="text-center">
                                    <a
                                      onClick={() =>
                                        handleModalPopup(video, index)
                                      }
                                    >
                                      Click here
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
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

const mapActionsToProps = {};

export default Instructions;
