import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import PageHeader from "../../core/PageHeader";
import {
  getAllProductCategories,
  getAllProducts,
  deleteProducts,
} from "../../../redux/actions/productAction";
import { sorting, buildFilter } from "../../../utils/common";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import DeleteModal from "../../core/DeleteModal";
import _ from "lodash";

const Products = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title] = useState("Products");
  const [orderBy, setOrderBy] = useState(false);
  const [field, setField] = useState("name");
  const [perPage] = useState(10);
  const [buttons] = useState([
    {
      title: "Add Product",
      url: "products/add-new",
    },
  ]);
  const [params, setParams] = useState({
    text: "",
    brand: "",
    status: "",
    priceCondition: "more",
    price: "",
    quantityCondition: "more",
    quantity: "",
  });
  const [initialParams] = useState({ ...params });
  const [modalPopup, setModalPopup] = useState({
    deleteModal: false,
    id: "",
    name: "",
    index: "",
  });
  const [initialModalPopup] = useState({ ...modalPopup });
  const [searchResults, setSearchResults] = useState([]);

  // From Reducer
  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const product = useSelector((state: any) => state.product);

  const allCategories = product.productCategories;
  const allProducts = product.productDetails;

  //To Set Brand
  const [brand, setBrand] = useState<any[]>(["test"]);

  useEffect(() => {
    getAllProductCategories();
    getAllProducts(params);
    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  useEffect(() => {
    filterData();
    if (allProducts && allProducts && allProducts.length > 0) {
      dataFilter();
    }
  }, [allProducts]);

  const getAllProductCategories = () => {
    const params = {
      businessId: localStorage.businessId,
    };
    props.getAllProductCategories(params);
  };

  const getAllProducts = (params: any) => {
    var data: any = {};
    if (params.text && params.text.length) {
      data.name = {
        $regex: params.text,
        $options: "i",
      };
    }
    if (params.status && params.status.length) {
      if (params.status == "active")
        data.active = {
          $eq: true,
        };
      if (params.status == "inactive")
        data.active = {
          $eq: false,
        };
    }
    if (parseInt(params.price) > 0) {
      if (params.priceCondition == "more")
        data.price = {
          $gte: parseInt(params.price) * 100,
        };
      if (params.priceCondition == "less")
        data.price = {
          $lte: parseInt(params.price) * 100,
        };
    }
    if (parseInt(params.quantity) > 0) {
      if (params.quantityCondition == "more")
        data.quantity = {
          $gte: parseInt(params.quantity),
        };
      if (params.quantityCondition == "less")
        data.quantity = {
          $lte: parseInt(params.quantity),
        };
    }
    var query = buildFilter(data);
    query.businessId = localStorage.businessId;
    props.getAllProducts(query);
  };

  const handleChange = (event: any) => {
    setParams({
      ...params,
      [event.target.name]: event.target.value,
    });
  };

  const handleReset = (e: any) => {
    setParams(initialParams);
    getAllProducts(initialParams);
  };

  const handleSearch = (e: any) => {
    getAllProducts(params);
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
    props.deleteProducts(modalPopup.id, params);
    closeModal();
    searchResults.splice(modalPopup.index, 1);
  };

  const dataFilter: any = () => {
    if (allProducts && allProducts && allProducts.length > 0) {
      let status: any = allProducts
        .map((value: any) => {
          return value.brand;
        })
        .filter(
          (v: any, i: any, currentStatus: any) => currentStatus.indexOf(v) === i
        );
      setBrand(status);
      return status;
    }
  };
  
  const handleSortChange = (key: any) => {
    if (field === key) {
      setOrderBy(!orderBy);
    } else {
      setOrderBy(true);
      setField(key);
      console.log(key);
    }
    sorting(allProducts, key, orderBy);
  };

  const filterData = () => {
    if (params.brand) {
      const newFliterJob: any = allProducts.filter((data: any) => {
        return Object.values(data)
          .join(" ")
          .toLocaleLowerCase()
          .includes(params.brand.toLocaleLowerCase());
      });
      setSearchResults(newFliterJob);
    } else if (allProducts && allProducts && allProducts.length) {
      setSearchResults(allProducts);
    }
  };

  const addQuatity = (searchResults: any) => {
    let sumOfAddition = 0;
    searchResults.forEach((element: any) => {
      sumOfAddition += element.quantity;
    });
    return sumOfAddition;
  };

  const addPrice = (searchResults: any) => {
    let sumOfAddition = 0;
    searchResults.forEach((element: any) => {
      sumOfAddition +=
        _.get(element, "quantity") * _.divide(_.get(element, "price"), 100);
    });
    return sumOfAddition;
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
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label>Search</label>
                            <input
                              type="text"
                              value={params.text}
                              placeholder="Search by name"
                              className="form-control"
                              name="text"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label>Brand</label>
                            <select
                              value={params.brand}
                              className="form-control"
                              name="brand"
                              onChange={handleChange}
                            >
                              <option value="">All</option>
                              {brand &&
                                brand.length &&
                                brand.map((val: any) => {
                                  return <option value={val}>{val}</option>;
                                })}
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-3">
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
                      </div>
                      <div className="row">
                        <div className="col-sm-2">
                          <div className="form-group">
                            <label>Price</label>
                            <select
                              value={params.priceCondition}
                              className="form-control"
                              name="priceCondition"
                              onChange={handleChange}
                            >
                              <option value="more">More than</option>
                              <option value="less">Less than</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <div className="form-group">
                            <label>&nbsp;</label>
                            <input
                              type="text"
                              placeholder="Price in $"
                              className="form-control"
                              name="price"
                              value={params.price}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <div className="form-group">
                            <label>Quantity</label>
                            <select
                              value={params.quantityCondition}
                              className="form-control"
                              name="quantityCondition"
                              onChange={handleChange}
                            >
                              <option value="more">More than</option>
                              <option value="less">Less than</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <div className="form-group">
                            <label>&nbsp;</label>
                            <input
                              type="text"
                              placeholder="Quantity"
                              className="form-control"
                              name="quantity"
                              value={params.quantity}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-sm-4 text-left">
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
                              Product Name
                            </th>
                            <th
                              className={`text-center ${
                                field !== "brand"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("brand")}
                            >
                              Brand
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
                                field !== "quantity"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("quantity")}
                            >
                              Quantity
                            </th>
                            <th
                              className={`text-center ${
                                field !== "invValues"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("invValues")}
                            >
                              Values
                            </th>
                            <th
                              className={`text-center ${
                                field !== "active"
                                  ? "sorting"
                                  : orderBy
                                  ? "sorting_asc"
                                  : "sorting_desc"
                              }`}
                              onClick={(e) => handleSortChange("active")}
                            >
                              Status
                            </th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults && searchResults.length ? (
                            <React.Fragment>
                              {searchResults.map((product: any, index: any) => {
                                return (
                                  <tr className="gradeX" key={index}>
                                    <td>{product.name}</td>
                                    <td className="text-center">
                                      {product.brand}
                                    </td>
                                    <td className="text-center">
                                      ${(product.price / 100).toFixed(2)}
                                    </td>
                                    <td className="text-center">
                                      {product.quantity}
                                    </td>
                                    <td className="text-center">
                                      {product.quantity * product.price !== 0
                                        ? "$" +
                                          (
                                            (product.quantity * product.price) /
                                            100
                                          ).toFixed(2)
                                        : "-"}
                                    </td>
                                    <td className="text-center">
                                      {product.active ? "Active" : "InActive"}
                                    </td>
                                    <td className="text-center">
                                      <Link
                                        style={{
                                          cursor: "pointer",
                                          color: "#2a6954",
                                        }}
                                        key={index}
                                        to={`/products/view/${product.id}`}
                                      >
                                        <i
                                          title="View | Edit"
                                          className="far fa-edit"
                                        ></i>
                                      </Link>
                                      &nbsp;
                                      <a
                                        style={{
                                          cursor: "pointer",
                                          color: "#2a6954",
                                        }}
                                        onClick={() =>
                                          deletePopup(product, index)
                                        }
                                      >
                                        <i
                                          title="Delete"
                                          className="far fa-trash-alt"
                                        ></i>
                                      </a>
                                    </td>
                                    {/* <td className='text-center'>
                                                                                <div style={{ 'position': 'relative' }}>
                                                                                    <button data-toggle='dropdown' className='btn btn-xs btn-gray dropdown-toggle' type='button'>Action&nbsp;<span className='caret'></span></button>
                                                                                    <ul className='dropdown-menu'>
                                                                                        <li><Link key={index} to={`/products/view/${product.id}`}>View/Edit</Link></li>
                                                                                        <li><a onClick={() => deletePopup(product, index)}>Delete</a></li>
                                                                                    </ul>
                                                                                </div>
                                                                            </td> */}
                                  </tr>
                                );
                              })}
                              <tr>
                                <td colSpan={3}>
                                  <strong>Summary: </strong>
                                  <small>
                                    <i>
                                      (Gift/Packages quantity and its values are
                                      EXCLUDED in total inventory dollar count)
                                    </i>
                                  </small>
                                </td>
                                <td className="text-center">
                                  <strong>{addQuatity(searchResults)}</strong>
                                </td>
                                <td className="text-center">
                                  <strong>
                                    ${addPrice(searchResults).toFixed(2)}
                                  </strong>
                                </td>
                                <td></td>
                                <td></td>
                              </tr>
                            </React.Fragment>
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center">
                                No Products
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <DeleteModal
                title="Product"
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
  getAllProductCategories,
  getAllProducts,
  deleteProducts,
};

export default connect(null, mapActionsToProps)(Products);
