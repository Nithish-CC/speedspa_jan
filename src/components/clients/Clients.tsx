import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getAllClients,
  searchClients,
  deleteClient,
} from "../../redux/actions/clientActions";
import { sorting, buildFilter } from "../../utils/common";
import moment from "moment";
import PageHeader from "../../components/core/PageHeader";
import Pagination from "react-js-pagination";
import DeleteModal from "../core/DeleteModal";
import _ from "lodash";

const Clients = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title] = useState("Clients");
  const [orderBy, setOrderBy] = useState(false);
  const [field, setField] = useState("createdAt");
  const [activePage, setActivePage] = useState(1);
  const [perPage] = useState(10);
  const [modalPopup, setModalPopup] = useState({
    deleteModal: false,
    id: "",
    name: "",
    index: "",
  });
  const [initialModalPopup] = useState({ ...modalPopup });
  const [params, setParams] = useState({
    text: "",
    status: "",
  });
  const [initialParams] = useState({ ...params });
  const [buttons] = useState([
    {
      title: "Add Client",
      url: "clients/addnew",
    },
    {
      title: "Upload Clients",
      url: "clients/upload",
    },
  ]);

  //From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const allClients = user.allClients;

  useEffect(() => {
    getAllClients(params);
    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  const getAllClients = (params: any) => {
    var data: any = {
      filter: {
        roles: "client",
      },
    };
    if (params.status) {
      data.filter.status = {
        $in: [params.status],
      };
    } else {
      data.filter.status = {
        $in: ["active", "inactive"],
      };
    }
    var query = buildFilter(data);
    query.text = params.text;
    query.businessId = localStorage.businessId;
    props.searchClients(query);
  };

  const handleChange = (event: any) => {
    setParams({
      ...params,
      [event.target.name]: event.target.value,
    });
  };

  const handleReset = (e: any) => {
    setParams(initialParams);
    setOrderBy(false);
    getAllClients(initialParams);
  };

  const handleSearch = (e: any) => {
    getAllClients(params);
  };

  const handleSortChange = (key: any) => {
    if (field === key) {
      setOrderBy(!orderBy);
    } else {
      setOrderBy(true);
      setField(key);
    }
    sorting(allClients, key, orderBy);
  };

  const deletePopup = (client: any, index: any) => {
    setModalPopup({
      deleteModal: !modalPopup.deleteModal,
      id: client.id,
      name: client.firstName + " " + client.lastName,
      index: index,
    });
  };

  const closeModal = () => {
    setModalPopup(initialModalPopup);
  };

  const handleDelete = () => {
    let params = {
      businessId: localStorage.getItem("businessId"),
    };
    props.deleteClient(modalPopup.id, params);
    closeModal();
    allClients.splice(modalPopup.index, 1);
  };
  //Excel Export
  const handleExportExcel = (e: any, data: any) => {
    let jsonData: any = [];
    data.forEach((client: any) => {
      jsonData.push({
        firstName: _.capitalize(client.firstName),
        lastName: _.capitalize(client.lastName),
        countryCode: client.countryCode,
        phoneNumber: client.phoneNumber,
        gender: client.gender,
        dob: client.dob ? moment(client.dob).format("MMMM DD") : "",
        status: client.status,
        createdAt: client.createdAt,
      });
    });
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "data");
    XLSX.writeFile(wb, "Clients.xlsx");
  };

  return (
    <React.Fragment>
      {user.authenticated && !UI.loading && (
        <React.Fragment>
          <PageHeader title={title} buttons={buttons} />
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <div className="ibox float-e-margins">
                  <div className="ibox-content">
                    <form role="form">
                      <div className="row">
                        <div className="col-md-5 col-sm-8">
                          <div className="form-group">
                            <label>Search</label>
                            <input
                              type="text"
                              name="text"
                              placeholder="Search by name or phone number"
                              className="form-control"
                              value={params.text}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-4">
                          <div className="form-group">
                            <label>Status</label>
                            <select
                              value={params.status}
                              className="form-control"
                              name="status"
                              onChange={handleChange}
                            >
                              <option value="">All</option>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12">
                          <div className="form-group">
                            <div>
                              <label>&nbsp;</label>
                            </div>
                            <button
                              className="btn btn-info"
                              type="button"
                              onClick={(e) => handleReset(e)}
                            >
                              Reset
                            </button>
                            &nbsp;
                            <button
                              className="btn btn-primary"
                              type="button"
                              onClick={(e) => handleSearch(e)}
                            >
                              Search
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div className="hr-line-dashed"></div>
                    {console.log(allClients)}
                    {allClients && allClients.length > 0 && (
                      <div className="row">
                        <div
                          className="col-sm-12"
                          style={{ marginBottom: "10px", textAlign: "right" }}
                        >
                          <button
                            className="btn btn-sm btn-default"
                            style={{
                              fontWeight: "600",
                              background: "#EFEFEF",
                              borderColor: "#dddddd",
                            }}
                            onClick={(e) => handleExportExcel(e, allClients)}
                          >
                            Export to Excel <i className="fa fa-download"></i>
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped table-hover dataTables-example">
                        <thead>
                          <tr key="header">
                            <th
                              className={
                                field !== "name"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }
                              onClick={(e) => handleSortChange("name")}
                            >
                              Client Name
                            </th>
                            <th
                              className={`text-center ${
                                field !== "phoneNumber"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("phoneNumber")}
                            >
                              Phone Number
                            </th>
                            <th
                              className={`text-center ${
                                field !== "email"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("email")}
                            >
                              Email
                            </th>
                            <th
                              className={`text-center ${
                                field !== "dob"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("dob")}
                            >
                              DOB
                            </th>
                            <th
                              className={`text-center ${
                                field !== "createdAt"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("createdAt")}
                            >
                              Date Added
                            </th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allClients && allClients.length ? (
                            allClients
                              .slice(
                                (activePage - 1) * perPage,
                                activePage * perPage
                              )
                              .map((client: any, index: any) => {
                                return (
                                  <tr className="gradeX" key={index}>
                                    <td>
                                      {client.firstName} {client.lastName}
                                    </td>
                                    <td className="text-center">
                                      {client.countryCode}{" "}
                                      {client.phoneNumber.replace(
                                        /^(\d{3})(\d{3})(\d{4}).*/,
                                        "($1) $2-$3"
                                      )}
                                    </td>
                                    <td>{client.email}</td>
                                    <td className="text-center">
                                      {client.dob
                                        ? moment(client.dob).format("MMMM DD")
                                        : "-"}
                                    </td>
                                    <td className="text-center">
                                      {moment(client.createdAt).format(
                                        "MMM D, y"
                                      )}
                                    </td>
                                    <td className="text-center">
                                      <Link
                                        style={{
                                          cursor: "pointer",
                                          color: "#2a6954",
                                        }}
                                        key={index}
                                        to={`/clients/view/${client.id}`}
                                      >
                                        <i
                                          title="View | Edit"
                                          className="far fa-edit"
                                        ></i>
                                      </Link>
                                      &nbsp;&nbsp;&nbsp;
                                      <a
                                        style={{
                                          cursor: "pointer",
                                          color: "#2a6954",
                                        }}
                                        onClick={() =>
                                          deletePopup(client, index)
                                        }
                                      >
                                        <i
                                          title="Delete"
                                          className="far fa-trash-alt"
                                        ></i>
                                      </a>
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-center">
                                No Clients
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {allClients.length > 10 ? (
                        <div className="text-right">
                          <Pagination
                            activePage={activePage}
                            itemsCountPerPage={perPage}
                            totalItemsCount={allClients.length}
                            pageRangeDisplayed={5}
                            onChange={(page: any) => setActivePage(page)}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DeleteModal
                title="client"
                modalPopup={modalPopup}
                closeModal={closeModal}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapActionsToProps = {
  getAllClients,
  searchClients,
  deleteClient,
};

export default connect(null, mapActionsToProps)(Clients);
