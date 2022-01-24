import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../components/core/PageHeader";
import { Modal } from "react-bootstrap";
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
      title: "How to Select an Employee’s Services",
      key: "r37hrx74m5-fzxhlgftix",
      url: "https://embed.fleeq.io/l/r37hrx74m5-fzxhlgftix",
    },
    {
      title: "Add Staff Schedule",
      key: "sh8aeqs16m-bvj5tfplv4",
      url: "https://embed.fleeq.io/l/sh8aeqs16m-bvj5tfplv4",
    },
    {
      title: "Add Appointment",
      key: "eh97q8cquk-3b2ntfz1j1",
      url: "https://embed.fleeq.io/l/eh97q8cquk-3b2ntfz1j1",
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
      title: "Total Sales",
      key: "zgfff2x3a6-sygzlfqvsf",
      url: "https://embed.fleeq.io/l/zgfff2x3a6-sygzlfqvsf",
    },
    {
      title: "Estimated payroll",
      key: "4vzo2bsftw-klcjlu95a4",
      url: "https://embed.fleeq.io/l/4vzo2bsftw-klcjlu95a4",
    },
    {
      title: "Services completed",
      key: "2j8f42a13r-s6pbuu9o3q",
      url: "https://embed.fleeq.io/l/2j8f42a13r-s6pbuu9o3q",
    },
    {
      title: "Product sales",
      key: "5ed7ync8h2-piujyaylln",
      url: "https://embed.fleeq.io/l/5ed7ync8h2-piujyaylln",
    },
    {
      title: "Client report",
      key: "yl98zbr5u2-hachb670z2",
      url: "https://embed.fleeq.io/l/yl98zbr5u2-hachb670z2",
    },
    {
      title: "Staff booking",
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
      <div
        show={modalPopup.deleteModal}
        animation={false}
        className="guidez3rdpjs-box guidez3rdpjs-modal-wrapper"
      >
        <span className="guidez3rdpjs-closeB" onClick={() => closeModal()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.54 31.53">
            <g>
              <path
                style={{ fill: "#fff" }}
                d="M30.35,1.19a4,4,0,0,0-5.72,0l-8.85,8.87L6.91,1.19A4,4,0,0,0,1.19,6.91l8.87,8.85L1.19,24.63a4,4,0,0,0,5.72,5.72l8.87-8.87,8.85,8.85a4,4,0,0,0,5.72-5.72L21.5,15.76l8.85-8.85A4,4,0,0,0,30.35,1.19Z"
              ></path>
            </g>
          </svg>
        </span>
        <div
          style={{ textAlign: "center", width: "772px", height: "579px" }}
          className="guidez3rdpjs-modal-content"
        >
          <iframe
            width="772"
            height="579"
            src={modalPopup.name}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading && (
        <React.Fragment>
          <PageHeader title={title} />
          {modalPopup.deleteModal && (
            <ModalWithGrid modalPopup={modalPopup} closeModal={closeModal} />
          )}
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
