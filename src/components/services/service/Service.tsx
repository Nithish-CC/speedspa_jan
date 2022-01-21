import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import PageHeader from "../../core/PageHeader";
import {
  getAllCategory,
  getAllService,
  deleteService,
} from "../../../redux/actions/serviceActions";
import { sorting, buildFilter } from "../../../utils/common";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import DeleteModal from "../../core/DeleteModal";

const Services = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title] = useState("Services");
  const [orderBy, setOrderBy] = useState(false);
  const [field, setField] = useState("name");
  const [activePage, setActivePage] = useState(1);
  const [perPage] = useState(10);
  const [buttons] = useState([
    {
      title: "Add Service",
      url: "services/add-new/",
    },
  ]);
  const [modalPopup, setModalPopup] = useState({
    deleteModal: false,
    id: "",
    name: "",
    index: "",
  });
  const [initialModalPopup] = useState({ ...modalPopup });
  const [params, setParams] = useState({
    text: "",
    category: "",
  });
  const [initialParams] = useState({ ...params });

  // From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const service = useSelector((state: any) => state.service);
  const allCategories = service.categoryDetails;
  const allServices = service.serviceDetails;

  useEffect(() => {
    getAllCategory();
    getAllService(params);
    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  const getAllCategory = () => {
    const params = {
      businessId: localStorage.businessId,
    };
    props.getAllCategory(params);
  };

  const getAllService = (params: any) => {
    var data: any = {};
    if (params.text && params.text.length) {
      data.name = {
        $regex: params.text,
        $options: "i",
      };
    }
    if (params.category && params.category.length) {
      data.categoryId = {
        $in: [params.category],
      };
    }
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.getAllService(query);
  };

  const handleChange = (event: any) => {
    setParams({
      ...params,
      [event.target.name]: event.target.value,
    });
  };

  const handleReset = (e: any) => {
    setParams(initialParams);
    setField("name");
    setOrderBy(false);
    getAllService(initialParams);
  };

  const handleSearch = (e: any) => {
    getAllService(params);
  };

  const closeModal = () => {
    setModalPopup(initialModalPopup);
  };

  const deletePopup = (service: any, index: any) => {
    setModalPopup({
      deleteModal: !modalPopup.deleteModal,
      id: service.id,
      name: service.name,
      index: index,
    });
  };

  const handleDelete = () => {
    let params = {
      businessId: localStorage.getItem("businessId"),
    };
    props.deleteService(modalPopup.id, params);
    closeModal();
    allCategories.splice(modalPopup.index, 1);
  };

  const handleSortChange = (key: any) => {
    if (field === key) {
      setOrderBy(!orderBy);
    } else {
      setOrderBy(true);
      setField(key);
    }
    sorting(allServices, key, orderBy);
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
                              value={params.text}
                              name="text"
                              placeholder="Search by service name"
                              className="form-control"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-4">
                          <div className="form-group">
                            <label>Type</label>
                            <select
                              value={params.category}
                              className="form-control"
                              name="category"
                              onChange={handleChange}
                            >
                              <option value="">ALL</option>
                              {allCategories &&
                                allCategories.length &&
                                allCategories.map((category: any) => {
                                  return (
                                    <option
                                      key={category.name}
                                      value={category.id}
                                    >
                                      {category.name}
                                    </option>
                                  );
                                })}
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
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped table-hover dataTables-example">
                        <thead>
                          <tr>
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
                              Service Name
                            </th>
                            <th
                              className={
                                field !== "categoryName"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_desc"
                                  : "sorting_asc"
                              }
                              onClick={(e) => handleSortChange("categoryName")}
                            >
                              Service Type
                            </th>
                            <th
                              className={`text-center ${
                                field !== "price"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("price")}
                            >
                              Price
                            </th>
                            <th
                              className={`text-center ${
                                field !== "displayPrice"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("displayPrice")}
                            >
                              Display Price
                            </th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allServices && allServices.length ? (
                            allServices
                              .slice(
                                (activePage - 1) * perPage,
                                activePage * perPage
                              )
                              .map((service: any, index: any) => {
                                return (
                                  <tr className="gradeX" key={index}>
                                    <td>{service.name}</td>
                                    <td>{service.categoryName}</td>
                                    <td className="text-center">
                                      ${(service.price / 100).toFixed(2)}
                                    </td>
                                    <td className="text-center">
                                      {service.displayPrice}
                                    </td>
                                    <td className="text-center">
                                      <Link
                                        style={{
                                          cursor: "pointer",
                                          color: "#2a6954",
                                        }}
                                        key={index}
                                        to={`/services/view/${service.id}`}
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
                                          deletePopup(service, index)
                                        }
                                      >
                                        <i
                                          title="Delete"
                                          className="far fa-trash-alt"
                                        ></i>
                                      </a>
                                    </td>
                                    {/* <td>
                                                                        <div style={{ 'position': 'relative' }}>
                                                                            <button data-toggle='dropdown' className='btn btn-xs btn-gray dropdown-toggle' type='button'>Action&nbsp;<span className='caret'></span></button>
                                                                            <ul className='dropdown-menu'>
                                                                                <li><Link key={index} to={`/services/view/${service.id}`}>View/Edit</Link></li>
                                                                                <li><a onClick={() => deletePopup(service, index)}>Delete</a></li>
                                                                            </ul>
                                                                        </div>
                                                                    </td> */}
                                  </tr>
                                );
                              })
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center">
                                No Services
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {allServices.length > 10 ? (
                        <div className="text-right">
                          <Pagination
                            activePage={activePage}
                            itemsCountPerPage={perPage}
                            totalItemsCount={allServices.length}
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
                title="Service"
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
  getAllCategory,
  getAllService,
  deleteService,
};

export default connect(null, mapActionsToProps)(Services);
